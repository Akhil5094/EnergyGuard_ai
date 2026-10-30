"""
EnergyGuard AI - Backend MQTT Subscriber Service (Paho-MQTT)
"""
import json
import logging
import paho.mqtt.client as mqtt

logger = logging.getLogger("energyguard.mqtt")

class MQTTService:
    def __init__(self, broker_host: str = "mosquitto", broker_port: int = 1883, topic_prefix: str = "energyguard/telemetry"):
        self.broker_host = broker_host
        self.broker_port = broker_port
        self.topic_prefix = topic_prefix
        self.client = mqtt.Client(client_id="energyguard-backend-subscriber")

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info(f"Connected to MQTT Broker at {self.broker_host}:{self.broker_port}")
            client.subscribe(f"{self.topic_prefix}/#")
        else:
            logger.error(f"MQTT connection failed with return code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            device_id = payload.get("device_id")
            power_kw = payload.get("power_kw")
            logger.info(f"Received telemetry from {device_id}: {power_kw} kW on topic {msg.topic}")
        except Exception as e:
            logger.warning(f"Error decoding MQTT payload on {msg.topic}: {e}")

    def start(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        try:
            self.client.connect_async(self.broker_host, self.broker_port, 60)
            self.client.loop_start()
        except Exception as e:
            logger.warning(f"MQTT async connection failed (broker may not be up yet): {e}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
