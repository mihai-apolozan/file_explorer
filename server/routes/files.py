from fastapi import APIRouter, HTTPException
from middleware.path_guard import resolve_safe_path, get_relative_path, resolve_safe_parent
from utils.fs_helpers import list_directory, get_entry_info
from middleware.models import CreateRequest, RenameRequest

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

@router.post("/files/create")
async def create_file(body: CreateRequest):
    real = resolve_safe_parent(body.path)

    if body.type == 'directory':
        try:
            real.mkdir()
        except:
            raise HTTPException(
                status_code=500,
                detail= 'Folder could not be created'
            )
    elif body.type == 'file':
        try:
            real.touch()
        except:
            raise HTTPException(
                status_code= 500,
                detail= 'File could not be created'
            )
    return get_entry_info(real)

@router.patch("/files/rename")
async def rename(body: RenameRequest):
    real = resolve_safe_path(body.path)
    
    forbidden_characters = ('\\', '/', ':', '*', '?', '"', '<', '>', '|', "'")

    if any(c in body.newName for c in forbidden_characters):
        raise HTTPException(
            status_code= 400,
            detail= 'Invalid name'
        )
    
    new_path = real.parent / body.newName

    if new_path.exists():
        raise HTTPException(
            status_code= 409,
            detail= 'Already exists'
        )
    
    real.rename(str(new_path))

    return get_entry_info(new_path)

@router.delete("/files/delete")
async def delete(path:str):
    real = resolve_safe_path(path)

    if path == '/':
        raise HTTPException(
            status_code= 403,
            detail= 'You cannot delete root'
        )

    if real.is_dir():
        if any(real.iterdir()):
            raise HTTPException(status_code=400,detail='Directory not empty')
        real.rmdir()
    else:
        real.unlink()
    
    response = 'You successfully deleted '

    response = response + path

    return response