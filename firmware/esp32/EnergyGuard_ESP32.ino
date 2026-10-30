/**
 * EnergyGuard AI - Edge Microcontroller Firmware
 * Target Platform: ESP32-WROOM-32 / DOIT ESP32 DEVKIT V1
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
const char* mqtt_server = "broker.emqx.io";
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
    Serial.println("\n[WiFi] Connected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WiFi] Connection timeout. Operating in fallback mode.");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("[MQTT] Attempting connection to broker...");
    String clientId = "EnergyGuardNode-" + String(DEVICE_ID);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println(" CONNECTED!");
      client.publish("energyguard/status", "{\"node\":\"EG-N01\",\"status\":\"online\"}");
    } else {
      Serial.print(" Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void calculateElectricalReadings(float &voltageRMS, float &currentRMS, float &powerFactor, float &activePowerKw) {
  long sumV = 0, sumI = 0;
  long sampleCount = 500;
  
  for (int i = 0; i < sampleCount; i++) {
    int rawV = analogRead(PIN_ZMPT_VOLTAGE) - 2048; // Center at 1.65V (12-bit ADC)
    int rawI = analogRead(PIN_CT_CURRENT) - 2048;
    sumV += (long)rawV * rawV;
    sumI += (long)rawI * rawI;
    delayMicroseconds(80);
  }

  float vFiltered = sqrt(sumV / sampleCount);
  float iFiltered = sqrt(sumI / sampleCount);

  voltageRMS = (vFiltered / 2048.0) * 230.0;
  if (voltageRMS < 20.0) voltageRMS = 0.0;

  currentRMS = (iFiltered / 2048.0) * CALIBRATION_CURRENT;
  if (currentRMS < 0.2) currentRMS = 0.0;

  powerFactor = 0.92;
  activePowerKw = (voltageRMS * currentRMS * powerFactor) / 1000.0;
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
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

    double deltaEnergyKwh = (activePowerKw * (TELEMETRY_INTERVAL_MS / 1000.0)) / 3600.0;
    cumulativeEnergyKwh += deltaEnergyKwh;

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
}
