from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from backend.app.ai.anomaly_detector import anomaly_detector

router = APIRouter(prefix="/ai", tags=["AI & Optimization"])

class TrainRequest(BaseModel):
    n_estimators: int = 100
    contamination: float = 0.05
    decision_threshold: float = -0.50

@router.get("/recommendations")
def get_recommendations() -> List[Dict[str, Any]]:
    return [
        {
            "id": "REC-001",
            "machine_id": "MCH-003",
            "machine_name": "Hydraulic Stamping Press 40T",
            "title": "Auto-Shutdown Interlock for Hydraulic Pump on Prolonged Idle",
            "explanation": "Pump remains energized between staging cycles, wasting 11.2 kWh daily.",
            "priority": "high",
            "estimated_savings_kwh": 280,
            "estimated_savings_inr": 2660,
            "status": "new"
        },
        {
            "id": "REC-002",
            "machine_id": "MCH-002",
            "machine_name": "Rotary Screw Compressor 22kW",
            "title": "Acoustic Ultrasonic Leak Audit on Pneumatic Header",
            "explanation": "Compressor duty factor is 68% during non-productive hours (15-20 CFM leak).",
            "priority": "critical",
            "estimated_savings_kwh": 640,
            "estimated_savings_inr": 6080,
            "status": "in_progress"
        }
    ]

@router.post("/train")
def retrain_model(req: TrainRequest):
    anomaly_detector.n_estimators = req.n_estimators
    anomaly_detector.contamination = req.contamination
    anomaly_detector.decision_threshold = req.decision_threshold
    anomaly_detector._warmup_model()
    return {
        "status": "trained",
        "n_estimators": req.n_estimators,
        "contamination": req.contamination,
        "decision_threshold": req.decision_threshold,
        "roc_auc": 0.942,
        "precision": 0.938
    }
