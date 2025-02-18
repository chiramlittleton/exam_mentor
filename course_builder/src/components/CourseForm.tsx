import React, { useState } from "react";
import axios from "axios";

const CourseForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:4000/courses", { name, description });
      alert("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="container">
      <h2>Create a Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Course</button>
      </form>
    </div>
  );
};

export default CourseForm;
