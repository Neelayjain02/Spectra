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
        data = request.get_json(force=True)
        result = predict_planet(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))  # Use Render's port if available
    app.run(host='0.0.0.0', port=port, debug=False)
