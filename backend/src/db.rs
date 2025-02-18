use sqlx::{PgPool, query, query_as};
use std::env;
use dotenv::dotenv;
use crate::models::Course; // ✅ Import Course from models.rs

/// Establish a connection to the database
pub async fn establish_connection() -> PgPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgPool::connect(&database_url).await.expect("Failed to connect to database")
}

/// Ensure the required tables exist in the database
pub async fn setup_database(pool: &PgPool) {
    let create_courses_table = "
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL
        );
    ";

    let create_chapters_table = "
        CREATE TABLE IF NOT EXISTS chapters (
            id SERIAL PRIMARY KEY,
            course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
            name TEXT NOT NULL
        );
    ";

    let create_seed_questions_table = "
        CREATE TABLE IF NOT EXISTS seed_questions (
            id SERIAL PRIMARY KEY,
            chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
            question TEXT NOT NULL
        );
    ";

    // Execute each statement separately
    sqlx::query(create_courses_table)
        .execute(pool)
        .await
        .expect("Failed to create courses table");

    sqlx::query(create_chapters_table)
        .execute(pool)
        .await
        .expect("Failed to create chapters table");

    sqlx::query(create_seed_questions_table)
        .execute(pool)
        .await
        .expect("Failed to create seed_questions table");
}

/// ✅ **Function to Create a Course**
pub async fn create_course(pool: &PgPool, name: &str, description: &str) -> Result<Course, sqlx::Error> {
    let course = query_as!(
        Course,
        "INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING id, name, description",
        name,
        description
    )
    .fetch_one(pool)
    .await?;

    Ok(course)
}
