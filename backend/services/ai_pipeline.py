# # backend/services/ai_pipeline.py
# import logging
# from typing import Any, Dict
# from ..agents.ai_agents import TicketIntakeAgent, TicketClassifierAgent, RCAAgent

# logger = logging.getLogger(__name__)

# class AIPipelineService:
#     def __init__(self) -> None:
#         self._intake_agent = TicketIntakeAgent()
#         self._classifier_agent = TicketClassifierAgent()
#         self._rca_agent = RCAAgent()

#     async def process_ticket(self, description: str) -> Dict[str, Any]:
#         result: Dict[str, Any] = {
#             "clean_description": description,
#             "classification": {"asset": "Unknown", "system": "Unknown", "severity": "Medium"},
#             "rca": {"summary": "Analysis incomplete", "root_cause": "Pending", "fix": "N/A", "confidence_score": 0.0, "escalate": True},
#             "status": "Pending",
#             "confidence": 0.0
#         }

#         try:
#             clean_text = await self._intake_agent.process(description)
#             result["clean_description"] = clean_text
#         except Exception:
#             logger.exception("AI Pipeline: Intake step failed")
#             clean_text = description

#         try:
#             classification = await self._classifier_agent.classify(clean_text)
#             result["classification"].update(classification)
#         except Exception:
#             logger.exception("AI Pipeline: Classification step failed")

#         try:
#             rca_input = {
#                 "description": clean_text,
#                 "asset": result["classification"].get("asset"),
#                 "system": result["classification"].get("system"),
#                 "severity": result["classification"].get("severity")
#             }
#             rca_results = await self._rca_agent.analyze(rca_input)
            
#             confidence = float(rca_results.get("confidence_score", 0.0))
            
#             # Confidence Threshold Logic
#             if confidence >= 0.7:
#                 rca_results["escalate"] = False
#                 result["status"] = "Resolved"
#             else:
#                 rca_results["escalate"] = True
#                 result["status"] = "Escalated"

#             result["confidence"] = confidence
#             result["rca"] = rca_results
            
#         except Exception:
#             logger.exception("AI Pipeline: RCA step failed")
#             result["status"] = "Error"

#         return result

# backend/services/ai_pipeline.py
import json
import logging
from typing import Any, Dict
from ..agents.ai_agents import SingleCallAnalyzer

logger = logging.getLogger(__name__)


class AIPipelineService:
    def __init__(self) -> None:
        self._analyzer = SingleCallAnalyzer()

    async def process_ticket(self, description: str) -> Dict[str, Any]:
        """
        Single LLM call pipeline. 
        Before: 4 calls (Intake → Classifier → RCA → Evaluator) = rate limit hell
        Now: 1 call that does everything = works on free Groq
        """

        result: Dict[str, Any] = {
            "clean_description": description,
            "classification": {"asset": "Unknown", "system": "Unknown", "severity": "Medium"},
            "rca": {},
            "status": "Pending",
            "confidence": 0.0
        }

        try:
            # ONE call does everything
            analysis = await self._analyzer.full_analysis(description)

            print(f"\n>>> FINAL ANALYSIS RESULT:")
            print(f"    Asset: {analysis.get('asset')}")
            print(f"    System: {analysis.get('system')}")
            print(f"    Severity: {analysis.get('severity')}")
            print(f"    Root Cause: {analysis.get('root_cause', '')[:100]}")
            print(f"    Fix: {analysis.get('fix', '')[:100]}")
            print(f"    Confidence: {analysis.get('confidence_score')}")
            print(f"    Escalate: {analysis.get('escalate')}\n")

            # Map to result structure
            result["clean_description"] = analysis.get("clean_description", description)

            result["classification"] = {
                "asset": analysis.get("asset", "Unknown"),
                "system": analysis.get("system", "Unknown"),
                "severity": analysis.get("severity", "Medium")
            }

            confidence = float(analysis.get("confidence_score", 0.0))
            should_escalate = analysis.get("escalate", False)

            # Only escalate if confidence is very low OR explicitly flagged
            if confidence < 0.4 or should_escalate:
                result["status"] = "Escalated"
            else:
                result["status"] = "Resolved"

            result["confidence"] = confidence

            result["rca"] = {
                "summary": analysis.get("summary", ""),
                "root_cause": analysis.get("root_cause", ""),
                "fix": analysis.get("fix", ""),
                "confidence_score": confidence,
                "escalate": result["status"] == "Escalated"
            }

            return result

        except Exception as e:
            logger.exception(f"Pipeline failed: {e}")
            result["status"] = "Error"
            result["rca"] = {
                "summary": "Pipeline error occurred.",
                "root_cause": f"Error: {str(e)}",
                "fix": "1. Check backend logs\n2. Retry classification",
                "confidence_score": 0.0,
                "escalate": True
            }
            return result