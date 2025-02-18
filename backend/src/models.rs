use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Course {
    pub id: Uuid,
    pub name: String,
    pub description: String,
}
