# Default target
.DEFAULT_GOAL := run

# Define .env file location
ENV_FILE := .env

# Check if .env exists, if not, create it
env:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "🔧 Setting up environment variables..."; \
		echo "DOCKER_NAMESPACE=chiramlittleton" > $(ENV_FILE); \
		echo "OPENAI_API_KEY=" >> $(ENV_FILE); \
		echo "✅ .env file created. Please enter your OpenAI API key."; \
	fi

	@# Check if OPENAI_API_KEY is missing and prompt for input
	@if ! grep -q "OPENAI_API_KEY=" $(ENV_FILE) || [ -z "$$(grep "OPENAI_API_KEY=" $(ENV_FILE) | cut -d '=' -f2)" ]; then \
		echo "🔑 Please enter your OpenAI API key:"; \
		read key; \
		sed -i.bak "/OPENAI_API_KEY=/c\OPENAI_API_KEY=$$key" $(ENV_FILE); \
		rm -f $(ENV_FILE).bak; \
		echo "✅ API key added to .env."; \
	fi

# Pull images, run Docker Compose with the .env file
run: env
	@echo "🚀 Starting containers..."
	@docker-compose --env-file $(ENV_FILE) pull
	@docker-compose --env-file $(ENV_FILE) up -d

# Stop all containers
stop:
	@echo "🛑 Stopping containers..."
	@docker-compose down

# Clean up containers, images, and volumes
clean: stop
	@echo "🧹 Cleaning up Docker images and volumes..."
	@docker system prune -af
