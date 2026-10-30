import React, { useState } from 'react';
import {
  Radio,
  Plus,
  Wifi,
  WifiOff,
  Signal,
  Clock,
  Terminal,
  Cpu,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useApp } from '../../context/AppContext';
import { IoTDevice } from '../../types';

export const IoTDevicesView: React.FC = () => {
  const { devices, addDevice, updateDevice, deleteDevice, machines, settings, user } = useApp();

  const [deviceToDelete, setDeviceToDelete] = useState<IoTDevice | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: `EG-N0${devices.length + 1}`,
    deviceName: 'ESP32 Energy Monitor Node',
    machineId: machines[0]?.id || 'MCH-001',
    mqttTopic: `energyguard/telemetry/EG-N0${devices.length + 1}`,
    firmwareVersion: 'v1.4.2-rel',
    sensorType: 'SCT-013-000 100A + ZMPT101B',
    ipAddress: '192.168.1.150',
    rssiDbm: -62,
    status: 'connected' as IoTDevice['status'],
    samplingIntervalSec: 2,
  });

  const isOwnerOrManager = user.role === 'owner' || user.role === 'energy_manager';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDevice({
      deviceId: formData.deviceId,
      deviceName: formData.deviceName,
      machineId: formData.machineId,
      mqttTopic: formData.mqttTopic,
      firmwareVersion: formData.firmwareVersion,
      sensorType: formData.sensorType,
      ipAddress: formData.ipAddress,
      rssiDbm: Number(formData.rssiDbm),
      status: formData.status,
      samplingIntervalSec: Number(formData.samplingIntervalSec),
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="h-6 w-6 text-emerald-400" />
            ESP32 IoT Node Fleet Registry
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Monitor low-cost ESP32-WROOM edge microcontrollers, Wi-Fi RSSI signal quality, and MQTT publisher topics.
          </p>
        </div>

        {isOwnerOrManager && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs lg:text-sm transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Provision New ESP32 Node</span>
          </button>
        )}
      </div>

      {/* Fleet Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(device => {
          const linkedMachine = machines.find(m => m.id === device.machineId);
          const isOnline = device.status === 'connected';

          return (
            <div
              key={device.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden"
            >
              {/* Device Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-base">{device.deviceId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      {device.firmwareVersion}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-300 mt-0.5">{device.deviceName}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {isOnline ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold uppercase">
                      Offline
                    </span>
                  )}
                </div>
              </div>

              {/* Linked Machine Banner */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block uppercase font-mono">Assigned Asset:</span>
                <span className="font-bold text-slate-200">
                  {linkedMachine ? linkedMachine.name : 'Unassigned'}
                </span>
                <div className="text-[11px] text-slate-400">
                  {linkedMachine ? linkedMachine.location : 'Standby Inventory'}
                </div>
              </div>

              {/* Technical Specifications & Network */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>MQTT Topic:</span>
                  <span className="text-emerald-400 truncate max-w-[170px]">{device.mqttTopic}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>IP Address:</span>
                  <span className="text-slate-300">{device.ipAddress}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wi-Fi Signal:</span>
                  <span
                    className={`${
                      device.rssiDbm > -65 ? 'text-emerald-400' : device.rssiDbm > -80 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {device.rssiDbm} dBm ({device.rssiDbm > -65 ? 'Strong' : 'Moderate'})
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hardware Sensor:</span>
                  <span className="text-slate-300 truncate max-w-[160px]">{device.sensorType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sampling Rate:</span>
                  <span className="text-slate-300">Every {device.samplingIntervalSec}s</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Uptime: {device.uptimeHours} hrs</span>
                {isOwnerOrManager && (
                  <button
                    onClick={() => setDeviceToDelete(device)}
                    className="text-rose-400 hover:text-rose-300 text-xs p-1 rounded hover:bg-slate-800 transition"
                    title="Remove Node"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware Troubleshooting and Best Practices Accordion */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-white text-sm lg:text-base flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-emerald-400" />
          ESP32 Field Troubleshooting & Sensor Interface Safety
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400">1. SCT-013 Split-Core CT Safety:</span>
            <p className="text-slate-300 leading-relaxed">
              Always install the 33Ω burden resistor across SCT-013 output terminals BEFORE clamping onto live AC conductors. 
              Never open-circuit a current transformer under load to prevent high inductive voltage spikes.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-400">2. Wi-Fi Reconnect Resilience:</span>
            <p className="text-slate-300 leading-relaxed">
              Industrial shopfloors experience EMI interference from motor drives. Firmware implements non-blocking 
              reconnect loops with exponential backoff so telemetry resumes immediately after grid perturbations.
            </p>
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Provision New ESP32 Node</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Hardware Node Identifier *</label>
              <input
                type="text"
                required
                value={formData.deviceId}
                onChange={e => setFormData({ ...formData, deviceId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Device Label *</label>
              <input
                type="text"
                required
                value={formData.deviceName}
                onChange={e => setFormData({ ...formData, deviceName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Assign to Machine *</label>
              <select
                value={formData.machineId}
                onChange={e => setFormData({ ...formData, machineId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              >
                {machines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Sensor Configuration</label>
                <input
                  type="text"
                  value={formData.sensorType}
                  onChange={e => setFormData({ ...formData, sensorType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">IP Address</label>
                <input
                  type="text"
                  value={formData.ipAddress}
                  onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                Provision Node
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal for Node Deletion */}
      <ConfirmationModal
        isOpen={Boolean(deviceToDelete)}
        title="Unpair & Delete IoT Node?"
        message={`Are you sure you want to unpair IoT Node ${deviceToDelete?.deviceId} (${deviceToDelete?.deviceName})? Live sensor stream on ${deviceToDelete?.mqttTopic} will be disconnected.`}
        confirmText="Unpair & Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={() => {
          if (deviceToDelete) {
            deleteDevice(deviceToDelete.id);
            setDeviceToDelete(null);
          }
        }}
        onClose={() => setDeviceToDelete(null)}
      />
    </div>
  );
};
