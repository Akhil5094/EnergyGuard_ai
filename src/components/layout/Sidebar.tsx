import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  BarChart3,
  BrainCircuit,
  Bell,
  Radio,
  FileCode,
  Settings,
  BookOpen,
  Globe2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type TabId =
  | 'dashboard'
  | 'live'
  | 'machines'
  | 'analytics'
  | 'ai'
  | 'alerts'
  | 'devices'
  | 'firmware'
  | 'settings'
  | 'poster';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onOpenWebsite?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenWebsite }) => {
  const { alerts, machines } = useApp();
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const runningMachinesCount = machines.filter(m => m.status === 'running').length;

  const navItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      badge: `${runningMachinesCount}/${machines.length} active`,
    },
    {
      id: 'live' as TabId,
      label: 'Live IoT Telemetry',
      icon: Activity,
      pulse: true,
    },
    {
      id: 'machines' as TabId,
      label: 'Machine Fleet',
      icon: Cpu,
    },
    {
      id: 'analytics' as TabId,
      label: 'Energy Analytics',
      icon: BarChart3,
    },
    {
      id: 'ai' as TabId,
      label: 'AI Anomaly & Savings',
      icon: BrainCircuit,
      highlight: true,
    },
    {
      id: 'alerts' as TabId,
      label: 'Alert Management',
      icon: Bell,
      badge: activeAlertsCount > 0 ? String(activeAlertsCount) : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'devices' as TabId,
      label: 'ESP32 Device Registry',
      icon: Radio,
    },
    {
      id: 'firmware' as TabId,
      label: 'Firmware & Architecture',
      icon: FileCode,
    },
    {
      id: 'settings' as TabId,
      label: 'Tariff & Factory Settings',
      icon: Settings,
    },
    {
      id: 'poster' as TabId,
      label: 'Poster & SDG 7/9 Alignment',
      icon: Globe2,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Industrial Operations
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.pulse && (
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping mr-1" />
              )}
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    item.badgeColor || (isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Public Website Switcher */}
      {onOpenWebsite && (
        <div className="px-3 pb-2">
          <button
            onClick={onOpenWebsite}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/30 text-emerald-300 hover:text-white text-xs font-semibold transition"
          >
            <Globe2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="truncate">Public Website & ROI</span>
          </button>
        </div>
      )}

      {/* Sustainable Development Goals Footer Banner */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[11px] font-semibold text-slate-300">UN SDG Alignment</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="p-1.5 rounded bg-amber-950/30 border border-amber-600/30 text-amber-300 font-medium">
            <span className="block font-bold">SDG 7</span>
            Affordable & Clean Energy
          </div>
          <div className="p-1.5 rounded bg-blue-950/30 border border-blue-600/30 text-blue-300 font-medium">
            <span className="block font-bold">SDG 9</span>
            Industry & Innovation
          </div>
        </div>
      </div>
    </aside>
  );
};
