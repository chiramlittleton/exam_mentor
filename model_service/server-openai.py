import openai
import random
from fastapi import FastAPI
from pydantic import BaseModel
import os

# FastAPI app initialization
app = FastAPI()

# Set OpenAI API key (replace with your token directly or load it from environment variables)
openai.api_key = os.getenv("OPENAI_API_KEY", "insert-key")

# Define request and response models
class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    question: str
    answers: list[str]
    correct_answer: str

@app.get("/")
def home():
    return {"message": "OpenAI Multiple-Choice Generation API"}

@app.post("/generate", response_model=QuestionResponse)
async def generate_answers(request: QuestionRequest):
    """Generates multiple-choice answers for a given question using OpenAI."""

    try:

        response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": f"You are assisting in generating multiple-choice questions. Base your answers on the following seed question: '{request.question}'."},
        {"role": "user", "content": f"Generate 4 multiple-choice answers for this question: '{request.question}'. Make sure exactly one is correct, and list them like this:\n\n1. Correct answer\n2. Wrong answer\n3. Wrong answer\n4. Wrong answer"}
    ],
    temperature=0.7,
    max_tokens=150
)

        # Extract the response text and process the answers
        response_text = response['choices'][0]['message']['content'].strip()
        answer_lines = response_text.split("\n")

        # Extract the correct and incorrect answers
        answers = [line[3:].strip() for line in answer_lines if line]
        correct_answer = answers[0]  # Assume the first answer is correct
        answers_shuffled = answers.copy()  # Copy and shuffle the answers so the correct one isn't always first
        random.shuffle(answers_shuffled)

        return QuestionResponse(
            question=request.question,
            answers=answers_shuffled,
            correct_answer=correct_answer
        )

    except Exception as e:
        return {"error": f"Failed to generate answers: {str(e)}"}
