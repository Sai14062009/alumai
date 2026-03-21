# import logging
# from typing import Any, Dict
# from ..agents.ai_agents import _BaseLLMAgent

# logger = logging.getLogger(__name__)

# class AssistantService(_BaseLLMAgent):
#     async def handle_message(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
#         ticket_info = (
#             f"Asset: {context.get('asset', 'Unknown')}\n"
#             f"System: {context.get('system', 'Unknown')}\n"
#             f"Original Issue: {context.get('clean_description', 'No description')}\n"
#             f"AI Analysis: {context.get('rca', {}).get('root_cause', 'Not determined yet')}"
#         )

#         prompt = (
#             f"You are the AlumAI Assistant, an industrial maintenance expert.\n\n"
#             f"--- TICKET CONTEXT ---\n{ticket_info}\n\n"
#             f"Engineer's Question: {message}\n\n"
#             f"Provide a concise, expert technical response. Be helpful and professional."
#         )

#         response = await self._call_claude(prompt)

#         return {
#             "reply": response if response else "I'm having trouble connecting. Please check your API key.",
#             "context_applied": True
#         }

import json
import logging
from typing import Dict, Any
from sqlalchemy.orm import Session
from ..agents.ai_agents import AssistantAgent
from ..database import SessionLocal, TicketModel

logger = logging.getLogger(__name__)


class AssistantService(AssistantAgent):
    async def handle_message(self, ticket_id: int, user_message: str) -> Dict[str, Any]:
        """
        Handles industry-standard fluid diagnostic chat.
        """
        db: Session = SessionLocal()
        try:
            ticket = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
            if not ticket:
                return {"reply": "Ticket not found.", "status": "error"}

            chat_history = ticket.chat_history if ticket.chat_history else []
            chat_history.append({"role": "user", "content": user_message})

            history_text = ""
            for msg in chat_history[:-1]:
                role = "Engineer" if msg["role"] == "user" else "AI"
                history_text += f"{role}: {msg['content']}\n"

            prompt = (
                f"You are the AlumAI Diagnostic Partner. Help the engineer solve this ticket.\n\n"
                f"--- TICKET CONTEXT ---\n"
                f"Description: {ticket.description}\n"
                f"Initial AI Thought: {ticket.rca_analysis.get('summary', 'N/A') if ticket.rca_analysis else 'N/A'}\n\n"
                f"--- CONVERSATION HISTORY ---\n{history_text}\n"
                f"Engineer: {user_message}\n\n"
                f"DIAGNOSTIC RULES:\n"
                f"1. Be brief (max 3 sentences). No lists or bullets.\n"
                f"2. State your current hypothesis based on the new info.\n"
                f"3. Ask exactly ONE specific follow-up question to isolate the root cause."
            )

            reply = await self._call_llm(prompt,
                system_prompt="You are the AlumAI Diagnostic Partner. Help engineers solve maintenance issues. Be brief, state your hypothesis, ask ONE follow-up question."
            )
            if not reply:
                reply = "I'm having trouble processing that. Please try again."

            chat_history.append({"role": "assistant", "content": reply})

            ticket.chat_history = list(chat_history)
            db.commit()

            return {"reply": reply, "chat_history": chat_history}
        except Exception as e:
            logger.error(f"Assistant chat error: {e}")
            return {"reply": "An error occurred. Please try again.", "status": "error"}
        finally:
            db.close()

    async def finalize_rca(self, ticket_id: int) -> Dict[str, Any]:
        """
        Converts the chat investigation into a formal RCA report.
        """
        db: Session = SessionLocal()
        try:
            ticket = db.query(TicketModel).filter(TicketModel.id == ticket_id).first()
            if not ticket or not ticket.chat_history:
                return {"status": "error", "message": "No conversation history to finalize."}

            history_text = "\n".join([f"{m['role']}: {m['content']}" for m in ticket.chat_history])

            prompt = (
                f"Summarize this maintenance investigation into a formal RCA report.\n\n"
                f"Original Issue: {ticket.description}\n"
                f"Investigation Logs:\n{history_text}\n\n"
                f"Respond with ONLY a JSON object like this:\n"
                f'{{"summary":"overview of investigation","root_cause":"final determined cause","fix":"1. Step one\\n2. Step two\\n3. Step three","confidence_score":0.9}}\n\n'
                f"Rules:\n"
                f"- fix must have numbered steps based on what was discussed\n"
                f"- confidence_score 0.0 to 1.0 based on how conclusive the investigation was\n"
                f"- No markdown, no backticks, ONLY the JSON object"
            )

            res = await self._call_llm(prompt)

            if not res:
                return {"status": "error", "message": "AI service unavailable."}

            # Clean response
            cleaned = res.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            start = cleaned.find("{")
            end = cleaned.rfind("}") + 1
            if start == -1 or end <= start:
                return {"status": "error", "message": "AI returned invalid format."}

            final_data = json.loads(cleaned[start:end])

            # Normalize confidence
            conf = float(final_data.get("confidence_score", 0.8))
            if conf > 1.0:
                conf = conf / 100.0
            final_data["confidence_score"] = max(0.0, min(1.0, conf))

            # Update ticket
            ticket.rca_analysis = final_data
            ticket.status = "Resolved ✅"
            db.commit()
            db.refresh(ticket)

            return {"status": "success", "data": final_data}

        except json.JSONDecodeError as e:
            logger.error(f"Finalize JSON error: {e}")
            return {"status": "error", "message": "Failed to parse AI response."}
        except Exception as e:
            logger.error(f"Finalize error: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            db.close()