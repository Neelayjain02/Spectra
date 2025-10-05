FROM python:3.11-slim

WORKDIR /app

# Copy everything including model folder
COPY . .

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
RUN pip install -r requirements.txt

# Expose port
ENV PORT=5000
EXPOSE $PORT

# Start the app
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "server:app"]
