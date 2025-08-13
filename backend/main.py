from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from ingest import parse_and_chunk
from embed import embed_and_store
from search import query_top_k
from llm_response import generate_answer

import nltk
nltk.download('punkt')

app = FastAPI()

# Correct CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    total_chunks = 0
    for file in files:
        try:
            content = await file.read()
            chunks = parse_and_chunk(content, file.filename)

            if not chunks:
                return {"error": f"No chunks extracted from {file.filename}"}

            embed_and_store(chunks)
            total_chunks += len(chunks)
        except Exception as e:
            return {"error": f"Failed to process {file.filename}", "details": str(e)}

    return {
        "status": f"{len(files)} file(s) processed",
        "total_chunks": total_chunks
    }

@app.post("/ask/")
async def ask_question(question: str = Form(...)):
    try:
        top_chunks = query_top_k(question, k=5)
        if not top_chunks:
            return {"error": "No relevant context found. Try uploading a document first."}
        answer = generate_answer(question, top_chunks)
        return {"answer": answer, "context": top_chunks}
    except Exception as e:
        return {"error": "Failed to process question", "details": str(e)}

@app.get("/")
def read_root():
    return {
        "message": "LLM API is running. Please go to http://127.0.0.1:8000/docs to test the API."
    }
