import React from "react";
import CourseForm from "../components/CourseForm";

const CreateCourse: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1>Create a New Course</h1>
      <CourseForm />
    </div>
  );
};

export default CreateCourse;
