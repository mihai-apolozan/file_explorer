import chromadb
from pathlib import Path

# Anchored to server/ so the DB location does not depend on the working directory.
CHROMA_DIR = Path(__file__).resolve().parent.parent / "chroma_data"

client = chromadb.PersistentClient(path = str(CHROMA_DIR))

collection = client.get_or_create_collection("file_chunks")

