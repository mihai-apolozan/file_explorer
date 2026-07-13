import mimetypes
from datetime import datetime, timezone
from pathlib import Path
from middleware.path_guard import get_relative_path

def get_entry_info(path: Path) -> dict:

    stat = path.stat()
    is_dir = path.is_dir()

    return {
        "name":path.name,
        "path":get_relative_path(path),
        "type":"directory" if is_dir else "file",
        "size": 0 if is_dir else stat.st_size,
        "modified": datetime.fromtimestamp(
            stat.st_mtime, tz = timezone.utc
        ).isoformat(),
        "mimeType": None if is_dir else mimetypes.guess_type(path.name)[0],
    }

def list_directory(dir_path: Path) -> list[dict]:

    entries = []

    for child in sorted(dir_path.iterdir()):
        try:
            entries.append(get_entry_info(child))
        except:
            pass

    return entries