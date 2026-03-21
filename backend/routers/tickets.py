# from fastapi import APIRouter, UploadFile, File, HTTPException, status
# from ..services.tickets import TicketsService

# # We use the prefix "/tickets" so all URLs start with that
# router = APIRouter(prefix="/tickets", tags=["Tickets"])

# # Initialize the service here so it keeps the Excel data in memory
# ticket_service = TicketsService()

# @router.post("/upload", status_code=status.HTTP_201_CREATED)
# async def upload_data(file: UploadFile = File(...)):
#     """
#     Step 1: Upload the master Excel file.
#     """
#     if not file.filename.endswith(('.xlsx', '.xls')):
#         raise HTTPException(status_code=400, detail="Invalid file type. Please upload an Excel file.")
    
#     content = await file.read()
#     return ticket_service.load_excel_data(content)

# @router.get("/{source}")
# async def get_by_source(source: str):
#     """
#     Step 2: Filter tickets for the ServiceNow, Teams, or Outlook tabs.
#     """
#     tickets = ticket_service.get_tickets_by_source(source)
#     return {"source": source, "count": len(tickets), "data": tickets}

# @router.post("/classify/{ticket_id}")
# async def classify_ticket(ticket_id: int):
#     """
#     Step 3: Triggered when the user clicks 'Classify' on a specific row.
#     """
#     result = await ticket_service.classify_ticket_logic(ticket_id)
#     if not result:
#         raise HTTPException(status_code=404, detail=f"Ticket with ID {ticket_id} not found.")
#     return result

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from ..services.tickets import TicketsService
from ..database import SessionLocal, TicketModel

router = APIRouter(prefix="/tickets", tags=["Tickets"])

ticket_service = TicketsService()

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_data(file: UploadFile = File(...)):
    """
    Step 1: Upload the master Excel file.
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an Excel file.")
    
    content = await file.read()
    return ticket_service.load_excel_data(content)

@router.get("/{source}")
async def get_by_source(source: str):
    """
    Step 2: Filter tickets for the ServiceNow, Teams, or Outlook tabs.
    """
    tickets = ticket_service.get_tickets_by_source(source)
    return {"source": source, "count": len(tickets), "data": tickets}

@router.post("/classify/{ticket_id}")
async def classify_ticket(ticket_id: int):
    """
    Step 3: Triggered when the user clicks 'Classify' on a specific row.
    """
    result = await ticket_service.classify_ticket_logic(ticket_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Ticket with ID {ticket_id} not found.")
    return result

@router.post("/escalate/{ticket_id}")
async def escalate_ticket(ticket_id: int):
    """
    Step 4: Manual escalation — when a human overrides the AI's 'Resolved' decision.
    """
    db = SessionLocal()
    try:
        ticket = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found.")
        
        ticket.status = "Escalated"
        
        rca = ticket.rca_analysis or {}
        rca["manual_escalation"] = True
        rca["escalation_reason"] = "Human override — engineer requested manual review"
        ticket.rca_analysis = rca
        
        db.commit()
        db.refresh(ticket)
        
        return {
            "status": "success",
            "message": f"Ticket {ticket_id} escalated for human review.",
            "ticket_id": ticket_id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()