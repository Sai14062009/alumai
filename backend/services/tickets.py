# import pandas as pd
# import io
# import logging
# from typing import List, Dict, Any
# # FIX: Updated import to match your actual file name 'ai_pipeline.py'
# from .ai_pipeline import AIPipelineService

# logger = logging.getLogger(__name__)

# class TicketsService:
#     def __init__(self):
#         # This stores your Excel rows in memory while the server is running
#         self._all_tickets: List[Dict[str, Any]] = []
#         # FIX: Ensure this matches the class name in ai_pipeline.py
#         self.ai_pipeline = AIPipelineService()

#     def load_excel_data(self, file_content: bytes):
#         """Loads Excel, cleans headers, and assigns IDs."""
#         try:
#             df = pd.read_excel(io.BytesIO(file_content))
            
#             # Clean column names: remove spaces, lowercase, and handle special characters
#             df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
            
#             # Ensure every row has a unique ID for the frontend to reference
#             if 'id' not in df.columns:
#                 df['id'] = range(1, len(df) + 1)
            
#             # Convert NaN (empty cells) to empty strings so JSON doesn't break
#             df = df.fillna("")
            
#             self._all_tickets = df.to_dict(orient="records")
#             logger.info(f"Loaded {len(self._all_tickets)} tickets into memory.")
#             return {"status": "success", "count": len(self._all_tickets)}
#         except Exception as e:
#             logger.error(f"Excel Load Error: {e}")
#             return {"status": "error", "message": str(e)}

#     def get_tickets_by_source(self, source_name: str):
#         """Filters the in-memory list by the 'source' column."""
#         return [
#             t for t in self._all_tickets 
#             if str(t.get("source", "")).lower() == source_name.lower()
#         ]

#     def get_ticket_by_id(self, ticket_id: int):
#         """Finds a specific ticket by its ID."""
#         return next((t for t in self._all_tickets if t.get("id") == ticket_id), None)

#     async def classify_ticket_logic(self, ticket_id: int):
#         """Runs the 3-agent AI pipeline on a single ticket."""
#         ticket = self.get_ticket_by_id(ticket_id)
#         if not ticket:
#             return None
        
#         # We pass the raw description to the AI agents
#         description = ticket.get("description", "")
#         # Note: Ensure this matches the method name in your ai_pipeline.py
#         analysis = await self.ai_pipeline.process_ticket(description)
        
#         # Combine the original ticket data with the new AI analysis
#         return {
#             "id": ticket_id,
#             "original_data": ticket,
#             "ai_analysis": analysis,
#             # Safely grab the escalate flag from the RCA result
#             "escalate": analysis.get("rca", {}).get("escalate", False)
#         }

import logging
import pandas as pd
import io
from sqlalchemy.orm import Session
from ..database import SessionLocal, TicketModel
from .ai_pipeline import AIPipelineService

logger = logging.getLogger(__name__)

class TicketsService:
    def __init__(self):
        self.ai_pipeline = AIPipelineService()

    def load_excel_data(self, file_content: bytes):
        """Loads Excel and saves rows to SQLite, reading all available columns."""
        db = SessionLocal()
        try:
            df = pd.read_excel(io.BytesIO(file_content))
            df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
            df = df.fillna("")

            new_count = 0
            for _, row in df.iterrows():
                # Map priority to severity
                priority = str(row.get("priority", "")).strip()
                severity = None
                if priority:
                    p = priority.lower()
                    if p in ["critical", "p1", "1", "urgent"]:
                        severity = "Critical"
                    elif p in ["high", "p2", "2"]:
                        severity = "High"
                    elif p in ["medium", "p3", "3", "moderate"]:
                        severity = "Medium"
                    elif p in ["low", "p4", "4", "minor"]:
                        severity = "Low"
                    else:
                        severity = priority.capitalize()

                # Read status or default
                excel_status = str(row.get("status", "")).strip()
                status = excel_status if excel_status else "Open"

                ticket = TicketModel(
                    source=str(row.get("source", "Unknown")).strip(),
                    description=str(row.get("description", "")).strip(),
                    priority=priority,
                    asset_name=str(row.get("asset_name", "")).strip(),
                    location=str(row.get("location", "")).strip(),
                    reported_by=str(row.get("reported_by", "")).strip(),
                    created_at=str(row.get("created_at", "")).strip(),
                    severity=severity,
                    status=status,
                )
                db.add(ticket)
                new_count += 1

            db.commit()
            count = db.query(TicketModel).count()
            return {"status": "success", "new_tickets": new_count, "total_in_db": count}
        except Exception as e:
            db.rollback()
            logger.error(f"Excel Load Error: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            db.close()

    def get_tickets_by_source(self, source_name: str):
        """Queries the database for tickets by source."""
        db = SessionLocal()
        tickets = db.query(TicketModel).filter(TicketModel.source.ilike(source_name)).all()
        db.close()
        return tickets

    async def classify_ticket_logic(self, ticket_id: int) -> dict | None:
        """Runs AI pipeline and saves result to DB."""
        db: Session = SessionLocal()
        try:
            ticket = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
            if not ticket:
                return None

            analysis = await self.ai_pipeline.process_ticket(ticket.description)

            ticket.clean_description = analysis.get("clean_description", "")
            ticket.rca_analysis = analysis.get("rca", {})
            ticket.is_classified = True
            ticket.status = analysis.get("status", "Pending")
            ticket.confidence_score = analysis.get("confidence", 0.0)

            classification = analysis.get("classification", {})
            if classification.get("severity"):
                ticket.severity = classification["severity"]
            if classification.get("asset"):
                ticket.asset = classification["asset"]
            if classification.get("system"):
                ticket.system = classification["system"]

            db.commit()
            db.refresh(ticket)

            return {
                "id": ticket.id,
                "status": ticket.status,
                "confidence": ticket.confidence_score,
                "original_data": {
                    "source": ticket.source,
                    "description": ticket.description
                },
                "classification": analysis.get("classification", {}),
                "ai_analysis": ticket.rca_analysis,
                "escalate": ticket.rca_analysis.get("escalate", False) if ticket.rca_analysis else False
            }
        except Exception as e:
            db.rollback()
            logger.error(f"Classification failed for ticket {ticket_id}: {e}")
            raise
        finally:
            db.close()