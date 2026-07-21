import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.plot_routes import router


load_dotenv()

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=[os.environ.get("FRONTEND_ORIGIN")],
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
async def health():
	return {"status": "ok"}
