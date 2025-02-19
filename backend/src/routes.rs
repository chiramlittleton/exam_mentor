use axum::{Router, routing::*};
use sqlx::PgPool;
use crate::handlers::{create_course_handler, get_courses_handler, get_course_question_handler};

pub fn create_routes(pool: PgPool) -> Router {
    Router::new()
        .route("/courses", post(create_course_handler))
        .route("/courses", get(get_courses_handler))
        .route("/courses/{course_id}/question", get(get_course_question_handler)) // ✅ Correct Axum syntax
        .with_state(pool)
}
