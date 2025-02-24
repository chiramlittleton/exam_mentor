FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Copy schema.sql for database initialization
COPY db/schema.sql /root/db/schema.sql  

# Build the Go backend
RUN go build -o backend

# Use a smaller base image for runtime
FROM alpine:latest

WORKDIR /root/

# Copy the built binary & schema.sql
COPY --from=builder /app/backend .
COPY --from=builder /root/db/schema.sql /root/db/schema.sql  

EXPOSE 4000

CMD ["./backend"]
