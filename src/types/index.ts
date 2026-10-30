export type UserRole = 'owner' | 'energy_manager' | 'supervisor' | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  factoryId: string;
}

export type MachineStatus = 'running' | 'idle' | 'offline' | 'maintenance' | 'warning';

export type MachineType = 
  | 'CNC Machine'
  | 'Air Compressor'
  | 'Hydraulic Press'
  | 'Cooling Pump'
  | 'Conveyor Motor'
  | 'Welding Robot'
  | 'Induction Furnace'
  | 'Other';

export interface Machine {
  id: string;
  name: string;
  machineType: MachineType;
  factoryId: string;
  location: string;
  esp32DeviceId: string;
  ratedPowerKw: number;
  currentPowerKw: number;
  totalEnergyKwh: number;
  voltageV: number;
  currentA: number;
  powerFactor: number;
  status: MachineStatus;
  lastCommunication: string;
  installationDate: string;
  idleMinutesToday: number;
  temperatureC?: number;
}

export interface TelemetryReading {
  id: string;
  deviceId: string;
  machineId: string;
  machineName: string;
  timestamp: string;
  voltageV: number;
  currentA: number;
  powerFactor: number;
  powerKw: number;
  intervalSeconds: number;
  energyKwh: number;
  status: MachineStatus;
  source: 'simulated' | 'real_iot';
}

export interface IoTDevice {
  id: string;
  deviceId: string;
  machineId: string;
  deviceName: string;
  mqttTopic: string;
  status: 'connected' | 'disconnected' | 'reconnecting';
  firmwareVersion: string;
  sensorType: string;
  ipAddress: string;
  rssiDbm: number;
  lastSeen: string;
  uptimeHours: number;
  samplingIntervalSec: number;
}

export type AnomalyCategory = 
  | 'high_consumption'
  | 'power_spike'
  | 'idle_waste'
  | 'unusual_pattern'
  | 'sensor_reading_anomaly'
  | 'potential_malfunction';

export interface AnomalyRecord {
  id: string;
  machineId: string;
  machineName: string;
  timestamp: string;
  anomalyType: AnomalyCategory;
  anomalyScore: number; // e.g. -0.45 in Isolation Forest or 0-1 scale
  confidence: number;
  title: string;
  description: string;
  triggerValue: string;
  baselineValue: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'investigated' | 'resolved';
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  factoryId: string;
  machineId: string;
  machineName: string;
  alertType: AnomalyCategory | 'machine_offline' | 'voltage_abnormality' | 'peak_demand';
  severity: AlertSeverity;
  title: string;
  description: string;
  triggeredValue: string;
  threshold: string;
  timestamp: string;
  status: AlertStatus;
  assignedUser?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface EnergyRecommendation {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  explanation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavingsKwh: number;
  estimatedSavingsInr: number;
  evidence: string;
  status: 'new' | 'in_progress' | 'implemented' | 'dismissed';
  suggestedAction: string;
  createdAt: string;
}

export interface FactorySettings {
  factoryName: string;
  location: string;
  tariffPerKwh: number;
  currency: string;
  currencySymbol: string;
  timezone: string;
  telemetryIntervalSec: number;
  offlineTimeoutSec: number;
  idleDetectionThresholdKw: number;
  peakDemandThresholdKw: number;
  anomalySensitivity: 'low' | 'medium' | 'high';
  mqttBrokerHost: string;
  mqttPort: number;
  mqttTopicPrefix: string;
  operatingMode: 'demo' | 'real_iot';
}
