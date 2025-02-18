import React, { useEffect, useState } from "react";
import { fetchCourses, publishCourse } from "../api";

interface Course {
  id: string;
  name: string;
  description: string;
  is_published: boolean;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    loadCourses();
  }, []);

  const handlePublish = async (courseId: string) => {
    try {
      await publishCourse(courseId);
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
      <h2>Courses</h2>
      <ul className="list-group">
        {courses.map((course) => (
          <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{course.name}</h5>
              <p>{course.description}</p>
              <span className={`badge ${course.is_published ? "bg-success" : "bg-secondary"}`}>
                {course.is_published ? "Published" : "Draft"}
              </span>
            </div>
            {!course.is_published && (
              <button className="btn btn-primary" onClick={() => handlePublish(course.id)}>
                Publish
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
export {};
