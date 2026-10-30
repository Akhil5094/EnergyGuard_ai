import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  IndianRupee,
  Zap,
  TrendingDown,
  Clock,
  Layers,
  ArrowUpRight,
  PieChart,
  Printer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatCompact } from '../../utils/energyCalculations';
import { ReportModal } from './ReportModal';

export const AnalyticsView: React.FC = () => {
  const { machines, settings, totalEnergyTodayKwh, estimatedCostTodayInr } = useApp();

  const [timeHorizon, setTimeHorizon] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Time-of-Day (ToD) Tariff Slabs
  const todSlabs = [
    { name: 'Normal Hours (06:00 - 18:00)', rate: settings.tariffPerKwh, kwh: 340.5, costMultiplier: 1.0, label: 'Base Rate' },
    { name: 'Evening Peak Hours (18:00 - 22:00)', rate: Number((settings.tariffPerKwh * 1.25).toFixed(2)), kwh: 185.2, costMultiplier: 1.25, label: '+25% Peak Surcharge' },
    { name: 'Night Off-Peak (22:00 - 06:00)', rate: Number((settings.tariffPerKwh * 0.80).toFixed(2)), kwh: 96.9, costMultiplier: 0.80, label: '-20% Incentive Concession' },
  ];

  // Dynamic horizon dataset responding to timeHorizon button toggle
  const horizonData = useMemo(() => {
    const tariff = settings.tariffPerKwh;
    switch (timeHorizon) {
      case 'hourly':
        return {
          title: 'Hourly Energy Consumption & Load Profile (Past 24 Hours)',
          totalKwh: 612.4,
          totalCost: Math.round(612.4 * tariff),
          peakKw: 48.0,
          peakLabel: 'Contract Limit: 65 kW (73.8% capacity utilized)',
          idleHours: 4.8,
          idleCost: Math.round(4.8 * 3.8 * tariff),
          kpiLabel: '24-Hour Energy Total',
          kwhScaleMax: 55,
          points: [
            { label: '00:00', kwh: 9.8, peakKw: 10.2 },
            { label: '02:00', kwh: 8.5, peakKw: 9.1 },
            { label: '04:00', kwh: 9.2, peakKw: 11.0 },
            { label: '06:00', kwh: 18.6, peakKw: 22.4 },
            { label: '08:00', kwh: 38.4, peakKw: 41.5 },
            { label: '10:00', kwh: 44.5, peakKw: 46.2 },
            { label: '12:00', kwh: 36.2, peakKw: 39.8 },
            { label: '14:00', kwh: 48.0, peakKw: 48.0 },
            { label: '16:00', kwh: 42.1, peakKw: 44.8 },
            { label: '18:00', kwh: 39.5, peakKw: 42.0 },
            { label: '20:00', kwh: 32.8, peakKw: 35.6 },
            { label: '22:00', kwh: 18.2, peakKw: 20.5 },
          ],
        };
      case 'weekly':
        return {
          title: 'Weekly Energy Consumption & Peak Demand (Last 4 Weeks)',
          totalKwh: 14820.5,
          totalCost: Math.round(14820.5 * tariff),
          peakKw: 58.4,
          peakLabel: 'Contract Limit: 65 kW (89.8% capacity utilized)',
          idleHours: 105.0,
          idleCost: Math.round(105.0 * 3.8 * tariff),
          kpiLabel: 'Monthly Energy Total (4 Weeks)',
          kwhScaleMax: 4500,
          points: [
            { label: 'Week 1', kwh: 3450.0, peakKw: 54.2 },
            { label: 'Week 2', kwh: 3710.0, peakKw: 58.4 },
            { label: 'Week 3', kwh: 3580.0, peakKw: 52.8 },
            { label: 'Week 4', kwh: 4080.5, peakKw: 56.1 },
          ],
        };
      case 'monthly':
        return {
          title: 'Monthly Energy Consumption & Peak Demand (Last 6 Months)',
          totalKwh: 87450.0,
          totalCost: Math.round(87450.0 * tariff),
          peakKw: 61.8,
          peakLabel: 'Contract Limit: 65 kW (95.1% capacity utilized)',
          idleHours: 620.0,
          idleCost: Math.round(620.0 * 3.8 * tariff),
          kpiLabel: '6-Month Energy Total',
          kwhScaleMax: 18000,
          points: [
            { label: 'May', kwh: 14200, peakKw: 55.4 },
            { label: 'Jun', kwh: 15100, peakKw: 59.2 },
            { label: 'Jul', kwh: 14800, peakKw: 56.0 },
            { label: 'Aug', kwh: 14500, peakKw: 57.1 },
            { label: 'Sep', kwh: 14030, peakKw: 54.8 },
            { label: 'Oct', kwh: 14820, peakKw: 58.4 },
          ],
        };
      case 'daily':
      default:
        return {
          title: 'Daily Energy Consumption & Peak Demand (Last 7 Days)',
          totalKwh: 3397.9,
          totalCost: Math.round(3397.9 * tariff),
          peakKw: 51.2,
          peakLabel: 'Contract Limit: 65 kW (78.7% capacity utilized)',
          idleHours: 24.7,
          idleCost: Math.round(24.7 * 3.8 * tariff),
          kpiLabel: 'Weekly Energy Total',
          kwhScaleMax: 700,
          points: [
            { label: 'Mon', kwh: 540.2, peakKw: 42.1 },
            { label: 'Tue', kwh: 588.6, peakKw: 46.5 },
            { label: 'Wed', kwh: 612.4, peakKw: 48.0 },
            { label: 'Thu', kwh: 575.1, peakKw: 43.8 },
            { label: 'Fri', kwh: 630.9, peakKw: 51.2 },
            { label: 'Sat', kwh: 340.5, peakKw: 28.4 },
            { label: 'Sun', kwh: 110.2, peakKw: 12.0 },
          ],
        };
    }
  }, [timeHorizon, settings.tariffPerKwh]);

  // Shift Analysis
  const shiftData = [
    { shift: 'Shift 1 (Morning: 06:00 - 14:00)', energyKwh: 245.8, idlePercent: 12, cost: 2335 },
    { shift: 'Shift 2 (Evening: 14:00 - 22:00)', energyKwh: 280.4, idlePercent: 18, cost: 2664 },
    { shift: 'Shift 3 (Night: 22:00 - 06:00)', energyKwh: 96.5, idlePercent: 44, cost: 917 },
  ];

  // Category summary
  const categoryTotals: Record<string, { kwh: number; count: number }> = {};
  machines.forEach(m => {
    if (!categoryTotals[m.machineType]) {
      categoryTotals[m.machineType] = { kwh: 0, count: 0 };
    }
    categoryTotals[m.machineType].kwh += m.totalEnergyKwh;
    categoryTotals[m.machineType].count += 1;
  });

  // CSV Export Generator
  const handleExportCSV = () => {
    const headers = [
      'Machine ID',
      'Machine Name',
      'Category',
      'Location',
      'ESP32 Node',
      'Rated Power (kW)',
      'Current Power (kW)',
      'Total Energy (kWh)',
      'Tariff (INR/kWh)',
      'Total Cost (INR)',
      'Status',
      'Idle Minutes Today',
    ];

    const rows = machines.map(m => [
      m.id,
      `"${m.name}"`,
      `"${m.machineType}"`,
      `"${m.location}"`,
      m.esp32DeviceId,
      m.ratedPowerKw,
      m.currentPowerKw,
      m.totalEnergyKwh,
      settings.tariffPerKwh,
      (m.totalEnergyKwh * settings.tariffPerKwh).toFixed(2),
      m.status,
      m.idleMinutesToday,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EnergyGuard_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-400" />
            Industrial Energy Analytics & Auditing
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Historical consumption trends, Time-of-Day (ToD) tariff analysis, shift audits, and official report exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['hourly', 'daily', 'weekly', 'monthly'] as const).map(th => (
              <button
                key={th}
                onClick={() => setTimeHorizon(th)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize transition cursor-pointer ${
                  timeHorizon === th ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {th}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Generate PDF Audit Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar (Dynamically updates with timeHorizon) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition-all duration-300">
          <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">
            {horizonData.kpiLabel}
          </span>
          <div className="text-2xl font-mono font-bold text-white">
            {formatCompact(horizonData.totalKwh)} <span className="text-xs text-emerald-400">kWh</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Total utility bill: <strong className="text-white">{formatCurrencyINR(horizonData.totalCost)}</strong> @ ₹{settings.tariffPerKwh}/kWh
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition-all duration-300">
          <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">
            Recorded Peak Factory Demand
          </span>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {horizonData.peakKw} <span className="text-xs">kW</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {horizonData.peakLabel}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition-all duration-300">
          <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">
            Total Idle Waste Incurred
          </span>
          <div className="text-2xl font-mono font-bold text-rose-400">
            {horizonData.idleHours} <span className="text-xs">Hours</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Est. avoidable expenditure: <strong className="text-rose-300">{formatCurrencyINR(horizonData.idleCost)}</strong>
          </div>
        </div>
      </div>

      {/* Time-of-Day (ToD) Tariff Optimization Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Time-of-Day (ToD) Electricity Tariff Analysis
            </h3>
            <p className="text-xs text-slate-400">
              State utility tariff surcharges during peak evening hours (18:00 - 22:00) vs off-peak night discounts.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded bg-amber-950/40 border border-amber-600/30 text-amber-300 self-start sm:self-auto">
            Potential Load Shift Savings: <strong>₹4,250 / month</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {todSlabs.map(slab => (
            <div key={slab.name} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-200">{slab.name}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    slab.costMultiplier > 1.0
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-600/40'
                      : slab.costMultiplier < 1.0
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {slab.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-mono font-bold text-white">₹{slab.rate}</span>
                <span className="text-slate-500 font-mono">/ kWh</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span>Consumed: {slab.kwh} kWh</span>
                <span className="text-slate-200">Cost: ₹{Math.round(slab.kwh * slab.rate)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Bar Chart: Dynamically renders horizonData */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-sm lg:text-base">
              {horizonData.title}
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated meter recordings from all 5 manufacturing factory zones across {timeHorizon} intervals.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-3 w-3 bg-emerald-500 rounded" /> Energy (kWh)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-3 w-3 bg-amber-400 rounded" /> Peak (kW)
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-800">
          {horizonData.points.map(pt => {
            const heightPercent = Math.min(100, Math.max(12, (pt.kwh / horizonData.kwhScaleMax) * 100));
            const peakPercent = Math.min(100, Math.max(12, (pt.peakKw / 65) * 100));

            return (
              <div key={pt.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                  <div
                    className="w-1/2 max-w-[40px] bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t-sm transition-all duration-300 relative flex flex-col justify-end cursor-pointer"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                      {pt.kwh} kWh
                    </div>
                  </div>
                  <div
                    className="w-1/3 max-w-[24px] bg-amber-400/80 group-hover:bg-amber-300 rounded-t-sm transition-all duration-300 relative flex flex-col justify-end cursor-pointer"
                    style={{ height: `${peakPercent}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                      {pt.peakKw} kW Peak
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2 truncate max-w-full font-medium">
                  {pt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Shift Breakdown & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Energy & Waste Analysis */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm lg:text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              Production Shift Energy Audit
            </h3>
            <span className="text-xs font-mono text-slate-400">Today</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Highlights non-productive energy consumption during shift handovers and graveyard shifts.
          </p>

          <div className="space-y-4">
            {shiftData.map(s => (
              <div key={s.shift} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-200">{s.shift}</span>
                  <span className="font-mono text-emerald-400 font-semibold">{s.energyKwh} kWh</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${s.idlePercent > 30 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${s.idlePercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span className={s.idlePercent > 30 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    Idle Waste: {s.idlePercent}% of shift energy
                  </span>
                  <span>Cost: ₹{s.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Category Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm lg:text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Equipment Category Comparison
            </h3>
            <span className="text-xs font-mono text-slate-400">Total Consumption</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Aggregated load by machinery type for targeted capital retrofit interventions.
          </p>

          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([cat, data]) => {
              const percentage = totalEnergyTodayKwh > 0 ? (data.kwh / totalEnergyTodayKwh) * 100 : 0;
              return (
                <div key={cat} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200">{cat} ({data.count} units)</span>
                    <span className="font-mono text-white font-bold">{data.kwh.toFixed(1)} kWh ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Est. Cost</span>
                    <span className="text-emerald-400 font-bold">
                      {formatCurrencyINR(data.kwh * settings.tariffPerKwh)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PDF Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
