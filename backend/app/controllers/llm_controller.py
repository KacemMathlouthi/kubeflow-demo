from app.services.llm_service import get_response
from fastapi import HTTPException


async def generate_response_controller(user_message: str):
    try:
        response = await get_response(user_message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")
