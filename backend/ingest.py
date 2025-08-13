import fitz  # PyMuPDF
import re
from typing import List
from nltk.tokenize import sent_tokenize


def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)  # Remove extra whitespaces
    text = re.sub(r'•|\u2022|\uf0b7', '', text)  # Remove bullet points
    return text.strip()

def parse_and_chunk(file_bytes: bytes, filename: str, chunk_size=1000, overlap=200) -> List[str]:
    chunks = []
    if filename.endswith(".pdf"):
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = " ".join([page.get_text() for page in doc])
    else:
        text = file_bytes.decode("utf-8")

    cleaned_text = clean_text(text)

    # Sentence tokenization
    sentences = sent_tokenize(cleaned_text)

    # Sentence-based chunking
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= chunk_size:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            # Start new chunk with overlap from the previous one
            if overlap > 0:
                overlap_text = current_chunk[-overlap:]
                current_chunk = overlap_text + " " + sentence
            else:
                current_chunk = sentence

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks
