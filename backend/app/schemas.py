from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "operator"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class MachineBase(BaseModel):
    name: str
    machine_type: str
    factory_id: str = "fac-001"
    location: str
    rated_power_kw: float
    status: str = "running"

class MachineCreate(MachineBase):
    esp32_device_id: str

class MachineResponse(MachineBase):
    id: str
    current_power_kw: float = 0.0
    total_energy_kwh: float = 0.0
    voltage_v: float = 230.0
    current_a: float = 0.0
    power_factor: float = 0.92
    last_communication: datetime
    class Config:
        from_attributes = True

class TelemetryPayload(BaseModel):
    device_id: str
    machine_id: str
    timestamp: Optional[datetime] = None
    voltage_v: float
    current_a: float
    power_factor: float = 0.92
    power_kw: float
    interval_seconds: int = 2
    energy_kwh: float
    status: str = "running"

class AnomalyResponse(BaseModel):
    status: str
    device_id: str
    machine_id: str
    is_anomaly: bool
    anomaly_score: float
    anomaly_type: Optional[str] = None
    description: Optional[str] = None

class AlertResponse(BaseModel):
    id: str
    factory_id: str
    machine_id: str
    alert_type: str
    severity: str
    title: str
    description: str
    triggered_value: str
    threshold: str
    status: str
    timestamp: datetime
    resolution_notes: Optional[str] = None
    class Config:
        from_attributes = True
