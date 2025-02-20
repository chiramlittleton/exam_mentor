from transformers import AutoTokenizer, AutoModelForCausalLM

# Load the Phi-2 model
MODEL_NAME = "microsoft/phi-2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

# Run a simple inference
prompt = "What is the purpose of an escrow account in real estate?"
inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_length=50)

# Print response
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
