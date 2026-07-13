from fastapi import APIRouter, HTTPException
from middleware.path_guard import resolve_safe_path, get_relative_path
from utils.fs_helpers import list_directory

router = APIRouter()

@router.get("/files")
async def get_files(path: str = "/"):
    resolved = resolve_safe_path(path)

    if not resolved.is_dir():
        raise HTTPException(
            status_code = 400,
            detail = "Path is not a directory"
        )
    entries = list_directory(resolved)

    return {
        "path" : get_relative_path(resolved),
        "entries": entries,
    }

