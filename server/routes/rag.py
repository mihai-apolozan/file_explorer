from fastapi import APIRouter, HTTPException
from rag.chroma_client import collection
from pathlib import Path
from middleware.path_guard import resolve_safe_path
from rag.chunker import chunker
router = APIRouter()
from utils.fs_helpers import get_entry_info

SKIP_DIRS = {'node_modules', '__pycache__', 'venv'}
MAX_BATCH = 5000

@router.post("/rag/index")
async def index(path:str = '/'):
    real = resolve_safe_path(path)

    generator = real.rglob("*")
    number_of_files = 0
    number_of_chunks = 0
    for path_item in generator:
        if path_item.is_dir():
            continue

        parents = path_item.relative_to(real).parts[:-1]
        if any(part in SKIP_DIRS or part.startswith('.') for part in parents):
            continue

        data = chunker(path_item)
        if not data:
            continue
        number_of_chunks += len(data)
        number_of_files += 1
        for start in range(0, len(data), MAX_BATCH):
            batch = data[start:start + MAX_BATCH]
            collection.upsert(
                documents = [item['text'] for item in batch],
                ids = [f"{item['file_path']}::chunk_{item['chunk_index']}" for item in batch],
                metadatas = [{'file_path': item['file_path'], 'chunk_index': item['chunk_index']} for item in batch]
                )


    return {'files': number_of_files, 'chunks': number_of_chunks}

@router.get('/rag/search')
async def search(q: str, n: int):
    response = collection.query(query_texts= [q], n_results= n)

    findings = []

    for i in range(len(response['metadatas'][0])):
        path = response['metadatas'][0][i]['file_path']
        findings.append({
            'entry': get_entry_info(Path(path)),
            'distances': response['distances'][0][i],
            'documents': response['documents'][0][i],
            })

    return findings