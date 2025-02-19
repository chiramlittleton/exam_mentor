# Variables
BACKEND_DIR=backend
FRONTEND_DIR=frontend
MODEL_SERVICE_DIR=model_service
POSTGRES_CONTAINER=exam_mentor_db

# Start PostgreSQL (Docker)
.PHONY: db-start
db-start:
	@echo "Starting PostgreSQL..."
	docker run --name $(POSTGRES_CONTAINER) -e POSTGRES_USER=exam_mentor -e POSTGRES_PASSWORD=exam_mentor -e POSTGRES_DB=exam_mentor -p 5432:5432 -d postgres

# Stop & Remove PostgreSQL container
.PHONY: db-stop
db-stop:
	@echo "Stopping and removing PostgreSQL container..."
	docker stop $(POSTGRES_CONTAINER) && docker rm $(POSTGRES_CONTAINER)

# Build & Run Backend
.PHONY: backend
backend:
	@echo "Starting Rust Backend..."
	cd $(BACKEND_DIR) && cargo run

# Install Backend Dependencies
.PHONY: backend-install
backend-install:
	@echo "Installing Rust dependencies..."
	cd $(BACKEND_DIR) && cargo build

# Start Model Service
.PHONY: model-service
model-service:
	@echo "Starting Model Service..."
	cd $(MODEL_SERVICE_DIR) && uvicorn app:app --host 127.0.0.1 --port 5000 --reload

# Install Model Service Dependencies
.PHONY: model-install
model-install:
	@echo "Installing Python dependencies..."
	cd $(MODEL_SERVICE_DIR) && pip install -r requirements.txt

# Start Frontend
.PHONY: frontend
frontend:
	@echo "Starting React Frontend..."
	cd $(FRONTEND_DIR) && yarn start

# Install Frontend Dependencies
.PHONY: frontend-install
frontend-install:
	@echo "Installing Frontend dependencies..."
	cd $(FRONTEND_DIR) && yarn install

# Full Setup (Installs everything)
.PHONY: install
install: backend-install model-install frontend-install

# Run the Full System
.PHONY: run
run: db-start backend model-service frontend

# Stop Everything
.PHONY: stop
stop: db-stop
