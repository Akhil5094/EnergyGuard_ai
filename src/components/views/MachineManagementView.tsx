import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Activity,
  Zap,
  Clock,
  MapPin,
  Calendar,
  X,
  CheckCircle,
  AlertTriangle,
  Radio,
  Sliders,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useApp } from '../../context/AppContext';
import { Machine, MachineStatus, MachineType } from '../../types';
import { formatCurrencyINR } from '../../utils/energyCalculations';

interface MachineManagementViewProps {
  initialSelectedMachineId?: string | null;
  onClearSelectedMachine?: () => void;
}

export const MachineManagementView: React.FC<MachineManagementViewProps> = ({
  initialSelectedMachineId,
  onClearSelectedMachine,
}) => {
  const { machines, addMachine, updateMachine, deleteMachine, settings, alerts, devices, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [activeModalMachine, setActiveModalMachine] = useState<Machine | null>(() => {
    if (initialSelectedMachineId) {
      return machines.find(m => m.id === initialSelectedMachineId) || null;
    }
    return null;
  });

  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  useEffect(() => {
    if (initialSelectedMachineId) {
      const found = machines.find(m => m.id === initialSelectedMachineId);
      if (found) {
        setActiveModalMachine(found);
      }
    }
  }, [initialSelectedMachineId, machines]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    machineType: 'CNC Machine' as MachineType,
    location: '',
    esp32DeviceId: 'EG-N06',
    ratedPowerKw: 15.0,
    status: 'running' as MachineStatus,
    installationDate: new Date().toISOString().split('T')[0],
  });

  const isOwnerOrManager = user.role === 'owner' || user.role === 'energy_manager';

  // Filtered machines
  const filteredMachines = machines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.esp32DeviceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesType = typeFilter === 'all' || m.machineType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      machineType: 'CNC Machine',
      location: 'Bay 3 - Manufacturing',
      esp32DeviceId: `EG-N0${devices.length + 1}`,
      ratedPowerKw: 10.0,
      status: 'running',
      installationDate: new Date().toISOString().split('T')[0],
    });
    setEditingMachine(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (machine: Machine, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      machineType: machine.machineType,
      location: machine.location,
      esp32DeviceId: machine.esp32DeviceId,
      ratedPowerKw: machine.ratedPowerKw,
      status: machine.status,
      installationDate: machine.installationDate,
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (machine: Machine, e: React.MouseEvent) => {
    e.stopPropagation();
    setMachineToDelete(machine);
  };

  const confirmDeleteMachine = () => {
    if (machineToDelete) {
      deleteMachine(machineToDelete.id);
      if (activeModalMachine?.id === machineToDelete.id) {
        setActiveModalMachine(null);
      }
      setMachineToDelete(null);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingMachine) {
      updateMachine(editingMachine.id, {
        name: formData.name,
        machineType: formData.machineType,
        location: formData.location,
        esp32DeviceId: formData.esp32DeviceId,
        ratedPowerKw: Number(formData.ratedPowerKw),
        status: formData.status,
        installationDate: formData.installationDate,
      });
    } else {
      addMachine({
        name: formData.name,
        machineType: formData.machineType,
        factoryId: 'fac-001',
        location: formData.location,
        esp32DeviceId: formData.esp32DeviceId,
        ratedPowerKw: Number(formData.ratedPowerKw),
        status: formData.status,
        installationDate: formData.installationDate,
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-emerald-400" />
            Machine Asset Management
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Configure industrial machinery, rated power thresholds, locations, and linked ESP32 sensor hardware.
          </p>
        </div>

        {isOwnerOrManager && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs lg:text-sm transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Machine</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by machine name, location, or ESP32 node ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="idle">Idle</option>
            <option value="warning">Warning</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Machine Types</option>
            <option value="CNC Machine">CNC Machine</option>
            <option value="Air Compressor">Air Compressor</option>
            <option value="Hydraulic Press">Hydraulic Press</option>
            <option value="Cooling Pump">Cooling Pump</option>
            <option value="Conveyor Motor">Conveyor Motor</option>
          </select>
        </div>
      </div>

      {/* Machines Table / Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Machine & ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">IoT Node</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Rated Power</th>
                <th className="py-3 px-4">Current Power</th>
                <th className="py-3 px-4">Total Energy</th>
                <th className="py-3 px-4">Today's Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredMachines.map(m => {
                const statusStyles = {
                  running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                  idle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  warning: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                  offline: 'bg-slate-800 text-slate-400 border-slate-700',
                  maintenance: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                };

                return (
                  <tr
                    key={m.id}
                    onClick={() => setActiveModalMachine(m)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-sans text-xs">{m.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{m.id} • {m.machineType}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">{m.location}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 text-[11px]">
                        {m.esp32DeviceId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold ${statusStyles[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{m.ratedPowerKw} kW</td>
                    <td className="py-3 px-4 text-white font-bold">
                      {m.status === 'offline' ? '0.00 kW' : `${m.currentPowerKw.toFixed(2)} kW`}
                    </td>
                    <td className="py-3 px-4 text-slate-200">{m.totalEnergyKwh.toFixed(1)} kWh</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {formatCurrencyINR(m.totalEnergyKwh * settings.tariffPerKwh)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isOwnerOrManager && (
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => handleOpenEdit(m, e)}
                            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Edit Machine Specifications"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={e => handleDelete(m, e)}
                            className="p-1.5 rounded hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition"
                            title="Delete Machine"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine Details Modal */}
      {activeModalMachine && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{activeModalMachine.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {activeModalMachine.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeModalMachine.machineType} • Installed {activeModalMachine.installationDate}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModalMachine(null);
                  if (onClearSelectedMachine) onClearSelectedMachine();
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">Instant Power</span>
                <span className="text-lg font-bold text-white">
                  {activeModalMachine.status === 'offline' ? '0 kW' : `${activeModalMachine.currentPowerKw} kW`}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">RMS Voltage</span>
                <span className="text-lg font-bold text-blue-400">
                  {activeModalMachine.voltageV} V
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">RMS Current</span>
                <span className="text-lg font-bold text-amber-400">
                  {activeModalMachine.currentA} A
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">Power Factor</span>
                <span className="text-lg font-bold text-emerald-400">
                  {activeModalMachine.powerFactor}
                </span>
              </div>
            </div>

            {/* Machine Specs & IoT Details */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2 text-xs mb-6">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Assigned ESP32 Node:</span>
                <span className="font-mono text-emerald-400">{activeModalMachine.esp32DeviceId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Physical Location:</span>
                <span className="text-slate-200">{activeModalMachine.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Nameplate Rated Capacity:</span>
                <span className="font-mono text-slate-200">{activeModalMachine.ratedPowerKw} kW</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Idle Minutes Recorded Today:</span>
                <span className="font-mono text-amber-400">{activeModalMachine.idleMinutesToday} minutes</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Total Consumption Today:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {activeModalMachine.totalEnergyKwh.toFixed(2)} kWh ({formatCurrencyINR(activeModalMachine.totalEnergyKwh * settings.tariffPerKwh)})
                </span>
              </div>
            </div>

            {/* Linked Alerts for this machine */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Machine Alert History
              </h4>
              <div className="space-y-2">
                {alerts.filter(a => a.machineId === activeModalMachine.id).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No alerts generated for this machine.</p>
                ) : (
                  alerts
                    .filter(a => a.machineId === activeModalMachine.id)
                    .map(a => (
                      <div
                        key={a.id}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-200">{a.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{a.description}</div>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ml-2 ${
                            a.severity === 'critical' ? 'bg-rose-900/50 text-rose-300' : 'bg-amber-900/50 text-amber-300'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Machine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitForm}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingMachine ? 'Edit Machine Specifications' : 'Register New Factory Machine'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Machine Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. CNC Lathe Machine TL-20"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Machine Category *</label>
                  <select
                    value={formData.machineType}
                    onChange={e => setFormData({ ...formData, machineType: e.target.value as MachineType })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CNC Machine">CNC Machine</option>
                    <option value="Air Compressor">Air Compressor</option>
                    <option value="Hydraulic Press">Hydraulic Press</option>
                    <option value="Cooling Pump">Cooling Pump</option>
                    <option value="Conveyor Motor">Conveyor Motor</option>
                    <option value="Welding Robot">Welding Robot</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Rated Power (kW) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="500"
                    required
                    value={formData.ratedPowerKw}
                    onChange={e => setFormData({ ...formData, ratedPowerKw: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Shopfloor Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bay 1 - Machining"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">ESP32 Device Node ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.esp32DeviceId}
                    onChange={e => setFormData({ ...formData, esp32DeviceId: e.target.value })}
                    placeholder="EG-N06"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as MachineStatus })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="running">Running</option>
                    <option value="idle">Idle</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Installation Date</label>
                  <input
                    type="date"
                    value={formData.installationDate}
                    onChange={e => setFormData({ ...formData, installationDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                {editingMachine ? 'Save Changes' : 'Register Machine'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal for Machine Deletion */}
      <ConfirmationModal
        isOpen={Boolean(machineToDelete)}
        title="Delete Machine Asset?"
        message={`Are you sure you want to delete ${machineToDelete?.name || 'this machine'} (${machineToDelete?.id})? Telemetry and alerts associated with this unit will be unlinked.`}
        confirmText="Delete Machine"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDeleteMachine}
        onClose={() => setMachineToDelete(null)}
      />
    </div>
  );
};
