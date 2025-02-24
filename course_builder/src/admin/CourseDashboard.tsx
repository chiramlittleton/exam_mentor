import React, { useEffect, useState } from "react";
import { fetchCourses, createCourse, addChapter, addSeedQuestion, fetchChapters, fetchQuestions } from "../api";

interface SeedQuestion {
  id: number;
  question: string;
  chapterId: number;
}

interface Chapter {
  id: number;
  name: string;
  questions: SeedQuestion[];
}

interface Course {
  id: number;
  name: string;
  description: string;
  chapters?: Chapter[];
}

const CourseDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newChapter, setNewChapter] = useState("");
  const [newQuestion, setNewQuestion] = useState<{ chapterId: number | ""; question: string }>({
    chapterId: "",
    question: "",
  });

  useEffect(() => {
    const loadCourses = async () => {
      const response = await fetchCourses();
      setCourses(response);
    };
    loadCourses();
  }, []);

  const handleSelectCourse = async (course: Course) => {
    const chapters = await fetchChapters(course.id);
    
    const chaptersWithQuestions = await Promise.all(
      chapters.map(async (chapter: Chapter) => {
        const questions = await fetchQuestions(chapter.id);
        return { ...chapter, questions };
      })
    );

    setSelectedCourse({ ...course, chapters: chaptersWithQuestions });
  };

  const handleAddChapter = async () => {
    if (!newChapter || !selectedCourse) return;
    const addedChapter: Chapter = await addChapter(selectedCourse.id, newChapter);
    const updatedChapters = await fetchChapters(selectedCourse.id);
    setSelectedCourse({ ...selectedCourse, chapters: updatedChapters });
    setNewChapter("");
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.chapterId || !newQuestion.question || !selectedCourse) return;
    const chapterId = Number(newQuestion.chapterId);
    if (isNaN(chapterId)) return;

    await addSeedQuestion(chapterId, newQuestion.question);

    const updatedQuestions = await fetchQuestions(chapterId);
    setSelectedCourse({
      ...selectedCourse,
      chapters: selectedCourse.chapters?.map((ch) =>
        ch.id === chapterId ? { ...ch, questions: updatedQuestions } : ch
      ),
    });

    setNewQuestion({ chapterId: "", question: "" });
  };

  const handleCreateCourse = async () => {
    if (!newCourse.name || !newCourse.description) return;
    const createdCourse: Course = await createCourse({ name: newCourse.name, description: newCourse.description });
  
    setCourses((prevCourses) => [...prevCourses, createdCourse]);
    setNewCourse({ name: "", description: "" });
  };
  
  return (
    <div style={styles.container}>
      <h1>Course Builder</h1>

      {/* Create a New Course */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Course Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          style={styles.input}
        />
        <button onClick={handleCreateCourse} style={styles.button}>Create Course</button>
      </div>

      {/* Select a Course */}
      <h2>Courses</h2>
      <ul style={styles.courseList}>
        {courses.map((course) => (
          <li key={course.id} style={styles.courseItem}>
            <button onClick={() => handleSelectCourse(course)} style={styles.courseButton}>
              {course.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Manage Selected Course */}
      {selectedCourse && (
        <div style={styles.section}>
          <h2>Editing: {selectedCourse.name}</h2>

          {/* Add Chapter */}
          <div style={styles.addContainer}>
            <input
              type="text"
              placeholder="Chapter Name"
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleAddChapter} style={styles.button}>Add Chapter</button>
          </div>

          {/* Display Chapters and Add Questions */}
          {selectedCourse.chapters?.map((chapter) => (
            <div key={chapter.id} style={styles.chapterCard}>
              <h3 style={styles.chapterTitle}>{chapter.name}</h3>

              {/* Add Question Input */}
              <div style={styles.addContainer}>
                <input
                  type="text"
                  placeholder="Question"
                  onChange={(e) => setNewQuestion({ chapterId: chapter.id, question: e.target.value })}
                  style={styles.input}
                />
                <button onClick={handleAddQuestion} style={styles.buttonSmall}>Add Question</button>
              </div>

              {/* Display Questions */}
              <div style={styles.questionContainer}>
                {chapter.questions?.map((q) => (
                  <div key={q.id} style={styles.questionItem}>{q.question}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: "center" as const, marginTop: "50px", padding: "20px" },
  form: { marginBottom: "20px" },
  input: { padding: "10px", marginRight: "10px", width: "250px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px 20px", fontSize: "16px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#007BFF", color: "white" },
  buttonSmall: { padding: "8px 12px", fontSize: "14px", backgroundColor: "#28A745", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" },
  courseList: { listStyle: "none", padding: "0" },
  courseItem: { padding: "10px", borderBottom: "1px solid #ddd" },
  courseButton: { padding: "10px 20px", fontSize: "16px", backgroundColor: "#007BFF", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" },
  section: { marginTop: "30px", padding: "20px", borderRadius: "8px", backgroundColor: "#f8f9fa" },
  chapterCard: { backgroundColor: "white", padding: "15px", margin: "15px 0", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
  chapterTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px" },
  questionContainer: { maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px", padding: "10px", backgroundColor: "#f8f9fa" },
  questionItem: { padding: "5px 0", borderBottom: "1px solid #ddd" },
  addContainer: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px", gap: "10px" },
};

export default CourseDashboard;
