package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv" // ✅ Import strconv to convert string to int

	"example.com/go-backend/db"
	"example.com/go-backend/models"
	"github.com/go-chi/chi/v5"
)

// AddChapterHandler handles POST /api/courses/{courseId}/chapters
func AddChapterHandler(w http.ResponseWriter, r *http.Request) {
	courseIDStr := chi.URLParam(r, "courseId") // ✅ courseIDStr is a string

	courseID, err := strconv.Atoi(courseIDStr) // ✅ Convert string to int
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	var chapter models.Chapter
	if err := json.NewDecoder(r.Body).Decode(&chapter); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO chapters (course_id, name) VALUES ($1, $2) RETURNING id"
	err = db.DB.QueryRow(context.Background(), query, courseID, chapter.Name).Scan(&chapter.ID)
	if err != nil {
		log.Printf("❌ Insert error: %v", err)
		http.Error(w, "Failed to create chapter", http.StatusInternalServerError)
		return
	}

	chapter.CourseID = courseID // ✅ Assign the correct int value
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chapter) // ✅ Always return JSON
}

// GetChaptersHandler handles GET /api/courses/{courseId}/chapters
func GetChaptersHandler(w http.ResponseWriter, r *http.Request) {
	courseIDStr := chi.URLParam(r, "courseId")
	courseID, err := strconv.Atoi(courseIDStr) // ✅ Convert courseId to int
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Fetch chapters for the given course
	query := "SELECT id, name FROM chapters WHERE course_id = $1"
	rows, err := db.DB.Query(context.Background(), query, courseID)
	if err != nil {
		log.Printf("❌ Database query error: %v", err)
		http.Error(w, "Failed to fetch chapters", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var chapters []models.Chapter
	for rows.Next() {
		var chapter models.Chapter
		if err := rows.Scan(&chapter.ID, &chapter.Name); err != nil {
			http.Error(w, "Failed to process data", http.StatusInternalServerError)
			return
		}
		chapter.CourseID = courseID // ✅ Assign course ID
		chapters = append(chapters, chapter)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chapters) // ✅ Always return JSON
}
