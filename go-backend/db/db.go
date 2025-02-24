package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

var DB *pgxpool.Pool

// Connect to the database
func ConnectDB() error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL must be set")
	}

	// Create connection pool
	pool, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = pool
	fmt.Println("✅ Connected to PostgreSQL")

	// Run schema migration
	if err := RunMigrations(); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	return nil
}

// Run schema.sql if the database has no tables
func RunMigrations() error {
	// Check if any tables exist
	var tableCount int
	err := DB.QueryRow(context.Background(), "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'").Scan(&tableCount)
	if err != nil {
		return fmt.Errorf("database query error: %w", err)
	}

	if tableCount == 0 {
		fmt.Println("📂 Database is empty, loading db/schema.sql...")

		// Read the schema.sql file
		schemaSQL, err := os.ReadFile("db/schema.sql")
		if err != nil {
			return fmt.Errorf("failed to read db/schema.sql: %w", err)
		}

		// Execute the schema SQL
		_, err = DB.Exec(context.Background(), string(schemaSQL))
		if err != nil {
			return fmt.Errorf("failed to execute db/schema.sql: %w", err)
		}

		fmt.Println("✅ Database initialized successfully")
	} else {
		fmt.Println("✅ Database already contains tables, skipping db/schema.sql")
	}

	return nil
}
