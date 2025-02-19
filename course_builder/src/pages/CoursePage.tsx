import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGeneratedQuestion } from "../api";

interface QuestionData {
  question: string;
  answers: string[];
  correct_answer: string;
}

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch a question
  const loadQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetchGeneratedQuestion(parseInt(courseId!));
      setQuestionData(response.data);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [courseId]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === questionData?.correct_answer);
  };

  return (
    <div className="container mt-4">
      <h2>Course Questions</h2>

      {loading ? (
        <p>Loading question...</p>
      ) : questionData ? (
        <div>
          <h4>{questionData.question}</h4>
          <ul className="list-group">
            {questionData.answers.map((answer, index) => (
              <li
                key={index}
                className={`list-group-item ${selectedAnswer === answer ? (isCorrect ? "bg-success text-white" : "bg-danger text-white") : ""}`}
                onClick={() => handleAnswerSelect(answer)}
                style={{ cursor: "pointer" }}
              >
                {answer}
              </li>
            ))}
          </ul>

          {selectedAnswer && (
            <p className={`mt-3 ${isCorrect ? "text-success" : "text-danger"}`}>
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </p>
          )}

          <button
            className="btn btn-primary mt-3"
            onClick={loadQuestion}
            disabled={!selectedAnswer}
          >
            Next Question
          </button>
        </div>
      ) : (
        <p className="text-muted">No questions available.</p>
      )}
    </div>
  );
};

export default CoursePage;
