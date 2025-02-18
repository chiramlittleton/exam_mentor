use axum::{Json, extract::State, http::StatusCode};
use sqlx::PgPool;
use crate::models::Course;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateCourseRequest {
    pub name: String,
    pub description: String,
}

pub async fn create_course_handler(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateCourseRequest>,
) -> Result<(StatusCode, Json<Course>), (StatusCode, String)> {
    match crate::db::create_course(&pool, &payload.name, &payload.description).await {
        Ok(course) => Ok((StatusCode::CREATED, Json(course))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create course: {}", e))),
    }
}
