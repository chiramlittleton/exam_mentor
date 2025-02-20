# 1️⃣ Use an official Node.js 20 image as a base
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock before installing dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire frontend source
COPY . .

# Build the React application (output will be in `/app/build`)
RUN yarn build

# 2️⃣ Runtime Stage: Serve the application with Nginx
FROM nginx:latest

# Copy the built React app from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
