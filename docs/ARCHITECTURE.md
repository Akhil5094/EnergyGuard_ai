# EnergyGuard AI – System Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                        INDUSTRIAL SHOPFLOOR                             |
|                                                                         |
|  [ CNC Lathe ]      [ Air Compressor ]      [ Hydraulic Press ]        |
|        |                    |                        |                  |
|   (SCT-013 CT)         (SCT-013 CT)             (SCT-013 CT)            |
|        v                    v                        v                  |
|  [ESP32 Node 1]       [ESP32 Node 2]           [ESP32 Node 3]           |
|  (EG-N01)             (EG-N02)                 (EG-N03)                 |
+-------------------------------------------------------------------------+
                                    |
                                    | Wi-Fi 2.4 GHz (MQTT QoS 1)
                                    v
+-------------------------------------------------------------------------+
|                        COMMUNICATION & INGESTION                        |
|                                                                         |
|                   [ Eclipse Mosquitto MQTT Broker ]                     |
|                               :1883                                     |
|                                    |                                    |
|                                    v                                    |
|                   [ Python FastAPI Ingestion Engine ]                    |
+-------------------------------------------------------------------------+
                                    |
           +------------------------+------------------------+
           |                                                 |
           v                                                 v
+-----------------------+                         +-----------------------+
|  ANALYTICS & AI CORE  |                         |  PERSISTENCE STORAGE  |
|                       |                         |                       |
| - Isolation Forest    |                         | - PostgreSQL 15       |
| - P = (V*I*PF)/1000   |                         | - SQLAlchemy ORM      |
| - Delta Energy Integr.|                         | - Time-series Indexes |
| - ToD Tariff Slabs    |                         | - Alembic Migrations  |
+-----------------------+                         +-----------------------+
           |
           | WebSocket Gateway (/ws/telemetry)
           v
+-------------------------------------------------------------------------+
|                        CLIENT PRESENTATION LAYER                        |
|                                                                         |
|               [ React 19 + TypeScript + Tailwind CSS ]                  |
|                                                                         |
|  - Real-Time Power Oscilloscope                                         |
|  - Machine Fleet Management & Detail Gauges                             |
|  - Time-of-Day (ToD) Slabs & Shift Audit                                |
|  - Prioritized Energy Conservation Measures                             |
|  - ISO 50001 PDF Audit Report Generator & CSV Export                    |
+-------------------------------------------------------------------------+
```
