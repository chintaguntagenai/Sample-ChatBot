from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

app = Flask(__name__)
CORS(app)

# Step 1: Load the tokenizer and model
model_name = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
# Step 2: Create a text2text generation pipeline
chatbot = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "") 
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    result = chatbot(prompt, max_length=50, do_sample=False)
    response = result[0]["generated_text"]
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)