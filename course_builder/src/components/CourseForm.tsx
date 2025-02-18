import React, { useState } from "react";
import { createCourse } from "../api";

const CourseForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Please enter course name and description");
      return;
    }
    
    try {
      await createCourse(name, description);
      setName(""); 
      setDescription("");
      alert("✅ Course created successfully!");
    } catch (error) {
      console.error("🚨 Error creating course:", error);
      alert("Failed to create course");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Create Course</button>
      </form>
    </div>
  );
};

export default CourseForm;
