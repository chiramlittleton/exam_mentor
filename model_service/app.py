import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# ✅ Model Setup
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

print("Loading model...")
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    device_map="auto",  # ✅ Automatically selects best available device (MPS, CUDA, or CPU)
    torch_dtype=torch.float16,  # ✅ Uses half-precision for efficiency
    low_cpu_mem_usage=True  # ✅ Optimize memory usage
)
print("Model loaded successfully!")

# ✅ FastAPI app
app = FastAPI()

class QueryRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_text(request: QueryRequest):
    """Handles AI-generated text requests."""
    try:
        print("\n🔵 Received request:", request.prompt)
        start_time = time.time()

        # 🛠 **Structured Prompt to Guide Model Behavior**
        system_prompt = (
            "You are an AI assistant trained in real estate. "
            "Answer concisely and clearly.\n\n"
            f"Q: {request.prompt}\nA: "
        )

        print("🟡 Tokenizing input...")
        inputs = tokenizer(system_prompt, return_tensors="pt").to(model.device)  # ✅ Ensure tensors match model device
        print("✅ Tokenization complete!")

        # Log tokenized input IDs
        print("🔢 Tokenized input IDs:", inputs["input_ids"])

        print("🟡 Generating response...")
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                max_length=200,  
                temperature=0.7,  
                do_sample=True,  
                top_k=50,  
                top_p=0.9,  
                num_return_sequences=1,  
                pad_token_id=tokenizer.eos_token_id,  
                eos_token_id=tokenizer.eos_token_id  
            )

        print("✅ Generation complete!")

        # Log raw generated output tokens
        print("🔢 Generated token IDs:", outputs)

        print("🟡 Decoding response...")
        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # 🛑 **Remove repetitive input text (post-processing)**
        response_text = response_text.replace(system_prompt, "").strip()
        print("✅ Decoding complete!")

        # Log final output
        print(f"🟢 Final response: {response_text}")

        end_time = time.time()
        print(f"⏱️ Total time taken: {end_time - start_time:.2f} seconds")

        return {"generated_text": response_text}

    except Exception as e:
        print("🔴 Model generation error:", str(e))
        raise HTTPException(status_code=500, detail=f"Model generation error: {str(e)}")

# ✅ Run with: uvicorn app:app --host 127.0.0.1 --port 5001 --reload
