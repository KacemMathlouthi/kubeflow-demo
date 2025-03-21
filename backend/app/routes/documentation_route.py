from fastapi import APIRouter
from app.controllers.documentation_controller import get_documentation_controller, embed_repository_controller


router = APIRouter()


@router.post("/documentation")
async def get_documentation(repo_name: str):
    return await get_documentation_controller(repo_name)


@router.post("/documentation/embed")
async def embed_documentation(repo_name: str):
    return await embed_repository_controller(repo_name)