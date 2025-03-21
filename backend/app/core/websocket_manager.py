from fastapi import WebSocket
from typing import Dict


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = (
            {}
        )  # {conversation_id: websocket}

    async def connect(self, websocket: WebSocket, conversation_id: str):
        await websocket.accept()
        self.active_connections[conversation_id] = websocket

    def disconnect(self, conversation_id: str):
        if conversation_id in self.active_connections:
            del self.active_connections[conversation_id]

    async def send_message(self, conversation_id: str, message: str):
        if conversation_id in self.active_connections:
            websocket = self.active_connections[conversation_id]
            await websocket.send_text(message)
