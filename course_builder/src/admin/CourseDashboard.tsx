import React, { useEffect, useState } from "react";
import {
  fetchCourses,
  createCourse,
  addChapter,
  addSeedQuestion,
  fetchChapters,
  fetchQuestions,
} from "../api";

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
    await addChapter(selectedCourse.id, newChapter);
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
    const createdCourse: Course = await createCourse(newCourse);
    setCourses((prevCourses) => [...prevCourses, createdCourse]);
    setNewCourse({ name: "", description: "" });
  };

  return (
    <div style={styles.container}>
      <h1>Course Builder</h1>

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

      {selectedCourse && (
        <div style={styles.section}>
          <h2>Editing: {selectedCourse.name}</h2>

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

          {selectedCourse.chapters?.map((chapter) => (
            <div key={chapter.id} style={styles.chapterCard}>
              <h3 style={styles.chapterTitle}>{chapter.name}</h3>

              <div style={styles.addContainer}>
                <input
                  type="text"
                  placeholder="Question"
                  onChange={(e) => setNewQuestion({ chapterId: chapter.id, question: e.target.value })}
                  style={styles.input}
                />
                <button onClick={handleAddQuestion} style={styles.buttonSmall}>Add Question</button>
              </div>

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

const styles: Record<string, React.CSSProperties> = {
  container: { textAlign: "center", marginTop: "50px", padding: "20px" },
  form: { marginBottom: "20px" },
  input: { padding: "10px", marginRight: "10px", width: "250px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "10px 20px", fontSize: "16px", cursor: "pointer", borderRadius: "5px", border: "none", backgroundColor: "#007BFF", color: "white" },
  buttonSmall: { padding: "8px 12px", fontSize: "14px", backgroundColor: "#28A745", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" },
  questionContainer: { maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px", padding: "10px", backgroundColor: "#f8f9fa" },
};

export default CourseDashboard;
