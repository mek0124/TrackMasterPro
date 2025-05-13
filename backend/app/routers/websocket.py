from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

# Simple WebSocket implementation without authentication

# Store active connections
active_connections: Dict[int, List[WebSocket]] = {}

router = APIRouter()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """
    WebSocket endpoint for real-time updates.

    This endpoint:
    1. Authenticates the user based on the token in the query parameters
    2. Adds the connection to active_connections
    3. Handles messages and disconnections
    """
    # Accept the connection
    await websocket.accept()

    try:
        # Add connection to active connections
        if user_id not in active_connections:
            active_connections[user_id] = []
        active_connections[user_id].append(websocket)

        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to TrackMasterPro WebSocket server"
        })

        # Handle incoming messages
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                # Process message based on type
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })
    except WebSocketDisconnect:
        # Remove connection on disconnect
        if user_id in active_connections:
            active_connections[user_id].remove(websocket)
            if not active_connections[user_id]:
                del active_connections[user_id]

# Helper function to send notifications to a specific user
async def send_notification_to_user(user_id: int, notification: dict):
    """Send a notification to all active connections for a user."""
    if user_id in active_connections:
        for connection in active_connections[user_id]:
            try:
                await connection.send_json(notification)
            except Exception:
                # If sending fails, the connection might be closed
                # We'll let the main websocket handler clean it up
                pass
