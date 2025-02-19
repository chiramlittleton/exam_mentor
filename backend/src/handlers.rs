use axum::{Json, extract::{State, Path}, http::StatusCode};
use sqlx::PgPool;
use crate::models::{Course, QuestionResponse};
use serde::Deserialize;
use reqwest::Client;

#[derive(Deserialize)]
pub struct CreateCourseRequest {
    pub name: String,
    pub description: String,
}

/// ✅ Create a new course
pub async fn create_course_handler(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateCourseRequest>,
) -> Result<(StatusCode, Json<Course>), (StatusCode, String)> {
    match crate::db::create_course(&pool, &payload.name, &payload.description).await {
        Ok(course) => Ok((StatusCode::CREATED, Json(course))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create course: {}", e))),
    }
}

/// ✅ Get all courses
pub async fn get_courses_handler(State(pool): State<PgPool>) -> Json<Vec<Course>> {
    let courses = sqlx::query_as!(Course, "SELECT id, name, description FROM courses")
        .fetch_all(&pool)
        .await
        .expect("Failed to fetch courses");

    Json(courses)
}

/// ✅ Fetch a generated question for a course
pub async fn get_course_question_handler(
    Path(course_id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<Json<QuestionResponse>, (StatusCode, String)> {
    // Fetch a random seed question for the course
    let row = sqlx::query!(
        "SELECT q.question FROM seed_questions q
         JOIN chapters c ON q.chapter_id = c.id
         WHERE c.course_id = $1
         ORDER BY RANDOM() LIMIT 1",
        course_id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e)))?;

    if let Some(row) = row {
        let seed_question = row.question;
        
        // ✅ Call AI service (QuestionForge) to generate a question variant
        let client = Client::new();
        let response = client.post("http://127.0.0.1:5000/generate")
            .json(&serde_json::json!({ "question": seed_question }))
            .send()
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("AI service error: {}", e)))?;

        // ✅ Ensure the response structure matches `QuestionResponse`
        let json_response: serde_json::Value = response.json().await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Invalid AI response: {}", e)))?;

        let question = json_response["question"].as_str().unwrap_or("").to_string();
        let answers = json_response["answers"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|a| a.as_str().map(String::from))
            .collect::<Vec<String>>();

        let correct_answer = json_response["correct_answer"].as_str().unwrap_or("").to_string();

        Ok(Json(QuestionResponse {
            question,
            answers,
            correct_answer,
        }))
    } else {
        Err((StatusCode::NOT_FOUND, "No questions found for this course".to_string()))
    }
}
