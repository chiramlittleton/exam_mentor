from fastapi import FastAPI
from pydantic import BaseModel
import openai
import random
import os

app = FastAPI()

# ✅ Load OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    question: str
    answers: list[str]
    correct_answer: str  # ✅ Add correct_answer field

@app.post("/generate", response_model=QuestionResponse)
async def generate_answers(request: QuestionRequest):
    """Generates multiple-choice answers for a given question using OpenAI."""

    try:
        # ✅ Ask OpenAI to generate 4 answer choices (one correct)
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a real estate exam assistant."},
                {"role": "user", "content": f"Generate 4 multiple-choice answers for this question: '{request.question}'. Make sure exactly one is correct, and list them like this:\n\n1. Correct answer\n2. Wrong answer\n3. Wrong answer\n4. Wrong answer"}
            ],
            temperature=0.7
        )

        # ✅ Extract the response text
        response_text = response.choices[0].message.content.strip()
        answer_lines = response_text.split("\n")

        # ✅ Extract correct and incorrect answers
        answers = [line[3:].strip() for line in answer_lines if line]
        correct_answer = answers[0]  # ✅ Assume the first answer is correct
        random.shuffle(answers)  # ✅ Shuffle answers so the correct one isn't always first

        return QuestionResponse(
            question=request.question,
            answers=answers,
            correct_answer=correct_answer
        )

    except Exception as e:
        return {"error": f"Failed to generate answers: {str(e)}"}
