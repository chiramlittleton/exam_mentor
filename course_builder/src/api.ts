import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:4000";

// ✅ Create a new course
export const createCourse = async (name: string, description: string) => {
  const response = await axios.post(`${API_BASE_URL}/courses`, { name, description });
  return response.data; // Returns the created course
};

// ✅ Fetch all courses
export const fetchCourses = async () => {
  const response = await axios.get(`${API_BASE_URL}/courses`);
  return response.data.map((course: any) => ({
    id: Number(course.id), // ✅ Ensure ID is a number
    name: course.name,
    description: course.description,
    is_published: course.is_published,
  }));
};

// ✅ Publish a course
export const publishCourse = async (courseId: number) => {
  await axios.patch(`${API_BASE_URL}/courses/${courseId}/publish`);
  return true; // Indicate success
};

export const fetchGeneratedQuestion = (courseId: number) => {
  return axios.get(`${API_BASE_URL}/courses/${courseId}/question`);
};

export {};
