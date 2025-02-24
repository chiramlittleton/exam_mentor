import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapters, fetchCourseSeedQuestions } from "../api";

interface Chapter {
  id: number;
  name: string;
}

const CoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [seedQuestions, setSeedQuestions] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching data for course ID:", id);
        
        const [chapterResponse, seedResponse] = await Promise.all([
          fetchChapters(Number(id)), 
          fetchCourseSeedQuestions(Number(id))
        ]);

        console.log("✅ Chapters API Response:", chapterResponse);
        console.log("✅ Seed Questions API Response:", seedResponse);

        // Ensure seed_questions exists before setting state
        if (seedResponse && seedResponse.seed_questions) {
          setSeedQuestions(seedResponse.seed_questions);
          console.log("🔍 Setting Seed Questions:", seedResponse.seed_questions);
        } else {
          console.warn("⚠️ seed_questions is missing in API response:", seedResponse);
          setSeedQuestions({}); // Set empty object to prevent crashes
        }

        setChapters(chapterResponse);
      } catch (error) {
        console.error("❌ Failed to load course data:", error);
      }
    };

    loadData();
}, [id]);

  return (
    <div style={styles.container}>
      <h1>Course Chapters</h1>
      <h2>Select a Chapter</h2>
      <ul style={styles.list}>
        {chapters.map((chapter) => (
          <li key={chapter.id} style={styles.listItem}>
            <span>{chapter.name}</span>
            <button 
              style={styles.button} 
              onClick={() => navigate(`/student/chapter/${chapter.id}`, { state: { questions: seedQuestions[chapter.id] || [] } })}
            >
              Start
            </button>
          </li>
        ))}
      </ul>
      <button style={styles.backButton} onClick={() => navigate("/student")}>Back</button>
    </div>
  );
};

const styles = {
  container: { textAlign: "center" as const, marginTop: "50px" },
  list: { listStyle: "none", padding: 0 },
  listItem: { display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ddd" },
  button: { padding: "8px 15px", backgroundColor: "#28A745", color: "white", border: "none", cursor: "pointer" },
  backButton: { padding: "10px 20px", marginTop: "20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#DC3545", color: "white", border: "none" },
};

export default CoursePage;
