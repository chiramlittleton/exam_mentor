from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import requests
import random
import os
import uvicorn

app = FastAPI()

# ✅ Enable CORS to properly handle OPTIONS requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # ✅ Ensure OPTIONS is explicitly allowed
    allow_headers=["*"],
)

# ✅ Explicitly Handle OPTIONS Requests for /generate
@app.options("/generate")
async def options_handler():
    """✅ Explicitly handle OPTIONS requests for CORS preflight."""
    return Response(status_code=200)

# ✅ Set Model Service URL
MODEL_SERVICE_URL = os.getenv("MODEL_SERVICE_URL", "http://127.0.0.1:6000/generate")

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    question: str
    answers: list[str]
    correct_answer: str

@app.post("/generate", response_model=QuestionResponse)
async def generate_answers(request: QuestionRequest):
    """Generates multiple-choice answers for a given question using the Model Service."""
    
    try:
        # ✅ Call Model Service
        response = requests.post(
            MODEL_SERVICE_URL,
            json={"question": request.question},
            timeout=5
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Model Service error: {response.text}")

        data = response.json()
        answers = data.get("answers", [])
        correct_answer = data.get("correct_answer", "")

        if not answers or not correct_answer:
            raise HTTPException(status_code=500, detail="Invalid response from Model Service")

        random.shuffle(answers)

        return QuestionResponse(
            question=request.question,
            answers=answers,
            correct_answer=correct_answer
        )

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to reach Model Service: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate answers: {str(e)}")

# ✅ Ensure the server binds to IPv4 (`0.0.0.0`)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
