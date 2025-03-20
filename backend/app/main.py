from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.routes.llm_route import router as llm_router
from app.routes.documentation_route import router as documentation_router

app = FastAPI(title="Kubeflow Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(llm_router, tags=["LLM"])
app.include_router(documentation_router, tags=["Documentation"])
