# 1️⃣ Use an official lightweight Python image as a base
FROM python:3.11-slim AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

# Install dependencies inside a virtual environment
RUN python -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# 2️⃣ Final image with only necessary files
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /app/venv /app/venv

# Copy application files
COPY . .

# Expose the port FastAPI runs on
EXPOSE 5000

# Ensure the virtual environment is used when running commands
ENV PATH="/app/venv/bin:$PATH"

# Run the FastAPI application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
