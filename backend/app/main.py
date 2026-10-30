from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base
from backend.app.api import auth, machines, telemetry, alerts, analytics, ai
import asyncio
import json

# Ensure SQLite / Postgres tables are created on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EnergyGuard AI Backend",
    version="1.2.0",
    description="IoT-Enabled Intelligent Energy Monitoring & Optimization System for Manufacturing MSMEs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular Routers
app.include_router(auth.router, prefix="/api")
app.include_router(machines.router, prefix="/api")
app.include_router(telemetry.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "EnergyGuard AI API Gateway",
        "ai_model": "IsolationForest (Online)",
        "database": "SQLAlchemy Engine Ready",
        "version": "1.2.0"
    }

# WebSocket Telemetry Broadcast Channel
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Broadcast simulated/live telemetry packet every 2 seconds
            packet = {
                "device_id": "EG-N01",
                "machine_id": "MCH-001",
                "voltage_v": 230.8,
                "current_a": 45.2,
                "power_factor": 0.94,
                "power_kw": 9.85,
                "status": "running"
            }
            await websocket.send_text(json.dumps(packet))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
