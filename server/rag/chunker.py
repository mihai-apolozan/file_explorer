from pathlib import Path
import mimetypes

def chunker(path: Path) -> list:
    i = 0
    chunks = []
    type = mimetypes.guess_type(path.name)[0]
    if not type or not type.startswith('text/'):
        return chunks

    text = path.read_text()

    paragraphs = text.split('\n\n')

    for paragraph in paragraphs:
        new_lines = paragraph.split('\n')
        for new_line in new_lines:
            while len(new_line) > 500:
                chunks.append(new_line[:500])
                new_line = new_line[500:]
            chunks.append(new_line)

    dict_list = []

    for chunk in chunks:
        if not chunk:
            continue
        dict_list.append({
            "text": chunk,
            "file_path": str(path),
            "chunk_index": i,
        })
        i = i+1

    return dict_list