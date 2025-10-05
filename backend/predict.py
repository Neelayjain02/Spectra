# predict.py
import joblib
import numpy as np
import pandas as pd
import random

# Load artifacts once
features = joblib.load("model/koi_features_list.joblib")
imputer = joblib.load("model/koi_imputer.joblib")
scaler = joblib.load("model/koi_scaler.joblib")
le = joblib.load("model/koi_label_encoder.joblib")
stack_model = joblib.load("model/koi_stack.joblib")
mlp_model = "model/koi_mlp_model.h5"  # optional MLP

# Map radius to planet type
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

# Habitability function
def compute_habitability(row):
    insolation = float(row.get("koi_insol", 0))
    teq = float(row.get("koi_teq", 0))
    if 0.75 < insolation < 1.5 and 250 < teq < 320:
        return "Habitable"
    elif insolation < 0.1 or teq < 150:
        return "Cryogenic"
    else:
        return "Non-habitable"

# Surface water proxy (0 to 1)
def estimate_surface_water(teq):
    """Estimate surface water fraction (0–1) smoothly based on temperature."""
    if teq <= 0:
        return 0
    # Peak at 288 K, drops off symmetrically with deviation
    water_fraction = np.exp(-((teq - 288) ** 2) / (2 * 70 ** 2))
    return round(float(water_fraction), 3)


# Travel time proxy (yrs) using semi-major axis (koi_sma in AU)
def estimate_travel_time_interstellar(distance_ly):
    """Interstellar travel time (Earth → exoplanet system)."""
    if distance_ly is None or distance_ly <= 0:
        distance_ly = 620  # average Kepler system distance
    speed_fraction_of_c = 0.0001  # 0.01% speed of light (~30 km/s)
    years = distance_ly / speed_fraction_of_c
    return round(years, 2)



def generate_planet_name():
    number = random.randint(100, 9999)
    suffix = random.choice(["", "b", "c", "d"])
    return f"Kepler-{number}{suffix}"

# Main prediction function
def predict_planet(sample_dict):
    # Convert all numeric values from string to float
    sample_dict = {k: (float(v) if isinstance(v, str) and v.replace('.', '', 1).isdigit() else v) for k, v in sample_dict.items()}

    # Keep only features known to the model
    row = pd.DataFrame([{f: sample_dict.get(f, np.nan) for f in features}])

    # Impute missing values
    X_imp = pd.DataFrame(imputer.transform(row), columns=features)

    # Scale
    X_scaled = scaler.transform(X_imp)

    # Predict with stacked tree model
    probs = stack_model.predict_proba(X_imp)[0]
    pred_idx = np.argmax(probs)
    ml_label = le.inverse_transform([pred_idx])[0]  # CONFIRMED / CANDIDATE / FALSE POSITIVE
    confidence = float(np.max(probs))

    # Planet radius and type
    radius = float(sample_dict.get("koi_prad", 0))
    planet_type = radius_to_planet_type(radius)

    # Habitability / orbit zone
    orbit = compute_habitability(sample_dict)

    # Optional numeric outputs
    travelTime = estimate_travel_time_interstellar(sample_dict.get("koi_sma", 0))
    surfaceWater = estimate_surface_water(sample_dict.get("koi_teq", 0))
    temperature = float(sample_dict.get("koi_teq", 0))

    output = {
        "name": generate_planet_name(),
        "ml_label": ml_label,
        "confidence": confidence,
        "type": planet_type,
        "orbit": orbit,
        "radius": radius,
        "temperature": temperature,
        "travelTime": travelTime,
        "surfaceWater": surfaceWater
    }

    return output
