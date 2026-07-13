from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import ROOT_DIR
from routes.files import router as files_router

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins = ["*"],
	allow_methods = ["*"],
	allow_headers = ["*"],
)

app.include_router(files_router, prefix = "/api")

@app.get("/api/health")
async def health_check():
	return  {"status": "ok","root_dir" : str(ROOT_DIR)}


