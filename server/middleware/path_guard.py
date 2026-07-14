from pathlib import Path
from fastapi import HTTPException
from config import ROOT_DIR

def resolve_safe_path(user_path:str) -> Path:
    
    cleaned = user_path.lstrip("/")

    requested = (ROOT_DIR / cleaned).resolve()

    if not requested.is_relative_to(ROOT_DIR):
        raise HTTPException(status_code = 403, detail = "Access denied")

    if not requested.exists():
        raise HTTPException(status_code = 404, detail = "Does not exist")
    
    real = requested.resolve(strict= True)

    if not real.is_relative_to(ROOT_DIR):
        raise HTTPException(status_code = 403, detail = "Access denied")

    return real

def get_relative_path(abs_path: Path) -> str:
    return "/" + abs_path.relative_to(ROOT_DIR).as_posix()


def resolve_safe_parent(path: str) -> Path:

    cleaned = path.lstrip('/')

    parent = str(Path(cleaned).parent)

    real_parent = resolve_safe_path(parent)

    real = (real_parent/Path(cleaned).name)

    if not real.is_relative_to(ROOT_DIR):
        raise HTTPException(
            status_code=403,
            detail = 'Access denied'
        )

    if real.exists():
        raise HTTPException(
            status_code=409,
            detail = 'Already exists'
        )

    return real

