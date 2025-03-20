from fastapi import APIRouter
from app.controllers.llm_controller import generate_response_controller


router = APIRouter()


@router.post("/llm")
async def generate_chat_response(user_message: str):
    return await generate_response_controller(user_message)
