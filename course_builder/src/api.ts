const API_BASE_URL = "http://127.0.0.1:4000/api";

// ✅ Fetch all courses
export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/courses`);
  return response.json();
};

// ✅ Create a new course
export const createCourse = async (course: { name: string; description: string }) => {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  return response.json();
};


// ✅ Add a seed question to a chapter
export const addSeedQuestion = async (chapterId: number, question: string) => {
  const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return response.json();
};

export const publishCourse = async (courseId: number) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const addChapter = async (courseId: number, name: string) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${await response.text()}`); // ✅ Handle bad responses
  }

  return response.json(); // ✅ Prevents "Unexpected end of JSON input"
};

export const fetchChapters = async (courseId: number) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters`);
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
};

export const fetchQuestions = async (chapterId: number) => {
  const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/questions`);
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
};

export const fetchGeneratedQuestion = async (seedQuestion: string) => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seed_question: seedQuestion }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate question");
  }

  return await response.json();
};

export const fetchCourseSeedQuestions = async (courseId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/questions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch seed questions: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response from fetchCourseSeedQuestions:", data);

    // ✅ Wrap the response correctly
    return { seed_questions: data };
  } catch (error) {
    console.error("❌ Error fetching seed questions:", error);
    return { seed_questions: {} }; // Prevent undefined state
  }
};
