from fastapi import APIRouter, UploadFile, File, HTTPException
from ..database import SessionLocal, AssetKPIModel
import pandas as pd
import io

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.post("/kpi/upload")
async def upload_kpi_data(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        db = SessionLocal()
        try:
            # Clear existing KPI data
            db.query(AssetKPIModel).delete()

            count = 0
            for _, row in df.iterrows():
                kpi = AssetKPIModel(
                    asset_name=str(row.get('asset_name', '')).strip() if pd.notna(row.get('asset_name')) else None,
                    asset_type=str(row.get('asset_type', '')).strip() if pd.notna(row.get('asset_type')) else None,
                    complex=str(row.get('complex', '')).strip() if pd.notna(row.get('complex')) else None,
                    code=str(row.get('code', '')).strip() if pd.notna(row.get('code')) else None,
                    status=str(row.get('status', '')).strip() if pd.notna(row.get('status')) else None,
                    bath_temp=float(row['bath_temp']) if pd.notna(row.get('bath_temp')) else None,
                    flue_temp=float(row['flue_temp']) if pd.notna(row.get('flue_temp')) else None,
                    charge_weight=float(row['charge_weight']) if pd.notna(row.get('charge_weight')) else None,
                    charge_no=int(row['charge_no']) if pd.notna(row.get('charge_no')) else None,
                    sample_grade=str(row.get('sample_grade', '')).strip() if pd.notna(row.get('sample_grade')) else None,
                    cycle_time=float(row['cycle_time']) if pd.notna(row.get('cycle_time')) else None,
                    std_cycle_time=float(row['std_cycle_time']) if pd.notna(row.get('std_cycle_time')) else None,
                    cycle_step=int(row['cycle_step']) if pd.notna(row.get('cycle_step')) else None,
                    taps_taken=int(row['taps_taken']) if pd.notna(row.get('taps_taken')) else None,
                    last_tap=str(row.get('last_tap', '')).strip() if pd.notna(row.get('last_tap')) else None,
                    cast_no=str(row.get('cast_no', '')).strip() if pd.notna(row.get('cast_no')) else None,
                    cast_alloy=str(row.get('cast_alloy', '')).strip() if pd.notna(row.get('cast_alloy')) else None,
                    cast_speed=float(row['cast_speed']) if pd.notna(row.get('cast_speed')) else None,
                    cast_length=float(row['cast_length']) if pd.notna(row.get('cast_length')) else None,
                    time_remaining=float(row['time_remaining']) if pd.notna(row.get('time_remaining')) else None,
                    bct=float(row['bct']) if pd.notna(row.get('bct')) else None,
                )
                db.add(kpi)
                count += 1

            db.commit()
            return {"status": "success", "count": count}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            db.close()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/kpi/all")
async def get_all_kpis():
    db = SessionLocal()
    try:
        kpis = db.query(AssetKPIModel).all()
        result = []
        for k in kpis:
            result.append({
                "id": k.id,
                "asset_name": k.asset_name,
                "asset_type": k.asset_type,
                "complex": k.complex,
                "code": k.code,
                "status": k.status,
                "bath_temp": k.bath_temp,
                "flue_temp": k.flue_temp,
                "charge_weight": k.charge_weight,
                "charge_no": k.charge_no,
                "sample_grade": k.sample_grade,
                "cycle_time": k.cycle_time,
                "std_cycle_time": k.std_cycle_time,
                "cycle_step": k.cycle_step,
                "taps_taken": k.taps_taken,
                "last_tap": k.last_tap,
                "cast_no": k.cast_no,
                "cast_alloy": k.cast_alloy,
                "cast_speed": k.cast_speed,
                "cast_length": k.cast_length,
                "time_remaining": k.time_remaining,
                "bct": k.bct,
            })
        return {"kpis": result, "count": len(result)}
    finally:
        db.close()