import React, { useState } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Terminal,
  Zap,
  Gauge,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Machine } from '../../types';

export const LiveMonitoringView: React.FC = () => {
  const {
    machines,
    settings,
    liveTelemetryBuffer,
    latestTelemetry,
    mqttConnectionState,
    setMqttConnectionState,
    triggerSimulatedScenario,
    isSimulatorActive,
    setIsSimulatorActive,
  } = useApp();

  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0]?.id || 'MCH-001');
  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  // Reconnection action
  const handleReconnect = () => {
    setMqttConnectionState('reconnecting');
    setTimeout(() => {
      setMqttConnectionState('connected');
    }, 1200);
  };

  // Generate simulated raw MQTT payload preview
  const rawPayload = {
    device_id: selectedMachine?.esp32DeviceId || 'EG-N01',
    machine_id: selectedMachine?.id || 'MCH-001',
    machine_name: selectedMachine?.name,
    timestamp: new Date().toISOString(),
    voltage_v: selectedMachine?.voltageV,
    current_a: selectedMachine?.currentA,
    power_factor: selectedMachine?.powerFactor,
    power_kw: selectedMachine?.currentPowerKw,
    interval_seconds: settings.telemetryIntervalSec,
    cumulative_energy_kwh: selectedMachine?.totalEnergyKwh,
    status: selectedMachine?.status,
    rssi_dbm: -58,
    frequency_hz: 50.02,
    sensor_calibration_factor: 66.6,
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-400" />
              Live IoT Energy Stream & Oscilloscope
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Real-time subscriber for MQTT topic{' '}
            <code className="text-emerald-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              {settings.mqttTopicPrefix}/#
            </code>{' '}
            via WebSocket gateway.
          </p>
        </div>

        {/* Connection & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {mqttConnectionState === 'connected' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/50 text-emerald-300 text-xs font-mono font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Wifi className="h-3.5 w-3.5" />
              <span>MQTT 1883 CONNECTED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-600/50 text-rose-300 text-xs font-mono font-semibold">
              <WifiOff className="h-3.5 w-3.5" />
              <span>{mqttConnectionState.toUpperCase()}</span>
            </div>
          )}

          <button
            onClick={handleReconnect}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
            title="Force MQTT reconnect handshake"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${mqttConnectionState === 'reconnecting' ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reconnect</span>
          </button>
        </div>
      </div>

      {/* Machine Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
          Select Node:
        </span>
        {machines.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMachineId(m.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-2 transition border ${
              selectedMachineId === m.id
                ? 'bg-emerald-600 border-emerald-500 text-white font-semibold shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                m.status === 'running'
                  ? 'bg-emerald-400'
                  : m.status === 'idle'
                  ? 'bg-amber-400'
                  : m.status === 'warning'
                  ? 'bg-rose-400'
                  : 'bg-slate-500'
              }`}
            />
            <span>{m.name}</span>
            <span className="font-mono text-[10px] opacity-80">({m.currentPowerKw.toFixed(1)} kW)</span>
          </button>
        ))}
      </div>

      {/* Main Live Telemetry Dashboard for Selected Node */}
      {selectedMachine && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Live Dial Gauges & Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Electrical Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Active Power */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Power (P)
                </span>
                <div className="text-3xl font-mono font-black text-white">
                  {selectedMachine.currentPowerKw.toFixed(2)}
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <span>kW</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    {selectedMachine.ratedPowerKw > 0
                      ? `${Math.round((selectedMachine.currentPowerKw / selectedMachine.ratedPowerKw) * 100)}% rated`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* RMS Voltage */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  RMS Voltage (V)
                </span>
                <div className="text-3xl font-mono font-black text-blue-400">
                  {selectedMachine.voltageV.toFixed(1)}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  <span>Volts (AC 50Hz)</span>
                </div>
              </div>

              {/* RMS Current */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  RMS Current (I)
                </span>
                <div className="text-3xl font-mono font-black text-amber-400">
                  {selectedMachine.currentA.toFixed(1)}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  <span>Amperes (SCT-013)</span>
                </div>
              </div>

              {/* Power Factor */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Power Factor (cos φ)
                </span>
                <div
                  className={`text-3xl font-mono font-black ${
                    selectedMachine.powerFactor < 0.85 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedMachine.powerFactor.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  <span>{selectedMachine.powerFactor < 0.85 ? 'Lagging Inductive' : 'Optimal'}</span>
                </div>
              </div>
            </div>

            {/* Live Waveform Oscilloscope Graphic */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-sm lg:text-base flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-emerald-400" />
                    AC Voltage & Current Instantaneous Waveform
                  </h3>
                  <p className="text-xs text-slate-400">
                    50 Hz sinusoidal phase alignment for {selectedMachine.name} ({selectedMachine.esp32DeviceId})
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  Sampling: 1.0 kHz ADC
                </span>
              </div>

              {/* Sine Wave Graphic */}
              <div className="h-44 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-36" viewBox="0 0 600 120" preserveAspectRatio="none">
                  {/* Center zero line */}
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Voltage Sinusoid (Blue) */}
                  <path
                    d="M 0 60 C 50 10, 100 10, 150 60 C 200 110, 250 110, 300 60 C 350 10, 400 10, 450 60 C 500 110, 550 110, 600 60"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />

                  {/* Current Sinusoid (Amber, phase shifted by PF) */}
                  <path
                    d="M 0 60 C 50 25, 100 25, 150 60 C 200 95, 250 95, 300 60 C 350 25, 400 25, 450 60 C 500 95, 550 95, 600 60"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                    transform="translate(18, 0)"
                  />
                </svg>

                {/* Legend Overlay */}
                <div className="absolute bottom-2 right-3 flex items-center gap-4 text-[10px] font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="h-2 w-4 bg-sky-400 rounded-sm" /> Voltage (230V)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="h-2 w-4 bg-amber-400 rounded-sm" /> Current (A)
                  </span>
                  <span className="text-slate-400">Phase Angle φ: ~28.4°</span>
                </div>
              </div>
            </div>

            {/* Quick Anomaly Demonstrator Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Demonstration Testing Triggers
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Academic Evaluation Sandbox</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => triggerSimulatedScenario('compressor_leak')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-rose-300 border border-slate-700 hover:border-rose-500/50 transition text-left"
                >
                  <div className="font-bold text-[11px]">Load Surge</div>
                  <div className="text-[10px] text-slate-400">Trip 24.6 kW Spike</div>
                </button>
                <button
                  onClick={() => triggerSimulatedScenario('idle_waste')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 hover:border-amber-500/50 transition text-left"
                >
                  <div className="font-bold text-[11px]">Idle Waste</div>
                  <div className="text-[10px] text-slate-400">Simulate 3h Idle</div>
                </button>
                <button
                  onClick={() => triggerSimulatedScenario('bearing_overload')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-orange-300 border border-slate-700 hover:border-orange-500/50 transition text-left"
                >
                  <div className="font-bold text-[11px]">Bearing Drag</div>
                  <div className="text-[10px] text-slate-400">+24°C Thermal Drift</div>
                </button>
                <button
                  onClick={() => triggerSimulatedScenario('voltage_sag')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-yellow-300 border border-slate-700 hover:border-yellow-500/50 transition text-left"
                >
                  <div className="font-bold text-[11px]">Grid Sag</div>
                  <div className="text-[10px] text-slate-400">Drop to 204 Volts</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live MQTT Packet Inspector */}
          <div className="space-y-6">
            {/* Raw JSON MQTT Payload Inspector */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  MQTT Ingestion Inspector
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-600/30">
                  TOPIC: {settings.mqttTopicPrefix}/{selectedMachine.esp32DeviceId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Validated JSON payload broadcast from ESP32 edge microcontroller via Mosquitto MQTT broker:
              </p>

              {/* JSON code block */}
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto select-all">
                <pre>{JSON.stringify(rawPayload, null, 2)}</pre>
              </div>

              {/* Formula & Rule explanation for academic evaluation */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1.5">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Energy Calculation Formula
                </div>
                <div className="font-mono text-slate-400">
                  P(kW) = (V × I × PF) / 1000 = ({selectedMachine.voltageV} × {selectedMachine.currentA} × {selectedMachine.powerFactor}) / 1000 ={' '}
                  <strong className="text-emerald-400">{selectedMachine.currentPowerKw.toFixed(2)} kW</strong>
                </div>
                <div className="font-mono text-slate-400">
                  ΔEnergy = P × Δt / 3600 = ({selectedMachine.currentPowerKw.toFixed(2)} × {settings.telemetryIntervalSec}) / 3600 ={' '}
                  <strong className="text-white">
                    {((selectedMachine.currentPowerKw * settings.telemetryIntervalSec) / 3600).toFixed(6)} kWh
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
