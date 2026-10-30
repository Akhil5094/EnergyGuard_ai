import React, { useState, useMemo } from 'react';
import {
  Zap,
  IndianRupee,
  Activity,
  Cpu,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Gauge,
  Clock,
  CheckCircle,
  ExternalLink,
  Calendar,
  BarChart2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatCompact, calculateElectricityCost } from '../../utils/energyCalculations';
import { TabId } from '../layout/Sidebar';

interface DashboardViewProps {
  onNavigateTab: (tab: TabId) => void;
  onSelectMachine: (machineId: string) => void;
}

export type DateFilterType = 'today' | 'yesterday' | '7days' | '30days';

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, onSelectMachine }) => {
  const {
    machines,
    settings,
    alerts,
    recommendations,
    totalEnergyTodayKwh,
    estimatedCostTodayInr,
    totalCurrentPowerDemandKw,
    energyEfficiencyScore,
    potentialSavingsInr,
    liveTelemetryBuffer,
    acknowledgeAlert,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; kw: number; kwh?: number; sub?: string } | null>(null);

  const runningMachines = machines.filter(m => m.status === 'running');
  const idleMachines = machines.filter(m => m.status === 'idle');
  const offlineMachines = machines.filter(m => m.status === 'offline');
  const warningMachines = machines.filter(m => m.status === 'warning');

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const topRecommendations = recommendations.filter(r => r.status === 'new' || r.status === 'in_progress').slice(0, 3);

  // Peak demand threshold
  const peakDemandThreshold = settings.peakDemandThresholdKw;

  // Period-specific aggregated dataset
  const periodData = useMemo(() => {
    const tariff = settings.tariffPerKwh;

    switch (dateFilter) {
      case 'yesterday':
        return {
          filter: 'yesterday' as const,
          label: 'Yesterday',
          badge: 'Completed 24h Shift',
          subLabel: 'Full 24-hour recorded energy audit (00:00 – 23:59)',
          energyKwh: 612.4,
          costInr: Math.round(612.4 * tariff),
          peakKw: 48.0,
          peakTime: '14:15 PM (Shift 2)',
          peakPercentage: Math.min(100, (48.0 / peakDemandThreshold) * 100),
          efficiencyScore: 82,
          idleHoursTotal: 10.3,
          idleCostInr: Math.round(10.3 * 3.8 * tariff),
          uptimePercentage: 91.4,
          comparisonText: '-2.1% lower than day before',
          comparisonPositive: true,
          powerFactorAvg: 0.89,
          voltageAvg: 231.2,
          quickMetric1Label: 'Average Power Factor',
          quickMetric1Val: '0.89 PF (Compliant)',
          quickMetric2Label: 'Grid Voltage Stability',
          quickMetric2Val: '231.2 V (±1.5%)',
          quickMetric3Label: 'Recorded Max Peak',
          quickMetric3Val: '48.0 kW @ 14:15 PM',
          chartTitle: 'Yesterday 24-Hour Load Profile (kW)',
          chartSubtitle: 'Continuous hourly power profile across 3 factory production shifts',
          chartType: 'hourly' as const,
          chartPoints: [
            { label: '00:00', kw: 9.8, kwh: 9.8, sub: 'Shift 3 Graveyard baseline' },
            { label: '02:00', kw: 8.5, kwh: 8.5, sub: 'Minimum night load' },
            { label: '04:00', kw: 9.2, kwh: 9.2, sub: 'Compressor maintenance cycle' },
            { label: '06:00', kw: 18.6, kwh: 18.6, sub: 'Shift 1 morning startup' },
            { label: '08:00', kw: 38.4, kwh: 38.4, sub: 'VMC CNC & Hydraulic run' },
            { label: '10:00', kw: 44.5, kwh: 44.5, sub: 'Full production batch' },
            { label: '11:00', kw: 46.8, kwh: 46.8, sub: 'Peak morning roughing' },
            { label: '12:00', kw: 36.2, kwh: 36.2, sub: 'Lunch shift rotation' },
            { label: '14:00', kw: 48.0, kwh: 48.0, sub: 'Daily Peak: Stamping Press run' },
            { label: '16:00', kw: 42.1, kwh: 42.1, sub: 'Shift 2 afternoon steady-state' },
            { label: '18:00', kw: 39.5, kwh: 39.5, sub: 'Evening ToD peak tariff window' },
            { label: '20:00', kw: 32.8, kwh: 32.8, sub: 'Packaging & conveyor run' },
            { label: '22:00', kw: 18.2, kwh: 18.2, sub: 'Shift 3 transition handover' },
            { label: '23:00', kw: 12.4, kwh: 12.4, sub: 'Off-peak cooling loop' },
          ],
          machines: [
            {
              id: 'MCH-001',
              name: 'CNC Milling VMC-850',
              energyKwh: 142.0,
              costInr: Math.round(142.0 * tariff),
              runHours: 14.2,
              idleHours: 1.8,
              avgLoad: 68,
              peakKw: 14.8,
              statusText: 'Completed 16-hr work order',
            },
            {
              id: 'MCH-002',
              name: 'Rotary Screw Compressor 22kW',
              energyKwh: 258.4,
              costInr: Math.round(258.4 * tariff),
              runHours: 18.5,
              idleHours: 3.2,
              avgLoad: 79,
              peakKw: 22.4,
              statusText: 'Unloader cycling flagged',
            },
            {
              id: 'MCH-003',
              name: 'Hydraulic Stamping Press 40T',
              energyKwh: 88.5,
              costInr: Math.round(88.5 * tariff),
              runHours: 7.8,
              idleHours: 4.6,
              avgLoad: 48,
              peakKw: 17.5,
              statusText: 'Excess idle detected (4.6h)',
            },
            {
              id: 'MCH-004',
              name: 'Centrifugal Chilled Water Pump',
              energyKwh: 85.2,
              costInr: Math.round(85.2 * tariff),
              runHours: 21.0,
              idleHours: 0.5,
              avgLoad: 89,
              peakKw: 7.2,
              statusText: 'Continuous cooling run',
            },
            {
              id: 'MCH-005',
              name: 'Automated Conveyor & Drives',
              energyKwh: 38.3,
              costInr: Math.round(38.3 * tariff),
              runHours: 8.0,
              idleHours: 0.2,
              avgLoad: 62,
              peakKw: 5.1,
              statusText: 'Normal outbound operation',
            },
          ],
        };

      case '7days':
        return {
          filter: '7days' as const,
          label: 'Last 7 Days',
          badge: 'Rolling 7-Day Window',
          subLabel: 'Weekly cumulative energy expenditure (Mon – Sun)',
          energyKwh: 3397.9,
          costInr: Math.round(3397.9 * tariff), // ~₹32,280
          peakKw: 51.2,
          peakTime: 'Friday 11:30 AM',
          peakPercentage: Math.min(100, (51.2 / peakDemandThreshold) * 100),
          efficiencyScore: 83,
          idleHoursTotal: 24.7,
          idleCostInr: Math.round(24.7 * 3.8 * tariff),
          uptimePercentage: 88.5,
          comparisonText: '-4.6% vs previous 7-day period',
          comparisonPositive: true,
          powerFactorAvg: 0.90,
          voltageAvg: 230.9,
          quickMetric1Label: '7-Day Average Power Factor',
          quickMetric1Val: '0.90 PF (Good)',
          quickMetric2Label: 'Daily Energy Average',
          quickMetric2Val: '485.4 kWh / day',
          quickMetric3Label: 'Weekly Peak Recorded',
          quickMetric3Val: '51.2 kW (Friday)',
          chartTitle: 'Daily Factory Energy & Peak Demand (Last 7 Days)',
          chartSubtitle: 'Aggregated daily consumption (kWh) with peak instantaneous demand (kW)',
          chartType: 'daily' as const,
          chartPoints: [
            { label: 'Mon', kw: 42.1, kwh: 540.2, sub: 'Full shift production: 540.2 kWh' },
            { label: 'Tue', kw: 46.5, kwh: 588.6, sub: 'Heavy machining runs: 588.6 kWh' },
            { label: 'Wed', kw: 48.0, kwh: 612.4, sub: 'Stamping press quota: 612.4 kWh' },
            { label: 'Thu', kw: 43.8, kwh: 575.1, sub: 'Standard production: 575.1 kWh' },
            { label: 'Fri', kw: 51.2, kwh: 630.9, sub: 'Weekly peak load: 630.9 kWh' },
            { label: 'Sat', kw: 28.4, kwh: 340.5, sub: 'Half-day single shift: 340.5 kWh' },
            { label: 'Sun', kw: 12.0, kwh: 110.2, sub: 'Maintenance & chiller: 110.2 kWh' },
          ],
          machines: [
            {
              id: 'MCH-001',
              name: 'CNC Milling VMC-850',
              energyKwh: 785.4,
              costInr: Math.round(785.4 * tariff),
              runHours: 88.0,
              idleHours: 12.0,
              avgLoad: 70,
              peakKw: 15.0,
              statusText: '88 operating hours logged',
            },
            {
              id: 'MCH-002',
              name: 'Rotary Screw Compressor 22kW',
              energyKwh: 1462.8,
              costInr: Math.round(1462.8 * tariff),
              runHours: 120.0,
              idleHours: 24.0,
              avgLoad: 81,
              peakKw: 23.9,
              statusText: 'Pneumatic leak audit pending',
            },
            {
              id: 'MCH-003',
              name: 'Hydraulic Stamping Press 40T',
              energyKwh: 512.6,
              costInr: Math.round(512.6 * tariff),
              runHours: 52.0,
              idleHours: 32.0,
              avgLoad: 46,
              peakKw: 18.2,
              statusText: '32h idle waste recorded',
            },
            {
              id: 'MCH-004',
              name: 'Centrifugal Chilled Water Pump',
              energyKwh: 486.2,
              costInr: Math.round(486.2 * tariff),
              runHours: 144.0,
              idleHours: 3.0,
              avgLoad: 88,
              peakKw: 7.4,
              statusText: 'Continuous loop cooling',
            },
            {
              id: 'MCH-005',
              name: 'Automated Conveyor & Drives',
              energyKwh: 150.9,
              costInr: Math.round(150.9 * tariff),
              runHours: 48.0,
              idleHours: 2.0,
              avgLoad: 60,
              peakKw: 5.2,
              statusText: 'Outbound dispatch sync',
            },
          ],
        };

      case '30days':
        return {
          filter: '30days' as const,
          label: 'Last 30 Days',
          badge: 'Monthly Billing Cycle',
          subLabel: 'Official industrial tariff billing period aggregate',
          energyKwh: 14820.5,
          costInr: Math.round(14820.5 * tariff), // ~₹1,40,795
          peakKw: 58.4,
          peakTime: 'Oct 14, 10:45 AM',
          peakPercentage: Math.min(100, (58.4 / peakDemandThreshold) * 100),
          efficiencyScore: 85,
          idleHoursTotal: 105.0,
          idleCostInr: Math.round(105.0 * 3.8 * tariff),
          uptimePercentage: 86.8,
          comparisonText: '-6.2% vs previous 30-day billing cycle',
          comparisonPositive: true,
          powerFactorAvg: 0.91,
          voltageAvg: 231.0,
          quickMetric1Label: 'Monthly Power Factor Avg',
          quickMetric1Val: '0.91 PF (Within Tariff Limit)',
          quickMetric2Label: 'Daily Energy Average',
          quickMetric2Val: '494.0 kWh / day',
          quickMetric3Label: 'Maximum Monthly Demand',
          quickMetric3Val: '58.4 kW (89.8% of 65 kW Cap)',
          chartTitle: '30-Day Energy Trend & 4-Week Load Profile',
          chartSubtitle: 'Weekly energy totals (kWh) with peak instantaneous power spikes (kW)',
          chartType: 'weekly' as const,
          chartPoints: [
            { label: 'Week 1', kw: 54.2, kwh: 3450.0, sub: 'Week 1 total: 3,450 kWh • Peak 54.2 kW' },
            { label: 'Week 2', kw: 58.4, kwh: 3710.0, sub: 'Week 2 (Monthly Peak): 3,710 kWh • Peak 58.4 kW' },
            { label: 'Week 3', kw: 52.8, kwh: 3580.0, sub: 'Week 3 total: 3,580 kWh • Peak 52.8 kW' },
            { label: 'Week 4', kw: 56.1, kwh: 4080.5, sub: 'Week 4 (Overtime run): 4,080.5 kWh • Peak 56.1 kW' },
          ],
          machines: [
            {
              id: 'MCH-001',
              name: 'CNC Milling VMC-850',
              energyKwh: 3420.0,
              costInr: Math.round(3420.0 * tariff),
              runHours: 390.0,
              idleHours: 54.0,
              avgLoad: 72,
              peakKw: 15.2,
              statusText: '390 operating hours logged',
            },
            {
              id: 'MCH-002',
              name: 'Rotary Screw Compressor 22kW',
              energyKwh: 6380.0,
              costInr: Math.round(6380.0 * tariff),
              runHours: 520.0,
              idleHours: 110.0,
              avgLoad: 82,
              peakKw: 24.1,
              statusText: 'Top energy consumer (43.0%)',
            },
            {
              id: 'MCH-003',
              name: 'Hydraulic Stamping Press 40T',
              energyKwh: 2240.0,
              costInr: Math.round(2240.0 * tariff),
              runHours: 230.0,
              idleHours: 140.0,
              avgLoad: 47,
              peakKw: 18.5,
              statusText: '140h idle waste recorded',
            },
            {
              id: 'MCH-004',
              name: 'Centrifugal Chilled Water Pump',
              energyKwh: 2150.0,
              costInr: Math.round(2150.0 * tariff),
              runHours: 620.0,
              idleHours: 12.0,
              avgLoad: 87,
              peakKw: 7.5,
              statusText: 'VFD retrofit planned',
            },
            {
              id: 'MCH-005',
              name: 'Automated Conveyor & Drives',
              energyKwh: 630.5,
              costInr: Math.round(630.5 * tariff),
              runHours: 210.0,
              idleHours: 8.0,
              avgLoad: 58,
              peakKw: 5.4,
              statusText: 'Packaging dispatch line',
            },
          ],
        };

      case 'today':
      default:
        return {
          filter: 'today' as const,
          label: 'Today (Live)',
          badge: 'Live Telemetry Active',
          subLabel: 'Current operational shift telemetry (00:00 – Present)',
          energyKwh: totalEnergyTodayKwh,
          costInr: estimatedCostTodayInr,
          peakKw: totalCurrentPowerDemandKw > 38.4 ? totalCurrentPowerDemandKw : 38.4,
          peakTime: '11:20 AM (Shift 1)',
          peakPercentage: Math.min(100, (totalCurrentPowerDemandKw / peakDemandThreshold) * 100),
          efficiencyScore: energyEfficiencyScore,
          idleHoursTotal: 4.1,
          idleCostInr: Math.round(4.1 * 3.8 * tariff),
          uptimePercentage: 92.0,
          comparisonText: '+3.2% vs yesterday this hour',
          comparisonPositive: false,
          powerFactorAvg: 0.91,
          voltageAvg: 230.8,
          quickMetric1Label: 'Average Factor',
          quickMetric1Val: '0.91 PF (Good)',
          quickMetric2Label: 'Supply Voltage',
          quickMetric2Val: '230.8 V (Stable)',
          quickMetric3Label: "Today's Peak",
          quickMetric3Val: '38.4 kW @ 11:20 AM',
          chartTitle: 'Real-Time Factory Load Profile (kW)',
          chartSubtitle: 'Continuous MQTT telemetry stream from machine current transducers (SCT-013)',
          chartType: 'live' as const,
          chartPoints: [],
          machines: machines.map(m => ({
            id: m.id,
            name: m.name,
            energyKwh: m.totalEnergyKwh,
            costInr: calculateElectricityCost(m.totalEnergyKwh, tariff),
            runHours: m.status === 'running' ? 7.2 : 4.5,
            idleHours: (m.idleMinutesToday / 60),
            avgLoad: m.ratedPowerKw > 0 ? Math.round((m.currentPowerKw / m.ratedPowerKw) * 100) : 0,
            peakKw: m.currentPowerKw,
            statusText: m.status === 'running' ? 'Active in production' : m.status === 'idle' ? `${m.idleMinutesToday}m idle` : m.status,
          })),
        };
    }
  }, [
    dateFilter,
    settings.tariffPerKwh,
    peakDemandThreshold,
    totalEnergyTodayKwh,
    estimatedCostTodayInr,
    totalCurrentPowerDemandKw,
    energyEfficiencyScore,
    machines,
  ]);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Factory Energy Command Center
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
              dateFilter === 'today'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {dateFilter === 'today' ? 'LIVE TELEMETRY' : periodData.badge.toUpperCase()}
            </span>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Real-time IoT power telemetry, machine-level monitoring, and historical energy accounting.
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs shadow-inner">
            {(['today', 'yesterday', '7days', '30days'] as const).map(df => (
              <button
                key={df}
                onClick={() => {
                  setDateFilter(df);
                  setHoveredPoint(null);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  dateFilter === df
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {df === 'today' ? 'Today' : df === 'yesterday' ? 'Yesterday' : df === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400">Time Window:</span>
          <span className="font-bold text-white">{periodData.label}</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-300 font-mono text-[11px]">{periodData.subLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
            periodData.comparisonPositive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {periodData.comparisonPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {periodData.comparisonText}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {periodData.badge}
          </span>
        </div>
      </div>

      {/* Primary KPI Grid (Dynamically updates with periodData) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Energy Consumption */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {dateFilter === 'today' ? 'Total Energy Consumed' : `${periodData.label} Energy`}
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-mono font-bold text-white">
              {formatCompact(periodData.energyKwh)}
            </span>
            <span className="text-xs font-mono text-emerald-400">kWh</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Period total</span>
            <span className="text-emerald-400 font-mono font-medium">
              {dateFilter === 'today' ? '5 active nodes' : `${periodData.machines.length} machines audited`}
            </span>
          </div>
        </div>

        {/* 2. Estimated Electricity Cost */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {dateFilter === 'today' ? 'Estimated Utility Cost' : `${periodData.label} Cost`}
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-mono font-bold text-white">
              {formatCurrencyINR(periodData.costInr)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Tariff applied</span>
            <span className="text-slate-300 font-mono">₹{settings.tariffPerKwh}/kWh</span>
          </div>
        </div>

        {/* 3. Current Instantaneous Demand / Period Peak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {dateFilter === 'today' ? 'Active Power Demand' : `${periodData.label} Peak Demand`}
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-mono font-bold text-white">
              {formatCompact(dateFilter === 'today' ? totalCurrentPowerDemandKw : periodData.peakKw)}
            </span>
            <span className="text-xs font-mono text-amber-400">kW</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Sanctioned Limit ({peakDemandThreshold} kW)</span>
              <span className="font-mono">{periodData.peakPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  periodData.peakPercentage > 85 ? 'bg-rose-500' : periodData.peakPercentage > 65 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${periodData.peakPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Machine Status Distribution / Efficiency */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {dateFilter === 'today' ? 'Connected Fleet' : 'Fleet Operating Rate'}
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-white">
              {dateFilter === 'today' ? machines.length : `${periodData.uptimePercentage}%`}
            </div>
            {dateFilter === 'today' ? (
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {runningMachines.length} Run
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {idleMachines.length} Idle
                </span>
                {warningMachines.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {warningMachines.length} Warn
                  </span>
                )}
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {offlineMachines.length} Off
                </span>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-slate-300">
                <div>Idle Waste: <span className="text-rose-400 font-bold">{periodData.idleHoursTotal} hrs</span></div>
                <div className="text-slate-400">Waste Cost: ₹{periodData.idleCostInr}</div>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Period Efficiency Index</span>
            <span className="text-emerald-400 font-bold font-mono">{periodData.efficiencyScore}%</span>
          </div>
        </div>
      </div>

      {/* Critical Alert Flash Banner (if active alerts present) */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-300 text-sm">
                  {activeAlerts.length} Active System Alert{activeAlerts.length > 1 ? 's' : ''} Requiring Attention
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 uppercase font-bold">
                  {activeAlerts[0].severity}
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5 line-clamp-1">
                {activeAlerts[0].title}: {activeAlerts[0].description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={() => acknowledgeAlert(activeAlerts[0].id)}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-xs font-medium border border-rose-600/50 transition cursor-pointer"
            >
              Acknowledge
            </button>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Power Graph & Machine Energy Distribution (Synchronized with dateFilter) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Chart Container */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm lg:text-base">
                  {periodData.chartTitle}
                </h3>
                {dateFilter === 'today' ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    HISTORICAL LOG
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {periodData.chartSubtitle}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Chart Display Area */}
          <div className="h-60 w-full bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 relative flex flex-col justify-between">
            {/* Hover Tooltip if hovering a bar or point */}
            {hoveredPoint && (
              <div className="absolute top-2 right-3 z-30 bg-slate-900/95 border border-emerald-500/50 rounded-lg p-2 shadow-xl text-xs font-mono">
                <div className="text-white font-bold">{hoveredPoint.label}: {hoveredPoint.kw} kW Peak</div>
                {hoveredPoint.kwh !== undefined && (
                  <div className="text-emerald-400">Energy: {hoveredPoint.kwh} kWh</div>
                )}
                {hoveredPoint.sub && (
                  <div className="text-slate-400 text-[10px]">{hoveredPoint.sub}</div>
                )}
              </div>
            )}

            {/* LIVE OSCILLOSCOPE (Today) */}
            {periodData.chartType === 'live' && (
              <>
                <div className="absolute inset-0 grid grid-rows-4 pointer-events-none p-3">
                  <div className="border-b border-slate-800/40 text-[9px] font-mono text-slate-600 flex justify-end">45 kW</div>
                  <div className="border-b border-slate-800/40 text-[9px] font-mono text-slate-600 flex justify-end">30 kW</div>
                  <div className="border-b border-slate-800/40 text-[9px] font-mono text-slate-600 flex justify-end">15 kW</div>
                  <div className="text-[9px] font-mono text-slate-600 flex justify-end">0 kW</div>
                </div>

                <div className="relative h-full w-full flex items-end">
                  <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="livePowerGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 70 Q 50 40, 100 65 T 200 45 T 300 30 T 400 55 L 500 40 L 500 120 L 0 120 Z"
                      fill="url(#livePowerGrad)"
                    />
                    <path
                      d="M 0 70 Q 50 40, 100 65 T 200 45 T 300 30 T 400 55 L 500 40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60 z-10">
                  <span>-60s</span>
                  <span>-45s</span>
                  <span>-30s</span>
                  <span>-15s</span>
                  <span className="text-emerald-400 font-bold">LIVE (NOW)</span>
                </div>
              </>
            )}

            {/* HOURLY PROFILE (Yesterday 24h Profile) */}
            {periodData.chartType === 'hourly' && (
              <div className="h-full w-full flex flex-col justify-between pt-2">
                <div className="flex items-end justify-between gap-1.5 h-44 px-1">
                  {periodData.chartPoints.map((pt, idx) => {
                    const heightPercent = Math.min(100, Math.max(12, (pt.kw / 50) * 100));
                    const isPeak = pt.kw >= 46;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      >
                        <div
                          className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 ${
                            isPeak
                              ? 'bg-amber-400 group-hover:bg-amber-300'
                              : 'bg-emerald-500/80 group-hover:bg-emerald-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[9px] font-mono text-slate-500 mt-1 truncate max-w-full">
                          {pt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Shift 3 (Night Graveyard)</span>
                  <span className="text-amber-400">Shift 1 (Morning Peak: 48.0 kW)</span>
                  <span>Shift 2 (Evening ToD)</span>
                </div>
              </div>
            )}

            {/* DAILY BARS (Last 7 Days) */}
            {periodData.chartType === 'daily' && (
              <div className="h-full w-full flex flex-col justify-between pt-2">
                <div className="flex items-end justify-between gap-3 h-44 px-3">
                  {periodData.chartPoints.map((pt, idx) => {
                    const kwhHeight = pt.kwh ? Math.min(100, Math.max(15, (pt.kwh / 700) * 100)) : 50;
                    const peakHeight = Math.min(100, Math.max(15, (pt.kw / 60) * 100));
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      >
                        <div className="w-full flex items-end justify-center gap-1.5 h-full">
                          {/* Energy Bar */}
                          <div
                            className="w-1/2 max-w-[32px] bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition-all duration-300"
                            style={{ height: `${kwhHeight}%` }}
                          />
                          {/* Peak Bar */}
                          <div
                            className="w-1/3 max-w-[18px] bg-amber-400/80 group-hover:bg-amber-300 rounded-t transition-all duration-300"
                            style={{ height: `${peakHeight}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-300 mt-2 font-semibold">
                          {pt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-2 w-2 bg-emerald-500 rounded" /> Energy Consumption (kWh)
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="h-2 w-2 bg-amber-400 rounded" /> Instantaneous Peak (kW)
                  </span>
                  <span className="text-slate-400">Weekly Total: 3,397.9 kWh</span>
                </div>
              </div>
            )}

            {/* WEEKLY BLOCKS (Last 30 Days) */}
            {periodData.chartType === 'weekly' && (
              <div className="h-full w-full flex flex-col justify-between pt-2">
                <div className="flex items-end justify-around gap-6 h-44 px-4">
                  {periodData.chartPoints.map((pt, idx) => {
                    const kwhHeight = pt.kwh ? Math.min(100, Math.max(20, (pt.kwh / 4500) * 100)) : 50;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="flex-1 max-w-[120px] flex flex-col items-center h-full justify-end group cursor-pointer"
                      >
                        <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1 group-hover:scale-105 transition">
                          {pt.kwh} kWh
                        </div>
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600/60 to-emerald-400/90 group-hover:to-emerald-300 rounded-t-lg transition-all duration-300 border-t border-emerald-300/40"
                          style={{ height: `${kwhHeight}%` }}
                        />
                        <span className="text-xs font-mono text-slate-200 mt-2 font-bold">
                          {pt.label}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400">
                          {pt.kw} kW Peak
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Billing Cycle Days 1-30</span>
                  <span className="text-amber-400">Cycle Peak: 58.4 kW (Week 2)</span>
                  <span className="text-white font-bold">Month Total: 14,820.5 kWh</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar below chart (Dynamic per period) */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-slate-400 block text-[10px] font-medium">{periodData.quickMetric1Label}</span>
              <span className="font-mono font-bold text-white text-xs">{periodData.quickMetric1Val}</span>
            </div>
            <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-slate-400 block text-[10px] font-medium">{periodData.quickMetric2Label}</span>
              <span className="font-mono font-bold text-white text-xs">{periodData.quickMetric2Val}</span>
            </div>
            <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-slate-400 block text-[10px] font-medium">{periodData.quickMetric3Label}</span>
              <span className="font-mono font-bold text-amber-400 text-xs">{periodData.quickMetric3Val}</span>
            </div>
          </div>
        </div>

        {/* Machine Energy Consumption Distribution (Dynamic with periodData) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm lg:text-base">Machine Energy Share</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                {periodData.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Energy breakdown for {periodData.label.toLowerCase()} showing top factory consumers.
            </p>

            <div className="space-y-3">
              {periodData.machines.map(m => {
                const percentage = periodData.energyKwh > 0 ? (m.energyKwh / periodData.energyKwh) * 100 : 0;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMachine(m.id)}
                    className="cursor-pointer group hover:bg-slate-800/40 p-2 rounded-lg transition"
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-200 group-hover:text-emerald-400 transition truncate max-w-[160px]">
                        {m.name}
                      </span>
                      <span className="font-mono text-slate-300 font-semibold">
                        {m.energyKwh.toFixed(1)} kWh ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                        style={{ width: `${Math.max(6, percentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{m.statusText}</span>
                      <span className="text-slate-200 font-bold">
                        {formatCurrencyINR(m.costInr)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="w-full mt-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition text-center cursor-pointer border border-slate-700"
          >
            Open Comprehensive Analytics & CSV Export →
          </button>
        </div>
      </div>

      {/* Machine Fleet Telemetry Grid (Period Responsive) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Machine Telemetry Grid</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {periodData.label} Metrics
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {dateFilter === 'today'
                ? 'Live electrical parameters measured via ESP32 sensor nodes (Current, Voltage, PF, kW)'
                : `Audited operational performance, runtime, and energy consumption for ${periodData.label.toLowerCase()}`}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('machines')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Machines</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map(machine => {
            const periodMachine = periodData.machines.find(pm => pm.id === machine.id);
            const statusColors = {
              running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              idle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              warning: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
              offline: 'bg-slate-800 text-slate-400 border-slate-700',
              maintenance: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            };

            const loadPercentage = machine.ratedPowerKw > 0
              ? Math.min(100, Math.round((machine.currentPowerKw / machine.ratedPowerKw) * 100))
              : 0;

            return (
              <div
                key={machine.id}
                onClick={() => onSelectMachine(machine.id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition cursor-pointer hover:shadow-lg relative overflow-hidden group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                      {machine.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{machine.location}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold ${
                      statusColors[machine.status]
                    }`}
                  >
                    {dateFilter === 'today' ? machine.status : `${periodMachine?.runHours.toFixed(0)}h RUN`}
                  </span>
                </div>

                {/* Primary Metric - changes with dateFilter */}
                {dateFilter === 'today' ? (
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-2xl font-mono font-bold text-white">
                        {machine.status === 'offline' ? '0.00' : machine.currentPowerKw.toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 ml-1">kW</span>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <div>Load: {loadPercentage}%</div>
                      <div className="text-[10px] text-slate-500">Rated {machine.ratedPowerKw} kW</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-2xl font-mono font-bold text-white">
                        {periodMachine?.energyKwh.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 ml-1">kWh</span>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <div className="text-emerald-400 font-bold">{formatCurrencyINR(periodMachine?.costInr || 0)}</div>
                      <div className="text-[10px] text-slate-500">Avg Load: {periodMachine?.avgLoad}%</div>
                    </div>
                  </div>
                )}

                {/* Parameter Gauges */}
                {dateFilter === 'today' ? (
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Voltage</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {machine.status === 'offline' ? '0 V' : `${machine.voltageV} V`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Current</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {machine.status === 'offline' ? '0 A' : `${machine.currentA} A`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">PF</span>
                      <span
                        className={`text-xs font-semibold ${
                          machine.powerFactor < 0.85 && machine.status !== 'offline'
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }`}
                      >
                        {machine.status === 'offline' ? '0.00' : machine.powerFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Runtime</span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {periodMachine?.runHours.toFixed(1)} hrs
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Idle Waste</span>
                      <span className={`text-xs font-semibold ${periodMachine && periodMachine.idleHours > 2 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {periodMachine?.idleHours.toFixed(1)} hrs
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Period Peak</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {periodMachine?.peakKw.toFixed(1)} kW
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer with node ID and Idle time */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {machine.esp32DeviceId}
                  </span>
                  {dateFilter === 'today' ? (
                    machine.idleMinutesToday > 0 && (
                      <span className="text-amber-400/90 font-mono text-[10px] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {machine.idleMinutesToday}m idle
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 font-mono text-[10px]">
                      {periodData.label} Audit Log
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Energy Optimization Insights Teaser */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-900/40 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                AI Energy Optimization Insights
              </h3>
              <p className="text-xs text-slate-400">
                Data-driven recommendations to reduce baseline waste and electricity tariffs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-600/30">
              Est. Monthly Opportunity: <strong>{formatCurrencyINR(potentialSavingsInr)}</strong>
            </span>
            <button
              onClick={() => onNavigateTab('ai')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              View All AI Models →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topRecommendations.map(rec => (
            <div
              key={rec.id}
              className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1">
                  <span className="text-slate-400 truncate max-w-[130px]">{rec.machineName}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold ${
                      rec.priority === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : rec.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white line-clamp-1">{rec.title}</h4>
                <p className="text-[11px] text-slate-300/80 mt-1 line-clamp-2">{rec.explanation}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">
                  +{rec.estimatedSavingsKwh} kWh (₹{rec.estimatedSavingsInr}/mo)
                </span>
                <span className="text-[10px] text-slate-400 capitalize">{rec.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
