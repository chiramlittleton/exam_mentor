import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:4000";

export const createCourse = (name: string, description: string) => {
  return axios.post(`${API_BASE_URL}/courses`, { name, description });
};

export const fetchCourses = () => {
  return axios.get(`${API_BASE_URL}/courses`);
};

export const publishCourse = (courseId: string) => {
  return axios.patch(`${API_BASE_URL}/courses/${courseId}/publish`);
};

export {};
