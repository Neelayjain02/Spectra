# Use Python 3.11 (stable for ML libraries)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
RUN pip install -r requirements.txt

# Expose port (Render sets $PORT automatically)
ENV PORT=5000
EXPOSE $PORT

# Start the app using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
