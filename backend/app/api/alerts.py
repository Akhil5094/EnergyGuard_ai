from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from backend.app.database import get_db
from backend.app.models import Alert
from backend.app.schemas import AlertResponse
from datetime import datetime

router = APIRouter(prefix="/alerts", tags=["Alerts"])

class ResolveAlertRequest(BaseModel):
    resolution_notes: str

@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).all()
    if not alerts:
        return [
            AlertResponse(
                id="ALT-101",
                factory_id="fac-001",
                machine_id="MCH-003",
                alert_type="idle_waste",
                severity="warning",
                title="Excessive Idle Energy Waste",
                description="Hydraulic press motor idling for 142 mins with zero work strokes.",
                triggered_value="3.82 kW (142m idle)",
                threshold="Threshold: >3.5 kW for >15m",
                status="active",
                timestamp=datetime.utcnow()
            ),
            AlertResponse(
                id="ALT-102",
                factory_id="fac-001",
                machine_id="MCH-002",
                alert_type="power_spike",
                severity="critical",
                title="Overload Power Spike Detected",
                description="Compressor power surged to 23.9 kW (108.6% of rated 22 kW).",
                triggered_value="23.9 kW",
                threshold="Rated Limit: 22.0 kW",
                status="active",
                timestamp=datetime.utcnow()
            )
        ]
    return alerts

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = "acknowledged"
        db.commit()
    return {"status": "acknowledged", "alert_id": alert_id}

@router.post("/{alert_id}/resolve")
def resolve_alert(alert_id: str, req: ResolveAlertRequest, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = "resolved"
        alert.resolution_notes = req.resolution_notes
        db.commit()
    return {"status": "resolved", "alert_id": alert_id, "notes": req.resolution_notes}
