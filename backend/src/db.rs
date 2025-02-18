use sqlx::{PgPool, query};
use std::env;
use dotenv::dotenv;

pub async fn establish_connection() -> PgPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgPool::connect(&database_url).await.expect("Failed to connect to database")
}

pub async fn setup_database(pool: &PgPool) {
    // Execute table creation separately to avoid SQL errors
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
            course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
            name TEXT NOT NULL
        );
    ";

    let create_seed_questions_table = "
        CREATE TABLE IF NOT EXISTS seed_questions (
            id SERIAL PRIMARY KEY,
            chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
            question TEXT NOT NULL
        );
    ";

    query(create_courses_table)
        .execute(pool)
        .await
        .expect("Failed to create courses table");

    query(create_chapters_table)
        .execute(pool)
        .await
        .expect("Failed to create chapters table");

    query(create_seed_questions_table)
        .execute(pool)
        .await
        .expect("Failed to create seed_questions table");
}
