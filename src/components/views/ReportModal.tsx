import React from 'react';
import {
  X,
  Printer,
  Download,
  Zap,
  CheckCircle2,
  Calendar,
  Building,
  Shield,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR, formatCompact } from '../../utils/energyCalculations';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const {
    machines,
    settings,
    totalEnergyTodayKwh,
    estimatedCostTodayInr,
    totalCurrentPowerDemandKw,
    alerts,
    recommendations,
    user,
    potentialSavingsInr,
  } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-100 print:text-black print:bg-white print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full">
        {/* Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              AUDIT REPORT GENERATOR
            </span>
            <span className="text-xs text-slate-400">
              ISO 50001 Energy Management Standard Compliant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead & Report Body */}
        <div className="space-y-6 print:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-emerald-500/40 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Zap className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                  EnergyGuard AI • Industrial Energy Audit Summary
                </h1>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                Facility: <strong>{settings.factoryName}</strong> ({settings.location})
              </p>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 print:text-slate-600">
              <div>Report Date: <strong className="text-slate-200 print:text-black">{currentDate}</strong></div>
              <div>Auditor: <strong className="text-slate-200 print:text-black">{user.name} ({user.role})</strong></div>
              <div>Mode: <strong className="text-emerald-400 uppercase">{settings.operatingMode}</strong></div>
            </div>
          </div>

          {/* Executive Overview KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Daily Consumption</span>
              <span className="text-xl font-mono font-bold text-white print:text-black">
                {formatCompact(totalEnergyTodayKwh)} kWh
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Estimated Utility Cost</span>
              <span className="text-xl font-mono font-bold text-emerald-400 print:text-emerald-700">
                {formatCurrencyINR(estimatedCostTodayInr)}
              </span>
              <span className="text-[10px] text-slate-500 block">@ ₹{settings.tariffPerKwh}/kWh</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Instant Power Demand</span>
              <span className="text-xl font-mono font-bold text-amber-400 print:text-amber-700">
                {totalCurrentPowerDemandKw} kW
              </span>
              <span className="text-[10px] text-slate-500 block">Limit: {settings.peakDemandThresholdKw} kW</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block">Identified Monthly Savings</span>
              <span className="text-xl font-mono font-bold text-indigo-400 print:text-indigo-700">
                {formatCurrencyINR(potentialSavingsInr)}
              </span>
              <span className="text-[10px] text-slate-500 block">AI Optimization</span>
            </div>
          </div>

          {/* Machine-Level Energy Breakdown Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white print:text-black flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-400" />
              Machine Asset Energy & Idle Breakdown
            </h3>
            <table className="w-full text-left border-collapse text-xs print:text-black">
              <thead>
                <tr className="bg-slate-950 print:bg-slate-200 border-b border-slate-800 print:border-slate-400 text-slate-400 print:text-slate-700 font-mono text-[10px] uppercase">
                  <th className="p-2">Machine Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Rated (kW)</th>
                  <th className="p-2">Current (kW)</th>
                  <th className="p-2">Energy (kWh)</th>
                  <th className="p-2">Cost (INR)</th>
                  <th className="p-2">Idle Time</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300 font-mono">
                {machines.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/20">
                    <td className="p-2 font-sans font-bold text-slate-200 print:text-black">{m.name}</td>
                    <td className="p-2 font-sans text-slate-400 print:text-slate-600">{m.machineType}</td>
                    <td className="p-2">{m.ratedPowerKw} kW</td>
                    <td className="p-2 font-bold text-white print:text-black">{m.currentPowerKw.toFixed(2)} kW</td>
                    <td className="p-2">{m.totalEnergyKwh.toFixed(1)} kWh</td>
                    <td className="p-2 text-emerald-400 print:text-emerald-700 font-bold">
                      {formatCurrencyINR(m.totalEnergyKwh * settings.tariffPerKwh)}
                    </td>
                    <td className="p-2 text-amber-400 print:text-amber-700">{m.idleMinutesToday} mins</td>
                    <td className="p-2 uppercase font-bold text-[10px]">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Energy Optimization Action Roadmap */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white print:text-black flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Prioritized Energy Conservation Measures (ECMs)
            </h3>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <div
                  key={rec.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 print:text-black">
                      {idx + 1}. {rec.title} ({rec.machineName})
                    </span>
                    <span className="font-mono text-emerald-400 print:text-emerald-700 font-bold">
                      +{rec.estimatedSavingsKwh} kWh/mo ({formatCurrencyINR(rec.estimatedSavingsInr)}/mo)
                    </span>
                  </div>
                  <p className="text-slate-400 print:text-slate-600 text-[11px] leading-relaxed">
                    <strong>Observation:</strong> {rec.explanation}
                  </p>
                  <p className="text-slate-300 print:text-slate-800 text-[11px]">
                    <strong>Action:</strong> {rec.suggestedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Auditor Sign-off (Academic Engineering Standard) */}
          <div className="pt-8 border-t border-slate-800 print:border-slate-400 grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <div className="border-b border-slate-700 print:border-slate-400 pb-12 mb-2" />
              <span className="block font-bold text-slate-300 print:text-black">Energy Auditor / Project Lead</span>
              <span className="text-[10px] text-slate-500">Certified Energy Auditor (BEE / Academic Evaluator)</span>
            </div>
            <div>
              <div className="border-b border-slate-700 print:border-slate-400 pb-12 mb-2" />
              <span className="block font-bold text-slate-300 print:text-black">Factory Owner / Works Manager</span>
              <span className="text-[10px] text-slate-500">{settings.factoryName} Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
