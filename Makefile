# ===========================
# Exam Mentor - Full Makefile
# ===========================

# 📂 Directories
BACKEND_DIR=backend
FRONTEND_DIR=course_builder
QUESTION_FORGE_DIR=question_forge
MODEL_SERVICE_DIR=model_service
VENV=$(QUESTION_FORGE_DIR)/venv

# 🛠️ Detect the correct Python & Pip
PYTHON := $(shell command -v python3 || command -v python)
PIP := $(VENV)/bin/pip

# =========================================================
# 🚀 GLOBAL SETUP
# =========================================================
.PHONY: setup
setup: backend-install frontend-install question-forge-install
	@echo "✅ Exam Mentor setup complete!"

# =========================================================
# 🦀 RUST BACKEND COMMANDS
# =========================================================
.PHONY: backend-install
backend-install:
	@echo "🦀 Installing Rust dependencies..."
	cd $(BACKEND_DIR) && cargo build

.PHONY: backend-run
backend-run:
	@echo "🦀 Starting Rust backend..."
	cd $(BACKEND_DIR) && cargo run

# =========================================================
# 🎨 FRONTEND COMMANDS
# =========================================================
.PHONY: frontend-install
frontend-install:
	@echo "🎨 Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && yarn install

.PHONY: frontend-run
frontend-run:
	@echo "🎨 Starting frontend..."
	cd $(FRONTEND_DIR) && yarn start

# =========================================================
# 🔥 QUESTION FORGE (Python AI Service)
# =========================================================
.PHONY: question-forge-venv
question-forge-venv:
	@echo "🐍 Setting up Python virtual environment..."
	@if [ ! -d "$(VENV)" ]; then cd $(QUESTION_FORGE_DIR) && $(PYTHON) -m venv venv; fi

.PHONY: question-forge-install
question-forge-install: question-forge-venv
	@echo "🐍 Installing Question Forge dependencies..."
	cd $(QUESTION_FORGE_DIR) && $(VENV)/bin/python -m pip install --upgrade pip && $(PIP) install -r requirements.txt

.PHONY: question-forge-run
question-forge-run:
	@echo "🤖 Starting Question Forge (AI Service)..."
	cd $(QUESTION_FORGE_DIR) && $(VENV)/bin/uvicorn app:app --host 127.0.0.1 --port 5000 --reload

# =========================================================
# 📚 MODEL SERVICE (Optional Future Component)
# =========================================================
.PHONY: model-service-install
model-service-install:
	@echo "📚 Installing Model Service dependencies..."
	cd $(MODEL_SERVICE_DIR) && pip install -r requirements.txt

.PHONY: model-service-run
model-service-run:
	@echo "📚 Starting Model Service..."
	cd $(MODEL_SERVICE_DIR) && uvicorn app:app --host 127.0.0.1 --port 5001 --reload

# =========================================================
# 🚀 RUN EVERYTHING (Full System)
# =========================================================
.PHONY: run-all
run-all:
	@echo "🚀 Starting all services..."
	@make -j3 backend-run frontend-run question-forge-run

# =========================================================
# 🛑 STOP EVERYTHING (Future use)
# =========================================================
.PHONY: stop-all
stop-all:
	@echo "🛑 Stopping all services..."
	@pkill -f "cargo run" || true
	@pkill -f "yarn start" || true
	@pkill -f "uvicorn app:app" || true

# =========================================================
# ✅ CLEANUP & RESET
# =========================================================
.PHONY: clean
clean:
	@echo "🧹 Cleaning up..."
	rm -rf $(BACKEND_DIR)/target
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(VENV)
