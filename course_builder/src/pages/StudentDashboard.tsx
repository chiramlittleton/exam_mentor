import React, { useEffect, useState } from "react";
import { fetchCourses } from "../api";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  name: string;
  description: string;
  published: boolean;
}

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        // Only show published courses
        // const publishedCourses = response.filter((course: Course) => course.published);
        setCourses(response);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleStartCourse = (courseId: number) => {
    navigate(`/course/${courseId}`); // Navigate to the course page
  };

  return (
    <div className="container mt-4">
      <h2>Available Courses</h2>

      {loading && <p>Loading courses...</p>}
      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group">
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{course.name}</h5>
                <p>{course.description}</p>
              </div>
              <button className="btn btn-primary" onClick={() => handleStartCourse(course.id)}>
                Start Course
              </button>
            </li>
          ))
        ) : (
          <p className="text-muted">No courses available.</p>
        )}
      </ul>
    </div>
  );
};

export default StudentDashboard;
