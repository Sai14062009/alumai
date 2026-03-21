# from fastapi import APIRouter, status, HTTPException
# from pydantic import BaseModel
# from typing import Dict, Any
# from ..services.assistant import AssistantService

# router = APIRouter(prefix="/assistant", tags=["Assistant Chatbot"])
# service = AssistantService()

# class ChatRequest(BaseModel):
#     message: str
#     ticket_context: Dict[str, Any]

# @router.post("/message", status_code=status.HTTP_200_OK)
# async def assistant_message(payload: ChatRequest):
#     """
#     Sends a message to the AI Assistant with ticket context.
#     """
#     try:
#         response = await service.handle_message(
#             payload.message, 
#             payload.ticket_context
#         )
#         return response
#     except Exception as e:
#         # Log the error for debugging
#         print(f"Assistant Router Error: {e}")
#         raise HTTPException(status_code=500, detail="The AI Assistant is currently offline.")


from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from ..services.assistant import AssistantService

router = APIRouter(prefix="/assistant", tags=["Assistant"])
service = AssistantService()

class ChatRequest(BaseModel):
    ticket_id: int
    message: str

@router.post("/message")
async def send_message(payload: ChatRequest):
    """Send a troubleshooting message to the AI."""
    return await service.handle_message(payload.ticket_id, payload.message)

@router.post("/finalize/{ticket_id}")
async def finalize_ticket(ticket_id: int):
    """Convert the current chat into a final, closed RCA report."""
    result = await service.finalize_rca(ticket_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result