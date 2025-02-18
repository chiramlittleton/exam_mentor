use axum::{Router, routing::post};
use sqlx::PgPool;
use crate::handlers::create_course_handler;

pub fn create_routes(pool: PgPool) -> Router {
    Router::new()
        .route("/courses", post(create_course_handler))
        .with_state(pool)
}
