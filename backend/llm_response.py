from transformers import pipeline

# Load lightweight CPU-friendly model
qa_model = pipeline("text2text-generation", model="google/flan-t5-large")

def generate_answer(query: str, contexts: list):
    context_text = "\n".join([f"- {ctx}" for ctx in contexts])
    prompt = f"Answer the question based on the following context:\n\n{context_text}\n\nQuestion: {query}\nAnswer:"

    response = qa_model(prompt, max_new_tokens=200)[0]['generated_text']
    return response.strip()
