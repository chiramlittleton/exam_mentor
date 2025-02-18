import React, { useState } from "react";
import { createCourse } from "../api";

const CreateCourse: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const result = await createCourse(name, description);
    if (result) {
      setMessage("Course created successfully!");
      setName("");
      setDescription("");
    } else {
      setMessage("Failed to create course.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Course</h2>
      {message && <p className="alert alert-info">{message}</p>}
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
        <button type="submit" className="btn btn-primary">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;
