import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# ✅ Use the instruction-tuned Mistral model
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"

# ✅ Load the model and tokenizer
device = "mps" if torch.backends.mps.is_available() else "cpu"  # Use Mac's Metal API if available
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,  # Use float16 for lower memory usage
    device_map="auto"  # Let Transformers decide the best device
)

# ✅ Move model to the correct device
model.to(device)

# ✅ Define a simple test prompt
prompt = "Explain the purpose of an escrow account in real estate."

# ✅ Tokenize input and move to device
inputs = tokenizer(prompt, return_tensors="pt").to(device)

# ✅ Generate a response
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,  # Limits response length
        temperature=0.7,      # Adds randomness to outputs
        do_sample=True        # Enables sampling
    )

# ✅ Decode and print response
response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("\n📝 Model Response:\n", response)
