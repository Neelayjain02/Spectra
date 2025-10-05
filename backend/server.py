# server.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_planet

app = Flask(__name__)
CORS(app)  # Allow frontend requests

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))  # Render sets the PORT environment variable
    app.run(host='0.0.0.0', port=port, debug=False)
