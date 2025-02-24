package main

import (
	"fmt"
	"log"
	"net/http"

	"example.com/go-backend/db"
	"example.com/go-backend/routes"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// Connect to the database
	err := db.ConnectDB()
	if err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// ✅ FIX CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"}, // ✅ Allow all origins (for now)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// ✅ Ensure OPTIONS requests are handled to avoid 405 errors
	r.Options("/*", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Register API routes
	routes.SetupRoutes(r)

	port := "4000"
	fmt.Printf("🚀 Server running at http://0.0.0.0:%s/\n", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, r))
}
