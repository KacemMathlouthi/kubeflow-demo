from app.services.embedding_service import get_embeddings
from fastapi import HTTPException


async def generate_embeddings_controller(text: str):
    try:
        embeddings = get_embeddings(text)
        return {"embeddings": embeddings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {e}")
