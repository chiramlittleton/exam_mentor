package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv" // ✅ Needed to convert URL params

	"example.com/go-backend/db"
	"example.com/go-backend/models"
	"github.com/go-chi/chi/v5"
)

// Define request payload
type GenerateQuestionRequest struct {
	SeedQuestion string `json:"seed_question"`
}

// Define response payload
type GenerateQuestionResponse struct {
	Question      string   `json:"question"`
	Answers       []string `json:"answers"`
	CorrectAnswer string   `json:"correct_answer"`
}

// AddSeedQuestionHandler handles POST /api/chapters/{chapterId}/questions
func AddSeedQuestionHandler(w http.ResponseWriter, r *http.Request) {
	chapterIDStr := chi.URLParam(r, "chapterId")
	chapterID, err := strconv.Atoi(chapterIDStr) // ✅ Convert chapterId from string to int
	if err != nil {
		http.Error(w, "Invalid chapter ID", http.StatusBadRequest)
		return
	}

	var question models.SeedQuestion
	if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO seed_questions (chapter_id, question) VALUES ($1, $2) RETURNING id"
	err = db.DB.QueryRow(context.Background(), query, chapterID, question.Question).Scan(&question.ID)
	if err != nil {
		log.Printf("❌ Insert error: %v", err)
		http.Error(w, "Failed to create seed question", http.StatusInternalServerError)
		return
	}

	question.ChapterID = chapterID // ✅ Assign correct int value
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(question) // ✅ Always return JSON
}

// GetSeedQuestionsHandler handles GET /api/chapters/{chapterId}/questions
func GetSeedQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	chapterIDStr := chi.URLParam(r, "chapterId")
	chapterID, err := strconv.Atoi(chapterIDStr) // ✅ Convert chapterId to int
	if err != nil {
		http.Error(w, "Invalid chapter ID", http.StatusBadRequest)
		return
	}

	// Fetch questions for the given chapter
	query := "SELECT id, question FROM seed_questions WHERE chapter_id = $1"
	rows, err := db.DB.Query(context.Background(), query, chapterID)
	if err != nil {
		log.Printf("❌ Database query error: %v", err)
		http.Error(w, "Failed to fetch questions", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var questions []models.SeedQuestion
	for rows.Next() {
		var question models.SeedQuestion
		if err := rows.Scan(&question.ID, &question.Question); err != nil {
			http.Error(w, "Failed to process data", http.StatusInternalServerError)
			return
		}
		question.ChapterID = chapterID // ✅ Assign chapter ID
		questions = append(questions, question)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(questions) // ✅ Always return JSON
}

func GetCourseSeedQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	courseIDStr := chi.URLParam(r, "courseId")
	courseID, err := strconv.Atoi(courseIDStr) // ✅ Convert courseId to int
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Fetch questions for the given course
	query := `
		SELECT c.id AS chapter_id, q.question 
		FROM chapters c
		JOIN seed_questions q ON c.id = q.chapter_id
		WHERE c.course_id = $1
	`

	rows, err := db.DB.Query(context.Background(), query, courseID)
	if err != nil {
		log.Printf("❌ Database query error: %v", err)
		http.Error(w, "Failed to fetch questions", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	seedQuestions := make(map[int][]string)

	for rows.Next() {
		var chapterID int
		var question string

		if err := rows.Scan(&chapterID, &question); err != nil {
			http.Error(w, "Failed to process data", http.StatusInternalServerError)
			return
		}

		seedQuestions[chapterID] = append(seedQuestions[chapterID], question)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(seedQuestions) // ✅ Always return JSON
}

// GenerateQuestionHandler sends the seed question to Question Forge
func GenerateQuestionHandler(w http.ResponseWriter, r *http.Request) {
	var req GenerateQuestionRequest

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	fmt.Println("✅ Received seed question:", req.SeedQuestion)

	// 🔥 Call Question Forge
	questionResponse, err := callQuestionForge(req.SeedQuestion)
	if err != nil {
		http.Error(w, "Failed to generate question from Question Forge", http.StatusInternalServerError)
		return
	}

	// Send response back to frontend
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(questionResponse)
}

func callQuestionForge(seedQuestion string) (GenerateQuestionResponse, error) {
	// Get Question Forge API URL
	questionForgeURL := "http://host.docker.internal:5001"
	if questionForgeURL == "" {
		return GenerateQuestionResponse{}, fmt.Errorf("missing Question Forge API URL")
	}

	// ✅ Ensure we send the correct JSON format
	requestPayload := map[string]string{
		"question": seedQuestion, // ✅ Should be "question", not "seed_question"
	}

	requestBody, err := json.Marshal(requestPayload)
	if err != nil {
		return GenerateQuestionResponse{}, fmt.Errorf("failed to encode JSON: %v", err)
	}

	// 🔍 Log request before sending it
	fmt.Println("🔍 Sending request to Question Forge:", questionForgeURL+"/generate")
	fmt.Println("🔍 Request payload:", string(requestBody))

	// Create HTTP request to Question Forge
	req, _ := http.NewRequest("POST", questionForgeURL+"/generate", bytes.NewBuffer(requestBody))
	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("❌ Error sending request to Question Forge:", err)
		return GenerateQuestionResponse{}, err
	}
	defer resp.Body.Close()

	// Read and log response
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("🔍 Response from Question Forge:", string(body))

	// Check for HTTP errors
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("❌ Question Forge returned HTTP %d: %s\n", resp.StatusCode, string(body))
		return GenerateQuestionResponse{}, fmt.Errorf("Question Forge error: %s", string(body))
	}

	// Parse JSON response
	var questionForgeResponse GenerateQuestionResponse
	json.Unmarshal(body, &questionForgeResponse)

	return questionForgeResponse, nil
}
