# Hardware Setup & Electrical Interface Guide

## 1. Bill of Materials (BOM)

| Component | Specification | Quantity | Est. Cost (INR) |
|---|---|---|---|
| Microcontroller | ESP32 DEVKIT V1 (30-pin, 2.4 GHz Wi-Fi) | 1 | ₹450 |
| Current Sensor | SCT-013-000 Non-Invasive Split-Core CT (100A/50mA) | 1 | ₹380 |
| Voltage Sensor | ZMPT101B Active AC Voltage Isolation Module | 1 | ₹220 |
| Burden Resistor | 33 $\Omega$, 1% Metal Film Resistor (0.25W) | 1 | ₹5 |
| Voltage Divider Resistors | 10 k$\Omega$, 1% Metal Film (0.25W) | 2 | ₹4 |
| Filter Capacitor | 10 $\mu$F 25V Electrolytic Capacitor | 1 | ₹5 |
| Power Supply | 5V / 2A Micro-USB or DIN-rail SMPS | 1 | ₹200 |
| **Total Hardware Cost** | **Sub-metered IoT Node** | **1 Unit** | **~ ₹1,264 ($15)** |

---

## 2. Circuit Diagram & Wiring Table

```
      +3.3V (ESP32)
         |
       [10kΩ] (R1)
         |
         +--------(+) 10μF Cap (Low impedance ground reference for AC)
         |         |
         |        GND
         |
         +-----------------+
         |                 |
      [10kΩ] (R2)        [33Ω] Burden Resistor
         |                 |
        GND                +-------- CT Sensor Wire 1
                           |
                           +--------> ESP32 GPIO 34 (Analog In)
                           |
                           +-------- CT Sensor Wire 2 (Connected to 1.65V bias)
```

### Pin Assignments
- **GPIO 34 (ADC1_CH6):** Connected to SCT-013 burden resistor output (Biased at 1.65V DC).
- **GPIO 35 (ADC1_CH7):** Connected to ZMPT101B analog output pin.
- **5V (VIN):** 5V DC Supply from DIN-rail SMPS.
- **GND:** System common ground.

---

## 3. Sensor Interface Safety Rules

1. **Galvanic Isolation:** The SCT-013 is a transformer and provides 1000V dielectric isolation. Always clamp the sensor onto **ONLY ONE conductor** (the Phase wire, never Phase + Neutral together, as the magnetic fields cancel out).
2. **Never Open-Circuit CT Under Load:** Never disconnect the burden resistor while the clamp is around a live, current-carrying wire. Doing so will generate high inductive voltages that can damage equipment.
