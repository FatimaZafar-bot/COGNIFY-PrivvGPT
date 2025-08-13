from sentence_transformers import SentenceTransformer
import faiss
import os
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

index_path = "data/index.faiss"
chunks_path = "data/chunks.txt"
os.makedirs("data", exist_ok=True)

def embed_and_store(chunks):
    # Create new index
    embeddings = model.encode(chunks)
    index = faiss.IndexFlatL2(384)
    index.add(np.array(embeddings, dtype='float32'))

    # Save chunks in new file
    with open(chunks_path, "w", encoding="utf-8") as f:
        for chunk in chunks:
            f.write(chunk.strip() + "\n")

    faiss.write_index(index, index_path)
    print(f"[embed.py] Stored {len(chunks)} fresh chunks. Total vectors: {index.ntotal}")
