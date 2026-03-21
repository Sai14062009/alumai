from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.ai import AIService  # Pointing to the AIService we define below

class TicketRequest(BaseModel):
    description: str

router = APIRouter()
# We initialize the Service, which handles the logic
ai_service = AIService()

@router.post("/process-ticket")
async def process_ticket(ticket: TicketRequest) -> dict:
    """
    Endpoint for the 'Classify' button.
    """
    try:
        # Pass the work to the service
        result = await ai_service.process_maintenance_ticket(ticket.description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Processing failed: {str(e)}")