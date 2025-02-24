package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"example.com/go-backend/db"     // ✅ Import database connection
	"example.com/go-backend/models" // ✅ Import the Course model
)

// GetCoursesHandler handles GET /api/courses requests
func GetCoursesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(context.Background(), "SELECT id, name, description FROM courses")
	if err != nil {
		log.Printf("❌ Database query error: %v", err)
		http.Error(w, "Failed to fetch courses", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var courses []models.Course
	for rows.Next() {
		var course models.Course
		err := rows.Scan(&course.ID, &course.Name, &course.Description)
		if err != nil {
			log.Printf("❌ Row scan error: %v", err)
			http.Error(w, "Failed to process data", http.StatusInternalServerError)
			return
		}
		courses = append(courses, course)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

// CreateCourseHandler handles POST /api/courses requests
func CreateCourseHandler(w http.ResponseWriter, r *http.Request) {
	var course models.Course
	err := json.NewDecoder(r.Body).Decode(&course)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING id"
	err = db.DB.QueryRow(context.Background(), query, course.Name, course.Description).Scan(&course.ID)
	if err != nil {
		log.Printf("❌ Insert error: %v", err)
		http.Error(w, "Failed to create course", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(course)
}
