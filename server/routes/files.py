from fastapi import APIRouter, HTTPException
from middleware.path_guard import resolve_safe_path, get_relative_path
from utils.fs_helpers import list_directory, get_entry_info

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

@router.get("/files/read")
async def read_file(path: str):
    resolved = resolve_safe_path(path)
    if resolved.is_dir():
        raise HTTPException(
            status_code = 400,
            detail = "Path is not a file"
        )
    
    info = get_entry_info(resolved)
    
    if info["mimeType"] is None:
        raise HTTPException(
            status_code= 400,
            detail = "Path is not a text file"
        )

    if 'text/' not in info['mimeType']:
        raise HTTPException(
            status_code = 400,
            detail = "File is not a text file"
        )
    
    if info['size'] > 1000000:
        raise HTTPException(
            status_code = 400,
            detail = "The file size is too big"
        )
    
    try:
        content = resolved.read_text()
    except:
        raise HTTPException(
            status_code= 500,
            detail = "Could not read file, try again"
        )
    return {
        "path" : get_relative_path(resolved),
        "content": content,
    }