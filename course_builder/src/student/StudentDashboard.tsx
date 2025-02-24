import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../api";

interface Course {
  id: number;
  name: string;
  description: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      const response = await fetchCourses();
      setCourses(response);
    };
    loadCourses();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Student Dashboard</h1>
      <h2>Select a Course</h2>
      <ul style={styles.list}>
        {courses.map((course) => (
          <li key={course.id} style={styles.listItem}>
            <span>{course.name}</span>
            <button style={styles.button} onClick={() => navigate(`/student/course/${course.id}`)}>Select</button>
          </li>
        ))}
      </ul>
      <button style={styles.backButton} onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

const styles = {
  container: { textAlign: "center" as const, marginTop: "50px" },
  list: { listStyle: "none", padding: 0 },
  listItem: { display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ddd" },
  button: { padding: "8px 15px", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" },
  backButton: { padding: "10px 20px", marginTop: "20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#DC3545", color: "white", border: "none" },
};

export default StudentDashboard;
