# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements first for efficient caching
COPY requirements.txt .

# Install dependencies system-wide (no venv needed)
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the application port (inside container)
EXPOSE 5000

# Run the application using Uvicorn
CMD ["uvicorn", "questionforge:app", "--host", "0.0.0.0", "--port", "5000"]
