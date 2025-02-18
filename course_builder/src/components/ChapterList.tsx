import React, { useEffect, useState } from "react";
import { fetchCourses, publishCourse } from "../api";

interface Course {
  id: number;
  name: string;
  description: string;
  published: boolean;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    loadCourses();
  }, []);

  const handlePublish = async (courseId: number) => { // ✅ Ensure it's a number
    try {
      await publishCourse(courseId); // ✅ Correctly passes a number
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, is_published: true } : course
        )
      );
    } catch (error) {
      console.error("Error publishing course:", error);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>Available Courses</h2>
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
