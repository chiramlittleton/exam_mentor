import React from "react";
import CourseList from "../components/CourseList";

const Dashboard: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1>Course Dashboard</h1>
      <CourseList />
    </div>
  );
};

export default Dashboard;
export {};
