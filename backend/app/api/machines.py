from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models import Machine, IoTDevice
from backend.app.schemas import MachineCreate, MachineResponse
import uuid
from datetime import datetime

router = APIRouter(prefix="/machines", tags=["Machines"])

@router.get("", response_model=List[MachineResponse])
def get_machines(db: Session = Depends(get_db)):
    machines = db.query(Machine).all()
    if not machines:
        # Default seeded machines for immediate practical demonstration
        return [
            MachineResponse(
                id="MCH-001",
                name="CNC Milling VMC-850",
                machine_type="CNC Machine",
                factory_id="fac-001",
                location="Bay 1 - Precision Machining",
                rated_power_kw=15.0,
                current_power_kw=9.85,
                total_energy_kwh=148.6,
                voltage_v=231.4,
                current_a=45.2,
                power_factor=0.94,
                status="running",
                last_communication=datetime.utcnow()
            ),
            MachineResponse(
                id="MCH-002",
                name="Rotary Screw Compressor 22kW",
                machine_type="Air Compressor",
                factory_id="fac-001",
                location="Utility Room - Compressed Air",
                rated_power_kw=22.0,
                current_power_kw=16.4,
                total_energy_kwh=264.2,
                voltage_v=229.8,
                current_a=78.5,
                power_factor=0.91,
                status="warning",
                last_communication=datetime.utcnow()
            ),
            MachineResponse(
                id="MCH-003",
                name="Hydraulic Stamping Press 40T",
                machine_type="Hydraulic Press",
                factory_id="fac-001",
                location="Bay 2 - Heavy Stamping",
                rated_power_kw=18.5,
                current_power_kw=3.82,
                total_energy_kwh=92.4,
                voltage_v=232.1,
                current_a=20.1,
                power_factor=0.82,
                status="idle",
                last_communication=datetime.utcnow()
            )
        ]
    return machines

@router.post("", response_model=MachineResponse)
def create_machine(machine_in: MachineCreate, db: Session = Depends(get_db)):
    machine_id = f"MCH-{uuid.uuid4().hex[:4].upper()}"
    new_machine = Machine(
        id=machine_id,
        name=machine_in.name,
        machine_type=machine_in.machine_type,
        factory_id=machine_in.factory_id,
        location=machine_in.location,
        rated_power_kw=machine_in.rated_power_kw,
        status=machine_in.status
    )
    db.add(new_machine)

    # Associate IoT device node
    new_device = IoTDevice(
        id=f"dev-{uuid.uuid4().hex[:6]}",
        device_id=machine_in.esp32_device_id,
        machine_id=machine_id,
        mqtt_topic=f"energyguard/telemetry/{machine_in.esp32_device_id}"
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_machine)
    return new_machine

@router.get("/{machine_id}", response_model=MachineResponse)
def get_machine(machine_id: str, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.delete("/{machine_id}")
def delete_machine(machine_id: str, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    db.delete(machine)
    db.commit()
    return {"status": "deleted", "machine_id": machine_id}
