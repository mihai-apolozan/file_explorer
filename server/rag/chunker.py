from pathlib import Path
import mimetypes

CHUNK_SIZE = 800
OVERLAP = 100

def chunker(path: Path) -> list:
    type, encoding = mimetypes.guess_type(path.name)
    if not type or not type.startswith('text/') or encoding:
        return []

    try:
        text = path.read_text()
    except (UnicodeDecodeError, OSError):
        return []

    # Split on blank lines, then hard-split any paragraph too big to fit a chunk.
    pieces = []
    for paragraph in text.split('\n\n'):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        while len(paragraph) > CHUNK_SIZE:
            pieces.append(paragraph[:CHUNK_SIZE])
            paragraph = paragraph[CHUNK_SIZE - OVERLAP:]
        pieces.append(paragraph)

    # Group pieces up to CHUNK_SIZE, carrying the tail of each chunk into the next.
    chunks = []
    current = ''
    for piece in pieces:
        if not current:
            current = piece
        elif len(current) + len(piece) + 2 > CHUNK_SIZE:
            chunks.append(current)
            current = current[-OVERLAP:] + '\n\n' + piece
        else:
            current = current + '\n\n' + piece
    if current:
        chunks.append(current)

    dict_list = []

    for i, chunk in enumerate(chunks):
        dict_list.append({
            "text": chunk,
            "file_path": str(path),
            "chunk_index": i,
        })

    return dict_list
