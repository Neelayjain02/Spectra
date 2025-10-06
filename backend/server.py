from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_planet

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Exoplanet Prediction API is live 🚀"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        result = predict_planet(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
