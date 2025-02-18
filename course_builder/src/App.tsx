import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Exam Mentor</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Create Course</Link>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<CreateCourse />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
