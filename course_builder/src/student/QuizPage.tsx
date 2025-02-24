import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGeneratedQuestion } from "../api";

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const seedQuestions: string[] = location.state?.questions || [];

  const [questionData, setQuestionData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [usedSeeds, setUsedSeeds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = async () => {
    if (seedQuestions.length === 0) return;
    
    let newSeed;
    do {
      newSeed = seedQuestions[Math.floor(Math.random() * seedQuestions.length)];
    } while (usedSeeds.has(newSeed) && usedSeeds.size < seedQuestions.length);

    setUsedSeeds(new Set([...Array.from(usedSeeds), newSeed]));

    try {
      const response = await fetchGeneratedQuestion(newSeed);
      setQuestionData(response);
      setSelectedAnswer(null);
      setFeedback(null);
      setIsCorrect(null);
    } catch (error) {
      console.error("Failed to generate question:", error);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (answer === questionData?.correct_answer) {
      setIsCorrect(true);
      setFeedback("✅ Correct!");
      setSelectedAnswer(answer);
    } else {
      setIsCorrect(false);
      setFeedback("❌ Incorrect! Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quiz</h1>
      
      {questionData ? (
        <>
          <h2 style={styles.question}>{questionData.question}</h2>
          <div style={styles.answersContainer}>
            {questionData.answers.map((answer: string, index: number) => (
              <button
                key={index}
                style={{
                  ...styles.answerButton,
                  backgroundColor:
                    selectedAnswer === answer
                      ? isCorrect
                        ? "#28a745"
                        : "#dc3545"
                      : "white",
                  color: selectedAnswer === answer ? "white" : "black",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = selectedAnswer === answer
                    ? isCorrect
                      ? "#28a745"
                      : "#dc3545"
                    : "white")
                }
                onClick={() => handleAnswerSelect(answer)}
                disabled={isCorrect ?? undefined} 
              >
                {answer}
              </button>
            ))}
          </div>

          {feedback && <p style={{ ...styles.feedback, color: isCorrect ? "#28a745" : "#dc3545" }}>{feedback}</p>}

          {/* Buttons are now aligned correctly: Back | Finish | Next */}
          <div style={styles.buttonContainer}>
            <button style={styles.controlButton} onClick={() => navigate(-1)}>
              Back
            </button>
            <button style={styles.controlButton} onClick={() => navigate("/student")}>
              Finish Quiz
            </button>
            <button 
              style={{
                ...styles.controlButton, 
                opacity: isCorrect ? 1 : 0.5, 
                pointerEvents: isCorrect ? "auto" : "none",
              }} 
              onClick={loadNewQuestion} 
              disabled={!isCorrect}
            >
              Next Question
            </button>
          </div>
        </>
      ) : (
        <p style={styles.loadingText}>Loading question...</p>
      )}
    </div>
  );
};

// 💡 Improved Styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  question: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    maxWidth: "600px",
  },
  answersContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(200px, 1fr))", // Two-column layout
    gap: "10px",
    maxWidth: "500px",
    marginBottom: "20px",
  },
  answerButton: {
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    textAlign: "center" as const,
  },
  feedback: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  controlButton: {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  loadingText: {
    fontSize: "18px",
    color: "#6c757d",
  },
};

export default QuizPage;
