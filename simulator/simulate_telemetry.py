"""
EnergyGuard AI - Hardware Telemetry Simulator (Python)
Publishes realistic IoT sensor telemetry to an MQTT broker.
"""
import time
import json
import random
import math
import paho.mqtt.client as mqtt

BROKER_HOST = "broker.emqx.io"
BROKER_PORT = 1883
TOPIC_PREFIX = "energyguard/telemetry"

MACHINES = [
    {"device_id": "EG-N01", "machine_id": "MCH-001", "name": "CNC Milling VMC-850", "rated_kw": 15.0, "base_pf": 0.94},
    {"device_id": "EG-N02", "machine_id": "MCH-002", "name": "Rotary Screw Compressor 22kW", "rated_kw": 22.0, "base_pf": 0.91},
    {"device_id": "EG-N03", "machine_id": "MCH-003", "name": "Hydraulic Stamping Press 40T", "rated_kw": 18.5, "base_pf": 0.83},
    {"device_id": "EG-N04", "machine_id": "MCH-004", "name": "Centrifugal Chilled Water Pump", "rated_kw": 7.5, "base_pf": 0.85},
    {"device_id": "EG-N05", "machine_id": "MCH-005", "name": "Automated Conveyor & Drives", "rated_kw": 5.5, "base_pf": 0.90},
]

client = mqtt.Client(client_id="energyguard-python-simulator")

def on_connect(c, userdata, flags, rc):
    if rc == 0:
        print(f"[Simulator] Connected successfully to MQTT Broker at {BROKER_HOST}:{BROKER_PORT}")
    else:
        print(f"[Simulator] Failed to connect with code {rc}")

client.on_connect = on_connect

cumulative_energy = {m["machine_id"]: 0.0 for m in MACHINES}

def run_simulator():
    print(f"[Simulator] Connecting to {BROKER_HOST}:{BROKER_PORT}...")
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    client.loop_start()

    interval_sec = 2
    step = 0

    print("[Simulator] Telemetry loop started. Press Ctrl+C to stop.")
    try:
        while True:
            step += 1
            for m in MACHINES:
                # Voltage with small grid jitter
                voltage = round(230.5 + random.uniform(-1.5, 1.5), 1)

                # Simulated operating cycles
                if m["machine_id"] == "MCH-002":
                    # Screw compressor cycles loaded / unloaded
                    is_loaded = (step % 20) < 12
                    target_kw = m["rated_kw"] * 0.78 if is_loaded else m["rated_kw"] * 0.28
                    status = "running" if is_loaded else "idle"
                elif m["machine_id"] == "MCH-003":
                    # Hydraulic press short cycles
                    is_stroke = random.random() > 0.85
                    target_kw = m["rated_kw"] * 0.70 if is_stroke else m["rated_kw"] * 0.21
                    status = "running" if is_stroke else "idle"
                else:
                    target_kw = m["rated_kw"] * (0.60 + 0.15 * math.sin(step / 10))
                    status = "running"

                power_kw = round(max(0.1, target_kw + random.uniform(-0.4, 0.4)), 2)
                pf = round(max(0.70, min(0.99, m["base_pf"] + random.uniform(-0.02, 0.02))), 2)
                current_a = round((power_kw * 1000) / (voltage * pf), 1)

                # Delta energy in kWh
                delta_kwh = (power_kw * interval_sec) / 3600.0
                cumulative_energy[m["machine_id"]] += delta_kwh

                payload = {
                    "device_id": m["device_id"],
                    "machine_id": m["machine_id"],
                    "machine_name": m["name"],
                    "timestamp": int(time.time()),
                    "voltage_v": voltage,
                    "current_a": current_a,
                    "power_factor": pf,
                    "power_kw": power_kw,
                    "interval_seconds": interval_sec,
                    "energy_kwh": round(cumulative_energy[m["machine_id"]], 4),
                    "status": status,
                    "source": "simulated"
                }

                topic = f"{TOPIC_PREFIX}/{m['device_id']}"
                client.publish(topic, json.dumps(payload), qos=1)

            time.sleep(interval_sec)
    except KeyboardInterrupt:
        print("\n[Simulator] Shutting down simulator...")
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    run_simulator()
