import os
from pathlib import Path
from dotenv import load_dotenv

# Machine-specific settings live in server/.env, which is gitignored.
# Anchored to this file so it does not depend on the working directory.
load_dotenv(Path(__file__).resolve().parent / ".env")

ROOT_DIR = Path(
    os.environ.get("ROOT_DIR", Path.home() / "explorer-test")
).resolve()

PORT = int(os.environ.get("PORT", "8000"))
