from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.llm_route import router as llm_router

app = FastAPI(title="Kubeflow Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(llm_router, tags=["LLM"])
