import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# ✅ Use a smaller model optimized for low RAM
MODEL_NAME = "microsoft/phi-1_5"

# ✅ Load tokenizer
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# ✅ Detect device: Use MPS (Mac GPU) if available, otherwise use CPU
device = "mps" if torch.backends.mps.is_available() else "cpu"

# ✅ Load model WITHOUT bitsandbytes
print(f"Loading model on {device}...")
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    device_map="auto",  # Automatically selects the best available device
    torch_dtype=torch.float16,  # Use half precision
    low_cpu_mem_usage=True  # Optimize memory usage
).to(device)

print("Model loaded successfully!")

# ✅ Function to generate responses
def generate_text(prompt: str, max_length=100):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    
    print("Generating response...")
    with torch.no_grad():  # Disable gradient tracking to save memory
        outputs = model.generate(
            **inputs, 
            max_length=max_length, 
            do_sample=True, 
            temperature=0.7
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

# ✅ Example usage
if __name__ == "__main__":
    prompt = "Explain the concept of escrow in real estate."
    result = generate_text(prompt)
    print("\nGenerated Response:")
    print(result)
