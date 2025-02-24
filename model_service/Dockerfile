# Step 1: Use an official Python base image
FROM python:3.9-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the requirements file into the container
COPY requirements.txt .

# Step 4: Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the app code into the container
COPY . .

# Step 6: Expose the port the app will run on
EXPOSE 6000

# Step 7: Run the FastAPI app using Uvicorn
CMD ["uvicorn", "server-openai:app", "--host", "0.0.0.0", "--port", "6000"]
