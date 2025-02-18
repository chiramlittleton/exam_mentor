import React from "react";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";

const Dashboard: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-primary">Course Builder</h1>
      <p className="lead">Create and manage your courses.</p>
      <CourseForm />
      <hr />
      <CourseList />
    </div>
  );
};

export default Dashboard;
