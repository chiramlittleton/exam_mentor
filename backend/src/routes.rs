use axum::{Router, routing::*};
use sqlx::PgPool;
use crate::handlers::create_course_handler;
use crate::handlers::get_courses_handler;

pub fn create_routes(pool: PgPool) -> Router {
    Router::new()
        .route("/courses", post(create_course_handler))
        .route("/courses", get(get_courses_handler))
        .with_state(pool)
}
