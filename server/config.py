import os
from pathlib import Path

ROOT_DIR = Path(
    os.environ.get("ROOT_DIR", Path.home() / "explorer-test")
).resolve()

PORT = int(os.environ.get("PORT", "8000"))
