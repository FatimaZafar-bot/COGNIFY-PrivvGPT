# backend/search.py
from sentence_transformers import SentenceTransformer
import faiss
import os
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

index_path = "data/index.faiss"
chunks_path = "data/chunks.txt"

def query_top_k(query: str, k=5):
    if not os.path.exists(index_path) or not os.path.exists(chunks_path):
        raise RuntimeError("Index or chunks not found. Please upload a document first.")

    index = faiss.read_index(index_path)

    with open(chunks_path, "r", encoding="utf-8") as f:
        stored_chunks = f.readlines()

    if not stored_chunks:
        raise RuntimeError("No chunks found in chunks.txt")

    query_embedding = model.encode([query])
    distances, indices = index.search(np.array(query_embedding, dtype='float32'), k)

    top_chunks = [stored_chunks[i].strip() for i in indices[0] if i < len(stored_chunks)]

    print(f"[search.py] Query: {query}")
    print(f"[search.py] Retrieved {len(top_chunks)} chunks:")
    for i, chunk in enumerate(top_chunks):
        print(f"  Chunk {i+1}: {chunk[:100]}...")

    return top_chunks
