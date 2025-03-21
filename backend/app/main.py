from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.routes.llm_route import router as llm_router
from app.routes.documentation_route import router as documentation_router
from app.routes.embedding_route import router as embedding_router
from app.routes.weaviate_route import router as weaviate_router
from app.routes.websocket import router as websocket_router

app = FastAPI(title="Kubeflow Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documentation_router, tags=["Documentation"])
app.include_router(weaviate_router, tags=["Weaviate"])
app.include_router(llm_router, tags=["LLM"])
app.include_router(embedding_router, tags=["Embedding"])
app.include_router(websocket_router, tags=["WebSocket"])
