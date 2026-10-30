import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Layers,
  Server,
  Code,
  ExternalLink,
  Calculator,
  Zap,
  Radio,
  BookOpen,
} from 'lucide-react';

export const FirmwareAndDocsView: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'firmware' | 'fastapi' | 'docker' | 'api' | 'calc'>('firmware');

  // Burden resistor calculator state
  const [ctModel, setCtModel] = useState<'sct013_100A' | 'sct013_30A' | 'sct013_50A'>('sct013_100A');
  const [adcVoltage, setAdcVoltage] = useState<number>(3.3); // ESP32 3.3V
  const [targetMaxCurrentA, setTargetMaxCurrentA] = useState<number>(100);

  // Burden resistor calculation:
  // Primary Peak = I_RMS * sqrt(2)
  // Secondary Peak = Primary Peak / Turns
  // Burden Resistor R_b = (V_AREF / 2) / Secondary Peak
  const turns = ctModel === 'sct013_100A' ? 2000 : ctModel === 'sct013_30A' ? 1800 : 1800;
  const secondaryCurrentPeak = (targetMaxCurrentA * Math.SQRT2) / turns;
  const idealBurdenOhms = Math.round((adcVoltage / 2) / secondaryCurrentPeak);
  const selectedStandardBurden = idealBurdenOhms > 30 ? 33 : idealBurdenOhms > 15 ? 18 : 10;
  const calibrationFactor = Number(((targetMaxCurrentA / 0.05) / selectedStandardBurden).toFixed(1));

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const esp32FirmwareCode = `/**
 * EnergyGuard AI - Edge Microcontroller Firmware
 * Target Platform: DOIT ESP32 DEVKIT V1 / ESP32-WROOM-32
 * Sensors: SCT-013-000 Non-Invasive CT (100A/50mA) + ZMPT101B AC Voltage Sensor
 * Protocol: MQTT over Wi-Fi (JSON Payload)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Wi-Fi Configuration
const char* ssid = "Factory_IoT_WLAN";
const char* password = "Industrial_Secure_Key_2026";

// MQTT Broker Configuration
const char* mqtt_server = "broker.emqx.io"; // or local mosquitto container IP
const int mqtt_port = 1883;
const char* mqtt_user = "energyguard";
const char* mqtt_pass = "secure_token";

// Hardware Identification
const char* DEVICE_ID = "EG-N01";
const char* MACHINE_ID = "MCH-001";
const char* TELEMETRY_TOPIC = "energyguard/telemetry/EG-N01";

// Analog Pins (ADC1 safe for Wi-Fi)
const int PIN_CT_CURRENT = 34;   // SCT-013 Burden Resistor Output
const int PIN_ZMPT_VOLTAGE = 35; // ZMPT101B AC Voltage Sensor Output

// Calibration Constants
const float CALIBRATION_CURRENT = 60.6; // For 33-ohm burden resistor (100A / 0.05A)
const float CALIBRATION_VOLTAGE = 230.0 / 1.65; // Normalized to 230V RMS

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsgTime = 0;
const int TELEMETRY_INTERVAL_MS = 2000;
double cumulativeEnergyKwh = 0.0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 30) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\n[WiFi] Connected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\\n[WiFi] Connection timeout. Operating in fallback mode.");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("[MQTT] Attempting connection to broker...");
    String clientId = "EnergyGuardNode-" + String(DEVICE_ID);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println(" CONNECTED!");
      // Send birth certificate message
      client.publish("energyguard/status", "{\\"node\\":\\"EG-N01\\",\\"status\\":\\"online\\"}");
    } else {
      Serial.print(" Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

// Sample ADC and calculate RMS values
void calculateElectricalReadings(float &voltageRMS, float &currentRMS, float &powerFactor, float &activePowerKw) {
  long sumV = 0, sumI = 0;
  long sampleCount = 500;
  
  // Continuous sampling over 2 full 50Hz cycles (40ms)
  for (int i = 0; i < sampleCount; i++) {
    int rawV = analogRead(PIN_ZMPT_VOLTAGE) - 2048; // Center at 1.65V (12-bit ADC)
    int rawI = analogRead(PIN_CT_CURRENT) - 2048;
    sumV += (long)rawV * rawV;
    sumI += (long)rawI * rawI;
    delayMicroseconds(80);
  }

  float vFiltered = sqrt(sumV / sampleCount);
  float iFiltered = sqrt(sumI / sampleCount);

  // Scaled physical values
  voltageRMS = (vFiltered / 2048.0) * 230.0;
  if (voltageRMS < 20.0) voltageRMS = 0.0; // Noise threshold

  currentRMS = (iFiltered / 2048.0) * CALIBRATION_CURRENT;
  if (currentRMS < 0.2) currentRMS = 0.0; // Idle threshold

  // Estimate power factor from phase displacement (or fixed nominal 0.92 inductive)
  powerFactor = 0.92;

  // Active Power P(kW) = (V * I * PF) / 1000
  activePowerKw = (voltageRMS * currentRMS * powerFactor) / 1000.0;
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12); // ESP32 12-bit ADC (0 - 4095)
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      reconnect();
    }
    client.loop();
  }

  unsigned long now = millis();
  if (now - lastMsgTime > TELEMETRY_INTERVAL_MS) {
    lastMsgTime = now;

    float voltageRMS = 0, currentRMS = 0, powerFactor = 0, activePowerKw = 0;
    calculateElectricalReadings(voltageRMS, currentRMS, powerFactor, activePowerKw);

    // Increment Energy (kWh) = P(kW) * Δt(hours)
    double deltaEnergyKwh = (activePowerKw * (TELEMETRY_INTERVAL_MS / 1000.0)) / 3600.0;
    cumulativeEnergyKwh += deltaEnergyKwh;

    // Serialize JSON payload
    StaticJsonDocument<256> doc;
    doc["device_id"] = DEVICE_ID;
    doc["machine_id"] = MACHINE_ID;
    doc["timestamp"] = now / 1000;
    doc["voltage_v"] = serialized(String(voltageRMS, 1));
    doc["current_a"] = serialized(String(currentRMS, 2));
    doc["power_factor"] = serialized(String(powerFactor, 2));
    doc["power_kw"] = serialized(String(activePowerKw, 3));
    doc["interval_seconds"] = TELEMETRY_INTERVAL_MS / 1000;
    doc["energy_kwh"] = serialized(String(cumulativeEnergyKwh, 4));
    doc["status"] = (activePowerKw > 0.5) ? "running" : "idle";

    char buffer[256];
    serializeJson(doc, buffer);

    Serial.print("[MQTT Publish] ");
    Serial.println(buffer);
    client.publish(TELEMETRY_TOPIC, buffer);
  }
}`;

  const fastApiCode = `# EnergyGuard AI - FastAPI Backend Server
# REST APIs, MQTT Subscriber & Isolation Forest Anomaly Detection

from fastapi import FastAPI, Depends, WebSocket, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import IsolationForest
import paho.mqtt.client as mqtt
import asyncio
import json

app = FastAPI(
    title="EnergyGuard AI Backend",
    version="1.2.0",
    description="IoT Energy Monitoring & Optimization System for Manufacturing"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Isolation Forest Model Initialization
iso_forest = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
# Warm up model on standard manufacturing motor baselines
X_train = np.array([
    [9.8, 45.2, 230.5, 0.92],
    [10.2, 46.1, 231.0, 0.93],
    [3.8, 19.5, 230.0, 0.82],
    [14.5, 68.2, 229.8, 0.91],
    [6.8, 33.4, 230.2, 0.86],
])
iso_forest.fit(X_train)

class TelemetryPayload(BaseModel):
    device_id: str
    machine_id: str
    voltage_v: float
    current_a: float
    power_factor: float
    power_kw: float
    interval_seconds: int
    energy_kwh: float
    status: str

@app.post("/api/telemetry")
async def ingest_telemetry(data: TelemetryPayload):
    # Validate payload
    if data.voltage_v < 0 or data.current_a < 0:
        raise HTTPException(status_code=400, detail="Invalid electrical readings")
    
    # Run Isolation Forest prediction
    features = np.array([[data.power_kw, data.current_a, data.voltage_v, data.power_factor]])
    score = iso_forest.score_samples(features)[0]
    is_anomaly = score < -0.50

    return {
        "status": "ingested",
        "device_id": data.device_id,
        "is_anomaly": bool(is_anomaly),
        "anomaly_score": float(round(score, 3))
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "EnergyGuard AI REST Service"}
`;

  const dockerComposeCode = `version: '3.8'

services:
  # 1. PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: energyguard-postgres
    restart: always
    environment:
      POSTGRES_USER: energyguard
      POSTGRES_PASSWORD: energyguard_secret_2026
      POSTGRES_DB: energyguard_production
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # 2. Eclipse Mosquitto MQTT Broker
  mosquitto:
    image: eclipse-mosquitto:2.0
    container_name: energyguard-mosquitto
    restart: always
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config

  # 3. Python FastAPI Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: energyguard-backend
    restart: always
    environment:
      DATABASE_URL: postgresql://energyguard:energyguard_secret_2026@db:5432/energyguard_production
      MQTT_BROKER_HOST: mosquitto
      MQTT_BROKER_PORT: 1883
    ports:
      - "8000:8000"
    depends_on:
      - db
      - mosquitto

  # 4. React Frontend Dashboard
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: energyguard-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
`;

  const apiEndpointsDoc = `===============================================================
ENERGYGUARD AI - REST & WEBSOCKET API SPECIFICATION
Base URL: http://localhost:8000/api
===============================================================

1. AUTHENTICATION & ACCESS CONTROL
---------------------------------------------------------------
POST /api/auth/login
Request:  { "email": "factory.owner@energyguard.ai", "password": "..." }
Response: { "access_token": "jwt...", "token_type": "bearer", "role": "owner" }

POST /api/auth/register
GET  /api/auth/me

2. TELEMETRY INGESTION (EDGE MQTT / REST)
---------------------------------------------------------------
POST /api/telemetry
Request:
{
  "device_id": "EG-N01",
  "machine_id": "MCH-001",
  "timestamp": "2026-10-29T07:10:00Z",
  "voltage_v": 230.5,
  "current_a": 45.2,
  "power_factor": 0.94,
  "power_kw": 9.85,
  "interval_seconds": 2,
  "energy_kwh": 0.00547,
  "status": "running"
}
Response:
{
  "status": "ingested",
  "is_anomaly": false,
  "anomaly_score": -0.281
}

3. WEBSOCKET REAL-TIME STREAM
---------------------------------------------------------------
WS /ws/telemetry
Broadcasts live incoming JSON frames to connected frontend dashboards every 2s.

4. AI ANOMALY DETECTION
---------------------------------------------------------------
GET  /api/ai/anomalies
POST /api/ai/analyze
GET  /api/ai/recommendations
POST /api/ai/train (Retrain Isolation Forest)
`;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCode className="h-6 w-6 text-emerald-400" />
            ESP32 Firmware, Schematics & Full-Stack Specs
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Complete Arduino C++ edge code, CT burden resistor calculator, FastAPI backend, and deployment configs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadFile('EnergyGuard_ESP32.ino', esp32FirmwareCode)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download .INO Firmware</span>
          </button>
        </div>
      </div>

      {/* Code Tab Switcher */}
      <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs max-w-fit gap-1">
        <button
          onClick={() => setActiveCodeTab('firmware')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeCodeTab === 'firmware' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          ESP32 Arduino (.ino)
        </button>
        <button
          onClick={() => setActiveCodeTab('calc')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeCodeTab === 'calc' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Sensor Burden Calculator
        </button>
        <button
          onClick={() => setActiveCodeTab('fastapi')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeCodeTab === 'fastapi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          FastAPI (main.py)
        </button>
        <button
          onClick={() => setActiveCodeTab('docker')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeCodeTab === 'docker' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Docker Compose
        </button>
        <button
          onClick={() => setActiveCodeTab('api')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeCodeTab === 'api' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          REST / WS API Specs
        </button>
      </div>

      {/* Interactive Burden Resistor Calculator */}
      {activeCodeTab === 'calc' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-400" />
              SCT-013 Current Transformer Burden Resistor & Calibration Calculator
            </h3>
            <span className="text-xs font-mono text-slate-400">Hardware Design Math</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The SCT-013-000 produces an AC secondary current (50 mA at 100 A RMS). A precision burden resistor (Rb) 
            converts this current into a voltage swing compatible with the ESP32 3.3V ADC biased at Vref / 2 = 1.65V.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-400 block font-semibold">Sensor Model:</label>
              <select
                value={ctModel}
                onChange={e => setCtModel(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white"
              >
                <option value="sct013_100A">SCT-013-000 (100A / 50mA, 2000 Turns)</option>
                <option value="sct013_30A">SCT-013-030 (30A / 1V internal)</option>
                <option value="sct013_50A">SCT-013-050 (50A / 1V internal)</option>
              </select>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-400 block font-semibold">Max Primary Current Range (A):</label>
              <input
                type="number"
                min="10"
                max="150"
                value={targetMaxCurrentA}
                onChange={e => setTargetMaxCurrentA(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-400 block font-semibold">ESP32 ADC Vref (Volts):</label>
              <input
                type="number"
                step="0.1"
                value={adcVoltage}
                onChange={e => setAdcVoltage(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Calculated Ideal Burden</span>
              <span className="text-xl font-bold text-white">{idealBurdenOhms} Ω</span>
              <span className="text-[10px] text-slate-400 block mt-1">Formula: (V_ref/2) / I_secondary_peak</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Standard Recommended Resistor</span>
              <span className="text-xl font-bold text-emerald-400">{selectedStandardBurden} Ω (1% Metal Film)</span>
              <span className="text-[10px] text-slate-400 block mt-1">Ensures ADC headroom against overcurrent</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Software Calibration Factor</span>
              <span className="text-xl font-bold text-indigo-400">{calibrationFactor}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Code constant: CALIBRATION_CURRENT</span>
            </div>
          </div>
        </div>
      )}

      {/* Circuit Pinout & Wiring Quick Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-white text-sm lg:text-base flex items-center gap-2">
          <Cpu className="h-4 w-4 text-emerald-400" />
          Hardware Wiring Schematic & Interface Safety
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block uppercase text-[10px]">Current Input (ADC)</span>
            <span className="text-emerald-400 font-bold">GPIO 34</span>
            <span className="text-slate-400 text-[11px] block mt-1">SCT-013 with 33Ω burden + 10μF bias cap</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block uppercase text-[10px]">Voltage Input (ADC)</span>
            <span className="text-blue-400 font-bold">GPIO 35</span>
            <span className="text-slate-400 text-[11px] block mt-1">ZMPT101B Isolated Transformer (230V AC)</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block uppercase text-[10px]">Microcontroller Power</span>
            <span className="text-amber-400 font-bold">5V DC (Vin) / GND</span>
            <span className="text-slate-400 text-[11px] block mt-1">Industrial DIN Rail 5V/2A Switch Mode PS</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block uppercase text-[10px]">Sampling Interval</span>
            <span className="text-purple-400 font-bold">2.0 Seconds</span>
            <span className="text-slate-400 text-[11px] block mt-1">Wi-Fi 802.11 b/g/n (2.4 GHz)</span>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-xs text-slate-300 font-bold">
              {activeCodeTab === 'firmware'
                ? 'firmware/esp32/EnergyGuard_ESP32.ino'
                : activeCodeTab === 'fastapi'
                ? 'backend/app/main.py'
                : activeCodeTab === 'docker'
                ? 'docker-compose.yml'
                : activeCodeTab === 'api'
                ? 'docs/API_SPECIFICATION.md'
                : 'Burden Resistor Formulation'}
            </span>
          </div>

          <button
            onClick={() => {
              const textToCopy =
                activeCodeTab === 'firmware'
                  ? esp32FirmwareCode
                  : activeCodeTab === 'fastapi'
                  ? fastApiCode
                  : activeCodeTab === 'docker'
                  ? dockerComposeCode
                  : apiEndpointsDoc;
              copyToClipboard(textToCopy, activeCodeTab);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            {copiedFile === activeCodeTab ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-950 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[500px] overflow-y-auto">
          <pre>
            {activeCodeTab === 'firmware'
              ? esp32FirmwareCode
              : activeCodeTab === 'fastapi'
              ? fastApiCode
              : activeCodeTab === 'docker'
              ? dockerComposeCode
              : apiEndpointsDoc}
          </pre>
        </div>
      </div>
    </div>
  );
};
