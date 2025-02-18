use axum::{Json, extract::State};
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
) -> Json<Course> {
    let course = crate::db::create_course(&pool, &payload.name, &payload.description)
        .await
        .expect("Failed to create course");

    Json(course)
}
