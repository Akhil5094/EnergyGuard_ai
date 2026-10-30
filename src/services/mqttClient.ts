/**
 * EnergyGuard AI - Real MQTT over WebSocket Client Service
 * Connects directly to Mosquitto / EMQX broker over WebSocket protocol.
 * Enables live telemetry communication with physical or simulated ESP32 devices.
 */

import mqtt, { MqttClient } from 'mqtt';
import { TelemetryReading } from '../types';

export interface MQTTConfig {
  brokerUrl: string; // e.g. "wss://broker.emqx.io:8084/mqtt" or "ws://localhost:9001"
  clientId?: string;
  topicPrefix: string; // e.g. "energyguard/telemetry"
  username?: string;
  password?: string;
}

class MQTTService {
  private client: MqttClient | null = null;
  private isConnected: boolean = false;
  private onTelemetryCallback: ((reading: TelemetryReading) => void) | null = null;
  private onStatusChangeCallback: ((status: 'connected' | 'reconnecting' | 'disconnected') => void) | null = null;

  public connect(config: MQTTConfig) {
    if (this.client) {
      this.client.end(true);
    }

    const clientId = config.clientId || `EnergyGuard-Web-${Math.random().toString(16).substring(2, 8)}`;

    try {
      if (this.onStatusChangeCallback) this.onStatusChangeCallback('reconnecting');

      this.client = mqtt.connect(config.brokerUrl, {
        clientId,
        username: config.username,
        password: config.password,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 4000,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        if (this.onStatusChangeCallback) this.onStatusChangeCallback('connected');

        // Subscribe to machine telemetry wildcard topic
        const wildcardTopic = `${config.topicPrefix}/#`;
        this.client?.subscribe(wildcardTopic, { qos: 1 }, (err) => {
          if (!err) {
            console.log(`[MQTT] Subscribed to ${wildcardTopic}`);
          }
        });

        // Also subscribe to status / heartbeat topic
        this.client?.subscribe('energyguard/status', { qos: 1 });
      });

      this.client.on('reconnect', () => {
        if (this.onStatusChangeCallback) this.onStatusChangeCallback('reconnecting');
      });

      this.client.on('close', () => {
        this.isConnected = false;
        if (this.onStatusChangeCallback) this.onStatusChangeCallback('disconnected');
      });

      this.client.on('error', (err) => {
        console.warn('[MQTT Error]', err);
        this.isConnected = false;
        if (this.onStatusChangeCallback) this.onStatusChangeCallback('disconnected');
      });

      this.client.on('message', (topic, payload) => {
        try {
          const rawString = payload.toString();
          const data = JSON.parse(rawString);

          // Validate packet structure
          if (data && data.device_id && data.voltage_v !== undefined && data.current_a !== undefined) {
            const telemetry: TelemetryReading = {
              id: `real-tel-${Date.now()}-${data.device_id}`,
              deviceId: data.device_id,
              machineId: data.machine_id || 'MCH-001',
              machineName: data.machine_name || 'Industrial Machine',
              timestamp: data.timestamp ? new Date(data.timestamp * 1000).toISOString() : new Date().toISOString(),
              voltageV: Number(data.voltage_v),
              currentA: Number(data.current_a),
              powerFactor: Number(data.power_factor || 0.92),
              powerKw: Number(data.power_kw || ((data.voltage_v * data.current_a * (data.power_factor || 0.92)) / 1000)),
              intervalSeconds: Number(data.interval_seconds || 2),
              energyKwh: Number(data.energy_kwh || 0),
              status: data.status || 'running',
              source: 'real_iot',
            };

            if (this.onTelemetryCallback) {
              this.onTelemetryCallback(telemetry);
            }
          }
        } catch (e) {
          console.warn('[MQTT] Failed to parse JSON message:', e);
        }
      });
    } catch (e) {
      console.error('[MQTT] Connection initialization exception:', e);
      if (this.onStatusChangeCallback) this.onStatusChangeCallback('disconnected');
    }
  }

  public disconnect() {
    if (this.client) {
      this.client.end(true);
      this.client = null;
      this.isConnected = false;
      if (this.onStatusChangeCallback) this.onStatusChangeCallback('disconnected');
    }
  }

  public publishCommand(topic: string, message: object) {
    if (this.client && this.isConnected) {
      this.client.publish(topic, JSON.stringify(message), { qos: 1 });
    }
  }

  public onTelemetry(cb: (reading: TelemetryReading) => void) {
    this.onTelemetryCallback = cb;
  }

  public onStatusChange(cb: (status: 'connected' | 'reconnecting' | 'disconnected') => void) {
    this.onStatusChangeCallback = cb;
  }

  public getIsConnected() {
    return this.isConnected;
  }
}

export const mqttService = new MQTTService();
