use serde::{Deserialize, Serialize};

// ✅ Course Model
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Course {
    pub id: i32, // Use i32 because SERIAL in Postgres maps to an integer
    pub name: String,
    pub description: String,
}

// ✅ Chapter Model
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Chapter {
    pub id: i32,
    pub course_id: i32, // Foreign key reference
    pub name: String,
}

// ✅ Seed Question Model
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SeedQuestion {
    pub id: i32,
    pub chapter_id: i32, // Foreign key reference
    pub question: String,
}
