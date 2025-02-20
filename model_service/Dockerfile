# 1️⃣ Use a minimal Python base image
FROM python:3.11-slim

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy dependencies and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4️⃣ Copy all files
COPY . .

# 5️⃣ Expose API port (FastAPI defaults to 8000)
EXPOSE 8000

# 6️⃣ Run the service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
