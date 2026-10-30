import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Machine,
  IoTDevice,
  Alert,
  EnergyRecommendation,
  FactorySettings,
  User,
  UserRole,
  TelemetryReading,
  MachineStatus
} from '../types';
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_MACHINES,
  INITIAL_DEVICES,
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
} from '../data/seedData';
import {
  calculateActivePowerKw,
  calculateIntervalEnergyKwh,
  calculateElectricityCost,
} from '../utils/energyCalculations';
import { mqttService } from '../services/mqttClient';

interface AppContextType {
  user: User;
  setUserRole: (role: UserRole) => void;
  settings: FactorySettings;
  updateSettings: (newSettings: Partial<FactorySettings>) => void;
  machines: Machine[];
  addMachine: (machine: Omit<Machine, 'id' | 'lastCommunication' | 'idleMinutesToday' | 'totalEnergyKwh' | 'currentPowerKw' | 'voltageV' | 'currentA' | 'powerFactor'>) => void;
  updateMachine: (id: string, data: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  devices: IoTDevice[];
  addDevice: (device: Omit<IoTDevice, 'id' | 'lastSeen' | 'uptimeHours'>) => void;
  updateDevice: (id: string, data: Partial<IoTDevice>) => void;
  deleteDevice: (id: string) => void;
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string, resolutionNotes: string) => void;
  recommendations: EnergyRecommendation[];
  updateRecommendationStatus: (id: string, status: EnergyRecommendation['status']) => void;
  liveTelemetryBuffer: TelemetryReading[];
  latestTelemetry: TelemetryReading | null;
  isSimulatorActive: boolean;
  setIsSimulatorActive: (active: boolean) => void;
  triggerSimulatedScenario: (scenario: 'compressor_leak' | 'bearing_overload' | 'idle_waste' | 'voltage_sag') => void;
  mqttConnectionState: 'connected' | 'reconnecting' | 'disconnected';
  setMqttConnectionState: (state: 'connected' | 'reconnecting' | 'disconnected') => void;
  isAuthenticated: boolean;
  login: (role: UserRole, userEmail?: string, userName?: string) => void;
  logout: () => void;
  totalEnergyTodayKwh: number;
  estimatedCostTodayInr: number;
  totalCurrentPowerDemandKw: number;
  energyEfficiencyScore: number;
  potentialSavingsInr: number;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('energyguard_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [settings, setSettings] = useState<FactorySettings>(() => {
    const saved = localStorage.getItem('energyguard_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [machines, setMachines] = useState<Machine[]>(() => {
    const saved = localStorage.getItem('energyguard_machines');
    return saved ? JSON.parse(saved) : INITIAL_MACHINES;
  });

  const [devices, setDevices] = useState<IoTDevice[]>(() => {
    const saved = localStorage.getItem('energyguard_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('energyguard_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [recommendations, setRecommendations] = useState<EnergyRecommendation[]>(() => {
    const saved = localStorage.getItem('energyguard_recommendations');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(true);
  const [mqttConnectionState, setMqttConnectionState] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const [liveTelemetryBuffer, setLiveTelemetryBuffer] = useState<TelemetryReading[]>([]);
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryReading | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check session storage first; defaults to false so user is prompted to sign in first
    try {
      return sessionStorage.getItem('energyguard_auth') === 'true';
    } catch {
      return false;
    }
  });

  const login = (role: UserRole, userEmail?: string, userName?: string) => {
    setUser(prev => ({
      ...prev,
      role,
      email: userEmail || prev.email,
      name: userName || prev.name,
    }));
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('energyguard_auth', 'true');
    } catch {
      // ignore storage quota errors
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('energyguard_auth');
      localStorage.removeItem('energyguard_auth');
    } catch {
      // ignore storage quota errors
    }
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('energyguard_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('energyguard_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('energyguard_machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('energyguard_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('energyguard_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('energyguard_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  const setUserRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const updateSettings = (newSettings: Partial<FactorySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addMachine = (machineData: Omit<Machine, 'id' | 'lastCommunication' | 'idleMinutesToday' | 'totalEnergyKwh' | 'currentPowerKw' | 'voltageV' | 'currentA' | 'powerFactor'>) => {
    const newMachine: Machine = {
      ...machineData,
      id: `MCH-${String(machines.length + 1).padStart(3, '0')}`,
      currentPowerKw: 0,
      totalEnergyKwh: 0,
      voltageV: 230,
      currentA: 0,
      powerFactor: 0.92,
      lastCommunication: new Date().toISOString(),
      idleMinutesToday: 0,
    };
    setMachines(prev => [newMachine, ...prev]);
  };

  const updateMachine = (id: string, data: Partial<Machine>) => {
    setMachines(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
  };

  const deleteMachine = (id: string) => {
    setMachines(prev => prev.filter(m => m.id !== id));
  };

  const addDevice = (deviceData: Omit<IoTDevice, 'id' | 'lastSeen' | 'uptimeHours'>) => {
    const newDev: IoTDevice = {
      ...deviceData,
      id: `dev-${String(devices.length + 1).padStart(3, '0')}`,
      lastSeen: new Date().toISOString(),
      uptimeHours: 0.1,
    };
    setDevices(prev => [newDev, ...prev]);
  };

  const updateDevice = (id: string, data: Partial<IoTDevice>) => {
    setDevices(prev => prev.map(d => (d.id === id ? { ...d, ...data } : d)));
  };

  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'acknowledged',
              assignedUser: `${user.name} (${user.role})`,
            }
          : a
      )
    );
  };

  const resolveAlert = (id: string, resolutionNotes: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'resolved',
              resolutionNotes,
              resolvedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const updateRecommendationStatus = (id: string, status: EnergyRecommendation['status']) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const resetToDefaultData = () => {
    setUser(INITIAL_USER);
    setSettings(INITIAL_SETTINGS);
    setMachines(INITIAL_MACHINES);
    setDevices(INITIAL_DEVICES);
    setAlerts(INITIAL_ALERTS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    localStorage.clear();
  };

  // Trigger simulated scenarios for demonstration
  const triggerSimulatedScenario = (scenario: 'compressor_leak' | 'bearing_overload' | 'idle_waste' | 'voltage_sag') => {
    const timestamp = new Date().toISOString();
    if (scenario === 'compressor_leak') {
      updateMachine('MCH-002', {
        currentPowerKw: 24.6,
        currentA: 82.5,
        status: 'warning',
      });
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        factoryId: 'fac-001',
        machineId: 'MCH-002',
        machineName: 'Rotary Screw Compressor 22kW',
        alertType: 'power_spike',
        severity: 'critical',
        title: 'Severe Unloader Anomaly & Continuous Load Spike',
        description: 'Compressor sustained at 24.6 kW (exceeding rated 22 kW). AI Isolation Forest anomaly score -0.74.',
        triggeredValue: '24.6 kW (111.8% rated)',
        threshold: 'Rated: 22.0 kW',
        timestamp,
        status: 'active',
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else if (scenario === 'bearing_overload') {
      updateMachine('MCH-001', {
        currentPowerKw: 14.8,
        currentA: 71.0,
        temperatureC: 68.5,
        status: 'warning',
      });
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        factoryId: 'fac-001',
        machineId: 'MCH-001',
        machineName: 'CNC Milling VMC-850',
        alertType: 'potential_malfunction',
        severity: 'warning',
        title: 'Motor Bearing Friction / Spindle Drag',
        description: 'Elevated continuous current draw with motor housing thermal gradient (+24°C over ambient).',
        triggeredValue: '14.8 kW @ 68.5°C',
        threshold: 'Normal baseline: ~9.5 kW @ 44°C',
        timestamp,
        status: 'active',
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else if (scenario === 'idle_waste') {
      updateMachine('MCH-003', {
        currentPowerKw: 4.8,
        status: 'idle',
        idleMinutesToday: 180,
      });
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        factoryId: 'fac-001',
        machineId: 'MCH-003',
        machineName: 'Hydraulic Stamping Press 40T',
        alertType: 'idle_waste',
        severity: 'warning',
        title: 'Extended Non-Productive Idle Waste',
        description: 'Press pump running unloaded for 3 straight hours. Estimated 14.4 kWh wasted without production stroke.',
        triggeredValue: '4.8 kW (180 mins idle)',
        threshold: 'Idle limit: 15 mins',
        timestamp,
        status: 'active',
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else if (scenario === 'voltage_sag') {
      setMachines(prev =>
        prev.map(m =>
          m.status === 'offline' ? m : { ...m, voltageV: 204.2, status: 'warning' }
        )
      );
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        factoryId: 'fac-001',
        machineId: 'MCH-004',
        machineName: 'Factory Distribution Feeder',
        alertType: 'voltage_abnormality',
        severity: 'warning',
        title: 'Phase Voltage Dip (204.2 V)',
        description: 'Supply voltage dropped below statutory tolerance (-11.2% of nominal 230V). Increases motor running currents.',
        triggeredValue: '204.2 V',
        threshold: 'Nominal 230V ± 6% (216V - 244V)',
        timestamp,
        status: 'active',
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  // Real-time Physics Simulator Loop (Interval: settings.telemetryIntervalSec)
  useEffect(() => {
    if (!isSimulatorActive) return;

    const intervalId = setInterval(() => {
      setMachines(prevMachines => {
        const intervalSec = settings.telemetryIntervalSec;
        const nowIso = new Date().toISOString();

        return prevMachines.map(m => {
          if (m.status === 'offline') {
            return {
              ...m,
              currentPowerKw: 0,
              currentA: 0,
              voltageV: 0,
              powerFactor: 0,
            };
          }

          // Realistic micro-fluctuations
          const voltageJitter = (Math.random() - 0.5) * 2.2;
          const voltageV = Math.max(215, Math.min(245, Number((230.5 + voltageJitter).toFixed(1))));

          let basePf = 0.92;
          let targetPowerKw = m.ratedPowerKw * 0.65;
          let currentStatus: MachineStatus = m.status;

          if (m.machineType === 'Air Compressor') {
            basePf = 0.90;
            // Compressor cycles between loaded (80%) and unloaded/idle (25%)
            const cycle = Math.sin(Date.now() / 15000);
            targetPowerKw = cycle > 0 ? m.ratedPowerKw * 0.78 : m.ratedPowerKw * 0.28;
            currentStatus = cycle > 0 ? 'running' : 'idle';
          } else if (m.machineType === 'Hydraulic Press') {
            basePf = 0.83;
            // Press has idling baseline with short stroke peaks
            const stroke = Math.random() > 0.85;
            targetPowerKw = stroke ? m.ratedPowerKw * 0.72 : m.ratedPowerKw * 0.21;
            currentStatus = stroke ? 'running' : 'idle';
          } else if (m.machineType === 'Cooling Pump') {
            basePf = 0.85;
            targetPowerKw = m.ratedPowerKw * 0.88;
            currentStatus = 'running';
          } else if (m.machineType === 'CNC Machine') {
            basePf = 0.94;
            const machiningCycle = (Math.sin(Date.now() / 10000) + 1) / 2;
            targetPowerKw = m.ratedPowerKw * (0.35 + machiningCycle * 0.45);
            currentStatus = 'running';
          }

          const powerJitter = (Math.random() - 0.5) * (m.ratedPowerKw * 0.05);
          const powerKw = Math.max(0.1, Number((targetPowerKw + powerJitter).toFixed(2)));
          const pfJitter = (Math.random() - 0.5) * 0.02;
          const powerFactor = Math.max(0.70, Math.min(0.99, Number((basePf + pfJitter).toFixed(2))));

          // Current calculation: I(A) = (P(kW) * 1000) / (V * PF)
          const currentA = Number(((powerKw * 1000) / (voltageV * powerFactor)).toFixed(1));

          // Incremental Energy (kWh)
          const incrementalEnergy = calculateIntervalEnergyKwh(powerKw, intervalSec);
          const totalEnergyKwh = Number((m.totalEnergyKwh + incrementalEnergy).toFixed(4));

          const idleMinutes = currentStatus === 'idle' ? m.idleMinutesToday + (intervalSec / 60) : m.idleMinutesToday;

          // Dispatch telemetry packet
          const packet: TelemetryReading = {
            id: `tel-${Date.now()}-${m.id}`,
            deviceId: m.esp32DeviceId,
            machineId: m.id,
            machineName: m.name,
            timestamp: nowIso,
            voltageV,
            currentA,
            powerFactor,
            powerKw,
            intervalSeconds: intervalSec,
            energyKwh: incrementalEnergy,
            status: currentStatus,
            source: settings.operatingMode === 'demo' ? 'simulated' : 'real_iot',
          };

          if (m.id === 'MCH-001') {
            setLatestTelemetry(packet);
            setLiveTelemetryBuffer(prevBuf => {
              const updated = [...prevBuf, packet];
              return updated.slice(-30); // keep last 30 readings
            });
          }

          return {
            ...m,
            voltageV,
            currentA,
            powerFactor,
            currentPowerKw: powerKw,
            totalEnergyKwh,
            status: currentStatus,
            lastCommunication: nowIso,
            idleMinutesToday: Number(idleMinutes.toFixed(1)),
          };
        });
      });
    }, settings.telemetryIntervalSec * 1000);

    return () => clearInterval(intervalId);
  }, [isSimulatorActive, settings.telemetryIntervalSec, settings.operatingMode]);

  // Real IoT MQTT Client Integration
  useEffect(() => {
    if (settings.operatingMode !== 'real_iot') {
      mqttService.disconnect();
      return;
    }

    const brokerUrl = settings.mqttBrokerHost.includes('://')
      ? settings.mqttBrokerHost
      : `wss://${settings.mqttBrokerHost}:8084/mqtt`;

    mqttService.onStatusChange(status => {
      setMqttConnectionState(status);
    });

    mqttService.onTelemetry(reading => {
      setLatestTelemetry(reading);
      setLiveTelemetryBuffer(prev => [...prev.slice(-29), reading]);

      setMachines(prev =>
        prev.map(m => {
          if (m.esp32DeviceId === reading.deviceId || m.id === reading.machineId) {
            const incrementalEnergy = calculateIntervalEnergyKwh(reading.powerKw, reading.intervalSeconds);
            return {
              ...m,
              currentPowerKw: reading.powerKw,
              voltageV: reading.voltageV,
              currentA: reading.currentA,
              powerFactor: reading.powerFactor,
              totalEnergyKwh: Number((m.totalEnergyKwh + incrementalEnergy).toFixed(4)),
              status: reading.status,
              lastCommunication: reading.timestamp,
            };
          }
          return m;
        })
      );
    });

    mqttService.connect({
      brokerUrl,
      topicPrefix: settings.mqttTopicPrefix,
    });

    return () => {
      mqttService.disconnect();
    };
  }, [settings.operatingMode, settings.mqttBrokerHost, settings.mqttTopicPrefix]);

  // Aggregate Metrics
  const totalCurrentPowerDemandKw = useMemo(() => {
    return Number(machines.reduce((acc, m) => acc + (m.status !== 'offline' ? m.currentPowerKw : 0), 0).toFixed(2));
  }, [machines]);

  const totalEnergyTodayKwh = useMemo(() => {
    return Number(machines.reduce((acc, m) => acc + m.totalEnergyKwh, 0).toFixed(1));
  }, [machines]);

  const estimatedCostTodayInr = useMemo(() => {
    return calculateElectricityCost(totalEnergyTodayKwh, settings.tariffPerKwh);
  }, [totalEnergyTodayKwh, settings.tariffPerKwh]);

  const potentialSavingsInr = useMemo(() => {
    return recommendations
      .filter(r => r.status !== 'implemented' && r.status !== 'dismissed')
      .reduce((acc, r) => acc + r.estimatedSavingsInr, 0);
  }, [recommendations]);

  const energyEfficiencyScore = useMemo(() => {
    // Efficiency = (Total Active Productive Energy / Total Energy Consumed) * 100
    const runningCount = machines.filter(m => m.status === 'running').length;
    const idleCount = machines.filter(m => m.status === 'idle').length;
    const totalCount = machines.filter(m => m.status !== 'offline').length;
    if (totalCount === 0) return 90;
    const ratio = runningCount / (runningCount + idleCount * 1.5);
    return Math.round(Math.min(96, Math.max(62, ratio * 100)));
  }, [machines]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUserRole,
        settings,
        updateSettings,
        machines,
        addMachine,
        updateMachine,
        deleteMachine,
        devices,
        addDevice,
        updateDevice,
        deleteDevice,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        recommendations,
        updateRecommendationStatus,
        liveTelemetryBuffer,
        latestTelemetry,
        isSimulatorActive,
        setIsSimulatorActive,
        triggerSimulatedScenario,
        isAuthenticated,
        login,
        logout,
        mqttConnectionState,
        setMqttConnectionState,
        totalEnergyTodayKwh,
        estimatedCostTodayInr,
        totalCurrentPowerDemandKw,
        energyEfficiencyScore,
        potentialSavingsInr,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
