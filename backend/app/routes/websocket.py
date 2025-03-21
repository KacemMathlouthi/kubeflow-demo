from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket_manager import ConnectionManager
from app.services.llm_service import get_response
from uuid import uuid4

router = APIRouter()
manager = ConnectionManager()


@router.websocket("/ws/chat/{llm_model}/{temperature}/{max_tokens}")
async def chat_websocket(websocket: WebSocket, llm_model: str, temperature: float, max_tokens: int):
    # Create a new conversation
    conversation_id = str(uuid4())

    # Connect the WebSocket
    await manager.connect(websocket, conversation_id)

    try:
        while True:
            # Receive message from client
            user_message = await websocket.receive_text()

            # Get bot's response using the LLM service
            llm_response = await get_response(user_message=user_message,
                                              llm_model=llm_model,
                                              temperature=temperature,
                                              max_tokens=max_tokens)

            # Send response back to client
            await manager.send_message(conversation_id, llm_response)

    except WebSocketDisconnect:
        manager.disconnect(conversation_id)
    except Exception as e:
        error_message = f"Error: {str(e)}"
        await manager.send_message(conversation_id, error_message)
        manager.disconnect(conversation_id)
