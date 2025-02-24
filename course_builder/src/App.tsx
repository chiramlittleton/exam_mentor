import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CourseDashboard from "./admin/CourseDashboard";
import StudentDashboard from "./student/StudentDashboard";
import CoursePage from "./student/CoursePage";
import QuizPage from "./student/QuizPage";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome to Exam Mentor</h1>
      <p>Choose your role:</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/admin")}>
          Course Admin
        </button>
        <button style={styles.button} onClick={() => navigate("/student")}>
          Student
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<CourseDashboard />} />
        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/course/:id" element={<CoursePage />} />
        <Route path="/student/chapter/:id" element={<QuizPage />} />
      </Routes>
    </Router>
  );
};

const styles = {
  container: {
    textAlign: "center" as const,
    marginTop: "50px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  button: {
    padding: "15px 25px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
  },
};

export default App;
