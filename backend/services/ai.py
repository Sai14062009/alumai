from typing import Any, Dict
from .ai_pipeline import AIPipelineService

class AIService:
    """
    Business logic for AI-related operations.
    """
    def __init__(self):
        self.pipeline = AIPipelineService()

    async def process_maintenance_ticket(self, description: str) -> Dict[str, Any]:
        """
        Runs the raw description through the single-call AI Pipeline.
        """
        return await self.pipeline.process_ticket(description)