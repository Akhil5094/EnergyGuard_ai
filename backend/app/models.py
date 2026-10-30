from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="operator")
    created_at = Column(DateTime, default=datetime.utcnow)

class Factory(Base):
    __tablename__ = "factories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    timezone = Column(String, default="Asia/Kolkata")
    electricity_tariff = Column(Float, default=9.5)
    created_at = Column(DateTime, default=datetime.utcnow)

class Machine(Base):
    __tablename__ = "machines"
    id = Column(String, primary_key=True, index=True)
    factory_id = Column(String, ForeignKey("factories.id"))
    name = Column(String, nullable=False)
    machine_type = Column(String, nullable=False)
    location = Column(String)
    rated_power_kw = Column(Float, nullable=False)
    status = Column(String, default="running")
    created_at = Column(DateTime, default=datetime.utcnow)

class IoTDevice(Base):
    __tablename__ = "iot_devices"
    id = Column(String, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True, nullable=False)
    machine_id = Column(String, ForeignKey("machines.id"))
    mqtt_topic = Column(String, nullable=False)
    firmware_version = Column(String, default="v1.4.2")
    connection_status = Column(String, default="connected")
    last_seen = Column(DateTime, default=datetime.utcnow)

class EnergyReading(Base):
    __tablename__ = "energy_readings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    machine_id = Column(String, ForeignKey("machines.id"), index=True)
    device_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    voltage_v = Column(Float, nullable=False)
    current_a = Column(Float, nullable=False)
    power_factor = Column(Float, default=0.92)
    power_kw = Column(Float, nullable=False)
    energy_kwh = Column(Float, nullable=False)
    operating_status = Column(String, default="running")
    source = Column(String, default="simulated")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    factory_id = Column(String, ForeignKey("factories.id"))
    machine_id = Column(String, ForeignKey("machines.id"))
    alert_type = Column(String, nullable=False)
    severity = Column(String, default="warning")
    title = Column(String, nullable=False)
    description = Column(String)
    triggered_value = Column(String)
    threshold = Column(String)
    status = Column(String, default="active")
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolution_notes = Column(String, nullable=True)
