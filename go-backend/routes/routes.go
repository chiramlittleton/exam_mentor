package routes

import (
	"example.com/go-backend/handlers"
	"github.com/go-chi/chi/v5"
)

func SetupRoutes(r *chi.Mux) {
	r.Route("/api", func(api chi.Router) {
		api.Get("/courses", handlers.GetCoursesHandler)
		api.Post("/courses", handlers.CreateCourseHandler)

		// ✅ Ensure these exist for chapters
		api.Post("/courses/{courseId}/chapters", handlers.AddChapterHandler)
		api.Get("/courses/{courseId}/chapters", handlers.GetChaptersHandler)

		// ✅ Ensure these exist for seed questions
		api.Post("/chapters/{chapterId}/questions", handlers.AddSeedQuestionHandler)
		api.Get("/chapters/{chapterId}/questions", handlers.GetSeedQuestionsHandler)

		// 🔥 NEW: Fetch all seed questions for a course
		api.Get("/courses/{courseId}/questions", handlers.GetCourseSeedQuestionsHandler)

		// 🔥 NEW: Generate a multiple-choice question
		api.Post("/generate", handlers.GenerateQuestionHandler)
	})
}
