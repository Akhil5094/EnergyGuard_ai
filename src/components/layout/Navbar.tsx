import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Activity,
  Bell,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Wifi,
  WifiOff,
  UserCheck,
  ChevronDown,
  Sparkles,
  Globe2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

import { LogOut } from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface NavbarProps {
  onOpenAlerts: () => void;
  onLogout: () => void;
  onOpenWebsite?: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAlerts, onLogout, onOpenWebsite, activeTab }) => {
  const {
    user,
    setUserRole,
    settings,
    updateSettings,
    alerts,
    isSimulatorActive,
    setIsSimulatorActive,
    triggerSimulatedScenario,
    mqttConnectionState,
    resetToDefaultData,
    totalCurrentPowerDemandKw,
  } = useApp();

  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  const roleTitles: Record<UserRole, string> = {
    owner: 'Factory Owner (Admin)',
    energy_manager: 'Energy Manager',
    supervisor: 'Shopfloor Supervisor',
    operator: 'Machine Operator',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-md">
      {/* Brand & Factory */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base lg:text-lg flex items-center gap-1">
                EnergyGuard <span className="text-emerald-400 font-black">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-300">
                v1.2-ENTERPRISE
              </span>
              {onOpenWebsite && (
                <button
                  onClick={onOpenWebsite}
                  className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 hover:text-white text-[11px] font-semibold transition"
                  title="Return to Public Website"
                >
                  <Globe2 className="h-3 w-3 text-emerald-400" />
                  <span>Website</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {settings.factoryName}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Live telemetry status & Operating mode indicator */}
      <div className="hidden md:flex items-center gap-3">
        {/* Connection status */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-md text-xs">
          {mqttConnectionState === 'connected' ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Wifi className="h-3.5 w-3.5" />
              <span className="font-mono font-medium">MQTT 1883 ONLINE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400">
              <WifiOff className="h-3.5 w-3.5" />
              <span className="font-mono">MQTT DISCONNECTED</span>
            </span>
          )}
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono">
            Demand: <strong className="text-white">{totalCurrentPowerDemandKw} kW</strong>
          </span>
        </div>

        {/* Operating Mode Toggle (Rule 11 compliance: clearly identifies simulated vs real) */}
        <button
          onClick={() =>
            updateSettings({
              operatingMode: settings.operatingMode === 'demo' ? 'real_iot' : 'demo',
            })
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
            settings.operatingMode === 'demo'
              ? 'bg-amber-950/40 border-amber-600/60 text-amber-300 hover:bg-amber-900/50'
              : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/50'
          }`}
          title="Click to toggle between Demo Simulator and Real ESP32 MQTT mode"
        >
          <Activity className="h-3.5 w-3.5" />
          <span>
            {settings.operatingMode === 'demo' ? 'DEMO MODE (Simulated)' : 'REAL IOT MODE (ESP32)'}
          </span>
        </button>

        {/* Simulator Run / Pause */}
        {settings.operatingMode === 'demo' && (
          <button
            onClick={() => setIsSimulatorActive(!isSimulatorActive)}
            className={`p-1.5 rounded border text-xs flex items-center gap-1 transition ${
              isSimulatorActive
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-emerald-900/60 border-emerald-600 text-emerald-200'
            }`}
            title={isSimulatorActive ? 'Pause real-time tick generation' : 'Resume telemetry stream'}
          >
            {isSimulatorActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Right Actions: Anomaly injection trigger, Alerts, Role Switcher */}
      <div className="flex items-center gap-2">
        {/* Simulate Anomaly Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)}
            className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 px-2.5 py-1.5 rounded-md text-xs font-medium transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Inject Anomaly</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {isScenarioMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                Trigger Live Test Scenarios (Demo)
              </div>
              <button
                onClick={() => {
                  triggerSimulatedScenario('compressor_leak');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-start gap-2 text-slate-200"
              >
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-300">Compressor Load Spike (24.6 kW)</div>
                  <div className="text-[11px] text-slate-400">Triggers Isolation Forest spike anomaly</div>
                </div>
              </button>
              <button
                onClick={() => {
                  triggerSimulatedScenario('idle_waste');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-start gap-2 text-slate-200"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-300">Excessive Idle Waste (Press 180m)</div>
                  <div className="text-[11px] text-slate-400">Detects continuous idle draw during break</div>
                </div>
              </button>
              <button
                onClick={() => {
                  triggerSimulatedScenario('bearing_overload');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-start gap-2 text-slate-200"
              >
                <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-orange-300">CNC Spindle Bearing Drag (+24°C)</div>
                  <div className="text-[11px] text-slate-400">Elevated continuous current & motor temp</div>
                </div>
              </button>
              <button
                onClick={() => {
                  triggerSimulatedScenario('voltage_sag');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-start gap-2 text-slate-200"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-300">Grid Voltage Sag (204 V)</div>
                  <div className="text-[11px] text-slate-400">Triggers factory-wide voltage alert</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="View active alerts"
        >
          <Bell className="h-4 w-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Role Selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-md text-xs transition"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-medium text-slate-200 hidden md:inline">
              {roleTitles[user.role]}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-slate-400 border-b border-slate-800 font-semibold text-[10px] uppercase">
                Switch Role (RBAC Simulation)
              </div>
              {(['owner', 'energy_manager', 'supervisor', 'operator'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between ${
                    user.role === r ? 'text-emerald-400 font-bold bg-slate-800/40' : 'text-slate-300'
                  }`}
                >
                  <span>{roleTitles[r]}</span>
                  {user.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </button>
              ))}
              <div className="border-t border-slate-800 mt-1 pt-1 space-y-1">
                <button
                  onClick={() => {
                    setIsRoleMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
                <button
                  onClick={() => {
                    setIsRoleMenuOpen(false);
                    setShowResetConfirm(true);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Seed Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* In-App Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset Factory Seed Data?"
        message="This will reset all machinery telemetry, active alarms, and tariff configurations back to initial factory default state."
        confirmText="Reset All Data"
        cancelText="Keep Current Data"
        isDangerous={true}
        onConfirm={resetToDefaultData}
        onClose={() => setShowResetConfirm(false)}
      />
    </header>
  );
};
