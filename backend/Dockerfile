# 1️⃣ Build Stage: Use an official Rust image to compile the application
FROM rust:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Install latest Rust stable version inside the container
RUN rustup update stable && rustup default stable

# Copy Cargo.toml and Cargo.lock separately to leverage Docker layer caching
COPY Cargo.toml Cargo.lock ./

# Create an empty src directory to allow dependencies to be downloaded first
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Fetch dependencies first (leveraging caching)
RUN cargo build --release && rm -rf src/main.rs

# Copy actual source code
COPY . .

# Compile the Rust application
RUN cargo build --release

# 2️⃣ Runtime Stage: Use a minimal base image for the final container
FROM debian:bullseye-slim

# Set the working directory
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/backend .

# Expose the application port
EXPOSE 4000

# Run the Rust backend
CMD ["./backend"]
