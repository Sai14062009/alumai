from fastapi import APIRouter, UploadFile, File, status, HTTPException
from ..services.assets import AssetsService

router = APIRouter(prefix="/assets", tags=["Assets"])

# Initialize the service
asset_service = AssetsService()

@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_assets():
    """
    Returns the list of all machinery in the plant.
    """
    assets = asset_service.list_assets()
    return {"assets": assets}

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_asset_list(file: UploadFile = File(...)):
    """
    Endpoint to upload the Master Asset Excel sheet.
    """
    # Validation: Ensure it's an Excel file
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="File must be an Excel spreadsheet.")

    content = await file.read()
    result = asset_service.load_assets_from_excel(content)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result