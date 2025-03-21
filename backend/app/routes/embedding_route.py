from fastapi import APIRouter
from app.controllers.embedding_controller import generate_embeddings_controller

router = APIRouter()


@router.post("/embeddings")
async def generate_embeddings(text: str):
    return await generate_embeddings_controller(text)
