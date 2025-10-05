# server.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_planet

app = Flask(__name__)
CORS(app) 

@app.route('/')
def home():
    return "Exoplanet Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON input from frontend
        data = request.get_json(force=True)

        # Call the prediction function
        result = predict_planet(data)

        # Return as JSON
        return jsonify(result)
    except Exception as e:
        # Catch all errors and return message
        return jsonify({"error": str(e)}), 500
        
port = int(os.environ.get("PORT", 5000))





