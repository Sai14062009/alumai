import pandas as pd
import io
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class AssetsService:
    """
    Business logic for managing the plant's machinery/assets.
    """
    def __init__(self):
        # In-memory storage (Note: resets on server restart)
        self._assets: List[Dict[str, Any]] = []

    def load_assets_from_excel(self, file_content: bytes) -> Dict[str, Any]:
        """
        Parses an Excel file and stores the records.
        """
        try:
            # Read Excel from bytes
            df = pd.read_excel(io.BytesIO(file_content))
            
            # Standardize headers: "Asset ID" -> "asset_id"
            df.columns = [
                str(c).strip().lower().replace(" ", "_") 
                for c in df.columns
            ]
            
            # Convert to list of dictionaries
            self._assets = df.to_dict(orient="records")
            
            logger.info(f"Successfully loaded {len(self._assets)} assets.")
            return {"status": "success", "count": len(self._assets)}
            
        except Exception as e:
            logger.error(f"Failed to load assets: {str(e)}")
            return {"status": "error", "message": str(e)}

    def list_assets(self) -> List[Dict[str, Any]]:
        """Returns the current list of assets."""
        return self._assets