import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# ✅ Force CPU mode (prevents MPS out-of-memory errors)
device = "cpu"

# ✅ Load Mistral-7B model
MODEL_NAME = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(device)

# ✅ Generate a response from a test prompt
def generate_response(prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_length=50, do_sample=True, temperature=0.7)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# ✅ Run a test prompt
if __name__ == "__main__":
    prompt = "What is the purpose of an escrow account in real estate?"
    response = generate_response(prompt)
    print("Generated Response:", response)
