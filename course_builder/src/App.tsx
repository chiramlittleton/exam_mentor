import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseDashboard from "./pages/CourseDashboard"; // Course creator dashboard
import StudentDashboard from "./pages/StudentDashboard"; // Student course list
import CoursePage from "./pages/CoursePage"; // Course-taking UI

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CourseDashboard />} /> {/* Default view: Course Creator */}
          <Route path="/student" element={<StudentDashboard />} /> {/* Student Dashboard */}
          <Route path="/course/:courseId" element={<CoursePage />} /> {/* View individual course */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
