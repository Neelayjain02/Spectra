# predict.py
import joblib
import numpy as np
import pandas as pd
import random

# ---------------- Load Artifacts ----------------
features = joblib.load("model/koi_features_list.joblib")
imputer = joblib.load("model/koi_imputer.joblib")
scaler = joblib.load("model/koi_scaler.joblib")
le = joblib.load("model/koi_label_encoder.joblib")
stack_model = joblib.load("model/koi_stack.joblib")
mlp_model = "model/koi_mlp_model.h5"  # optional MLP

# ---------------- Helper Functions ----------------
def radius_to_planet_type(radius):
    if radius <= 1.0:
        return "Sub-Earth"
    elif radius <= 1.75:
        return "Super-Earth"
    elif radius <= 3.5:
        return "Mini-Neptune"
    elif radius <= 7.0:
        return "Hot-Jupiter"
    else:
        return "Ice Giant"

def compute_habitability(row):
    insolation = float(row.get("koi_insol", 0))
    teq = float(row.get("koi_teq", 0))
    if 0.75 < insolation < 1.5 and 250 < teq < 320:
        return "Habitable"
    elif insolation < 0.1 or teq < 150:
        return "Cryogenic"
    else:
        return "Non-habitable"

def estimate_surface_water(teq):
    if teq <= 0:
        return 0
    water_fraction = np.exp(-((teq - 288) ** 2) / (2 * 70 ** 2))
    return round(float(water_fraction), 3)

def estimate_travel_time_interstellar(distance_ly):
    if distance_ly is None or distance_ly <= 0:
        distance_ly = 620  # average Kepler system distance
    speed_fraction_of_c = 0.0001  # 0.01% speed of light (~30 km/s)
    years = distance_ly / speed_fraction_of_c
    return round(years, 2)

def generate_planet_name():
    number = random.randint(100, 9999)
    suffix = random.choice(["", "b", "c", "d"])
    return f"Kepler-{number}{suffix}"

# ---------------- Main Prediction Function ----------------
def predict_planet(sample_dict):
    # Convert numeric strings to floats
    sample_dict = {
        k: (float(v) if isinstance(v, str) and v.replace('.', '', 1).isdigit() else v)
        for k, v in sample_dict.items()
    }

    # Prepare model features
    row = pd.DataFrame([{f: sample_dict.get(f, np.nan) for f in features}])

    # Impute and scale
    X_imp = pd.DataFrame(imputer.transform(row), columns=features)
    X_scaled = scaler.transform(X_imp)

    # Predict stacked model probabilities
    probs_array = stack_model.predict_proba(X_imp)[0]
    labels = le.classes_
    probs_dict = {label: float(prob) for label, prob in zip(labels, probs_array)}
    pred_idx = np.argmax(probs_array)
    ml_label = le.inverse_transform([pred_idx])[0]
    confidence = float(probs_array[pred_idx])

    # Planet characteristics
    radius = float(sample_dict.get("koi_prad", 0))
    planet_type = radius_to_planet_type(radius)
    orbit = compute_habitability(sample_dict)
    travelTime = estimate_travel_time_interstellar(sample_dict.get("koi_sma", 0))
    surfaceWater = estimate_surface_water(sample_dict.get("koi_teq", 0))
    temperature = float(sample_dict.get("koi_teq", 0))

    # Construct final output
    output = {
        "name": generate_planet_name(),
        "pred_label": ml_label,       # predicted label
        "proba": probs_dict,          # all label probabilities for confidence bars
        "type": planet_type,
        "orbit": orbit,
        "radius": radius,
        "temperature": temperature,
        "travelTime": travelTime,
        "surfaceWater": surfaceWater
    }

    return output
