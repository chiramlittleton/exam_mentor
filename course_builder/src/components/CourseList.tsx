import React, { useEffect, useState } from "react";
import { fetchCourses, publishCourse } from "../api";

interface Course {
  id: number;
  name: string;
  description: string;
  published?: boolean;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        const formattedCourses = response.map((course: Course) => ({
          ...course,
          published: course.published ?? false, // ✅ Default to `false` if missing
        }));
        console.log("📡 API Response:", formattedCourses); // 🔍 Debugging
        setCourses(formattedCourses);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);
  
  const handlePublish = async (courseId: number) => {
    try {
      await publishCourse(courseId);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, published: true } : course
        )
      );
    } catch (error) {
      console.error("Error publishing course:", error);
    }
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
                <span className={`badge ${course.published ? "bg-success" : "bg-secondary"}`}>
                  {course.published ? "Published" : "Draft"}
                </span>
              </div>
              {!course.published && (
                <button className="btn btn-primary" onClick={() => handlePublish(course.id)}>
                  Publish
                </button>
              )}
            </li>
          ))
        ) : (
          <p className="text-muted">No courses available.</p>
        )}
      </ul>
    </div>
  );
};

export default CourseList;
