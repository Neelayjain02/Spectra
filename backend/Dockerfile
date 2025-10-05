# Use Python 3.11 (stable for ML libraries)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Install system dependencies (for LightGBM/XGBoost)
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install Python dependencies
RUN pip install -r requirements.txt

# Expose port (Render sets $PORT automatically)
ENV PORT=5000
EXPOSE $PORT

CMD ["gunicorn", "server:app", "--bind", "0.0.0.0:$PORT"]

