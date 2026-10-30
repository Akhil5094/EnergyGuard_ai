# EnergyGuard AI – IoT-Enabled Intelligent Energy Monitoring & Optimization System for Small-Scale Manufacturing Industries

[![UN SDG 7](https://img.shields.io/badge/UN%20SDG-7%20Affordable%20Clean%20Energy-amber)](https://sdgs.un.org/goals/goal7)
[![UN SDG 9](https://img.shields.io/badge/UN%20SDG-9%20Industry%20Innovation-blue)](https://sdgs.un.org/goals/goal9)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

EnergyGuard AI is an academic engineering capstone project designed to address the pervasive challenge of electrical energy waste in Micro, Small, and Medium Enterprises (MSMEs) and small manufacturing machine shops.

---

## 1. Abstract & Problem Statement

Small manufacturing factories lack real-time visibility into machine-level electricity consumption. Facility owners only discover high bills when the monthly utility invoice arrives—long after energy has been squandered on machines idling between shifts, pneumatic compressor line leaks, and deteriorating motor power factors. 

Large-scale industrial SCADA systems and three-phase digital power analyzers cost upwards of $10,000–$25,000, rendering them financially inaccessible for small machine shops.

**EnergyGuard AI** bridges this critical gap by retrofitting legacy factory machinery with low-cost open-source edge hardware:
- **ESP32 Microcontrollers (~$5)**
- **SCT-013 Split-Core Current Transformers (~$4)** (clamp-on, non-invasive)
- **ZMPT101B Voltage Isolation Modules (~$2)**
- **MQTT Protocol** publishing telemetry every 2 seconds over standard 2.4GHz shopfloor Wi-Fi
- **FastAPI Backend + Scikit-Learn Isolation Forest** executing real-time anomaly detection and actionable tariff-reduction recommendations.

---

## 2. Empathy Map: Small Factory Owner

- **SAYS**: *"Why is my electricity bill so unexpectedly high every month?"*
- **THINKS**: *"I am bleeding money and losing competitive margin to power waste."*
- **DOES**: *"Checks equipment only after catastrophic breakdowns or power factor surcharges."*
- **FEELS**: *"Frustrated, helpless, and priced out of commercial energy automation."*

---

## 3. UN Sustainable Development Goals (SDG) Alignment

1. **SDG 7: Affordable and Clean Energy (Target 7.3)**
   - Identifies non-productive idle power waste (e.g. hydraulic press pumps left on during break shifts).
   - Reduces carbon footprint and grid kilowatt-hour intensity per manufactured component by 12% to 22%.
2. **SDG 9: Industry, Innovation, and Infrastructure (Target 9.4)**
   - Retrofits existing factory machinery with affordable edge IoT sensors without requiring capital-intensive machine replacement.

---

## 4. System Architecture & Telemetry Pipeline

```
[ Industrial Machinery ] (CNC, Screw Compressor, Hydraulic Press, Chilled Pump)
         |
         v
[ SCT-013 CT Sensor + ZMPT101B ] (Clamp-on non-invasive measurement)
         |
         v
[ ESP32 Edge Node (EG-N01..N05) ] (ADC sampling, RMS & PF calculation)
         | (Wi-Fi 2.4GHz / MQTT QoS 1)
         v
[ Mosquitto MQTT Broker :1883 ] (Topic: energyguard/telemetry/{DEVICE_ID})
         |
         v
[ Python FastAPI Backend ]
    ├── Ingestion & Schema Validation (Pydantic)
    ├── Active Power & Energy Calculations (P = V * I * PF / 1000)
    ├── AI Anomaly Scoring (Isolation Forest n_estimators=100)
    ├── PostgreSQL Persistence (SQLAlchemy ORM)
    └── WebSocket Gateway (/ws/telemetry)
         |
         v
[ React 19 + Tailwind CSS Frontend Dashboard ]
    ├── Real-Time Oscilloscope & Telemetry Waveforms
    ├── Machine Fleet Management (Full CRUD)
    ├── Energy Analytics & Auditing (Shift Breakdown & CSV Export)
    ├── Alert Resolution Center (Role-Based Access Control)
    └── AI Optimization Recommendations (Calculated INR Savings)
```

---

## 5. Mathematical Formulations

### Active Power ($P$)
$$P (\text{kW}) = \frac{V_{\text{RMS}} \times I_{\text{RMS}} \times \text{PF}}{1000}$$

### Discrete Interval Energy ($\Delta E$)
$$\Delta E (\text{kWh}) = \frac{P (\text{kW}) \times \Delta t (\text{seconds})}{3600}$$

### Electricity Cost
$$\text{Cost} (\text{INR}) = \text{Total Energy} (\text{kWh}) \times \text{Tariff} (\text{INR/kWh})$$

---

## 6. Project Directory Layout

```
├── firmware/
│   └── esp32/
│       └── EnergyGuard_ESP32.ino   # Complete Arduino C++ firmware
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI REST & WebSocket server
│   │   ├── models.py               # SQLAlchemy ORM models
│   │   └── ai/
│   │       └── anomaly_detector.py # Isolation Forest detector
│   └── tests/
│       └── test_energy_calculations.py
├── src/
│   ├── components/
│   │   ├── layout/                 # Navbar & Industrial Sidebar
│   │   └── views/                  # Dashboard, Live, Machines, Analytics, AI, Alerts, Settings
│   ├── context/
│   │   └── AppContext.tsx          # Real-time state & physics simulator
│   ├── utils/
│   │   └── energyCalculations.ts   # Core electrical formulas
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── docker-compose.yml              # PostgreSQL, Mosquitto, Backend, Frontend
├── requirements.txt                # Python backend dependencies
├── package.json                    # Frontend dependencies
└── README.md
```

---

## 7. Quickstart & Deployment

### Running the Live Web Prototype
The application is pre-configured with a live browser-based physics simulation engine, allowing full academic evaluation without physical hardware:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Full-Stack Docker Deployment
To launch the complete production backend, PostgreSQL database, Mosquitto MQTT broker, and React dashboard:
```bash
docker compose up --build
```

### Running Backend Unit Tests
```bash
pytest backend/tests/
```

---

## 8. Role-Based Access Control (RBAC) Default Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Factory Owner** | `factory.owner@energyguard.ai` | `industrial2026` | Full factory config, machine CRUD, tariff settings, user management |
| **Energy Manager** | `energy.manager@energyguard.ai` | `industrial2026` | Energy audits, AI recommendations, report generation |
| **Shopfloor Supervisor** | `supervisor@energyguard.ai` | `industrial2026` | Real-time monitoring, alert acknowledgment & resolution |
| **Machine Operator** | `operator@energyguard.ai` | `industrial2026` | Read-only machine status & live current readings |

---

## 9. Academic Assumptions & Interface Limitations

1. **Current-Only Sensors**: Current-only CT sensors (SCT-013) operating without a synchronized voltage reference compute estimated active power based on nominal rated voltage (230V) and configured power factor. For revenue-grade utility billing, synchronized voltage and current phase measurement via ADC is utilized.
2. **AI Anomaly Detection**: The unsupervised Isolation Forest scores multi-dimensional feature deviations (current surges, abnormal idle times, low power factors). These represent operational irregularities requiring operator inspection, rather than deterministic mechanical failure predictions.
