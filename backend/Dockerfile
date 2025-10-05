# Use Python 3.11 slim
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for LightGBM/XGBoost
RUN apt-get update && apt-get install -y \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy all backend files
COPY . .

# Upgrade pip
RUN pip install --upgrade pip

# Install Python dependencies
RUN pip install -r requirements.txt

# Expose the port (Render provides $PORT)
ENV PORT=5000
EXPOSE $PORT

# Start app using gunicorn (server.py should define 'app')
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
