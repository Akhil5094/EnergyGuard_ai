"""
Automated REST API Tests for EnergyGuard AI
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_analytics_overview_endpoint():
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["currency"] == "INR"
    assert data["tariff_per_kwh"] > 0
    assert data["total_energy_today_kwh"] > 0

def test_telemetry_ingestion_valid():
    payload = {
        "device_id": "EG-N01",
        "machine_id": "MCH-001",
        "voltage_v": 230.5,
        "current_a": 45.2,
        "power_factor": 0.94,
        "power_kw": 9.85,
        "interval_seconds": 2,
        "energy_kwh": 0.00547,
        "status": "running"
    }
    response = client.post("/api/telemetry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ingested"
    assert "is_anomaly" in data
    assert "anomaly_score" in data

def test_telemetry_ingestion_invalid_voltage():
    payload = {
        "device_id": "EG-N01",
        "machine_id": "MCH-001",
        "voltage_v": -10.0,
        "current_a": 45.2,
        "power_factor": 0.94,
        "power_kw": 9.85,
        "interval_seconds": 2,
        "energy_kwh": 0.00547,
        "status": "running"
    }
    response = client.post("/api/telemetry", json=payload)
    assert response.status_code == 400
