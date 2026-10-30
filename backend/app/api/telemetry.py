from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import EnergyReading, Machine
from backend.app.schemas import TelemetryPayload
from backend.app.ai.anomaly_detector import anomaly_detector
from datetime import datetime

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.post("")
def ingest_telemetry_reading(payload: TelemetryPayload, db: Session = Depends(get_db)):
    if payload.voltage_v < 0 or payload.current_a < 0:
        raise HTTPException(status_code=400, detail="Negative electrical measurements are invalid")

    # Isolation Forest Anomaly Scoring
    is_anomaly, score, classification = anomaly_detector.predict_anomaly(
        payload.power_kw,
        payload.current_a,
        payload.voltage_v,
        payload.power_factor
    )

    reading = EnergyReading(
        machine_id=payload.machine_id,
        device_id=payload.device_id,
        voltage_v=payload.voltage_v,
        current_a=payload.current_a,
        power_factor=payload.power_factor,
        power_kw=payload.power_kw,
        energy_kwh=payload.energy_kwh,
        operating_status=payload.status,
        source="edge_iot"
    )
    db.add(reading)
    db.commit()

    return {
        "status": "ingested",
        "device_id": payload.device_id,
        "machine_id": payload.machine_id,
        "is_anomaly": is_anomaly,
        "anomaly_score": score,
        "classification": classification,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/latest")
def get_latest_telemetry():
    return {
        "device_id": "EG-N01",
        "machine_id": "MCH-001",
        "voltage_v": 230.8,
        "current_a": 45.2,
        "power_factor": 0.94,
        "power_kw": 9.85,
        "energy_kwh": 148.6,
        "status": "running",
        "source": "simulated"
    }
