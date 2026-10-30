import React from 'react';
import {
  Globe2,
  Zap,
  TrendingDown,
  Cpu,
  Layers,
  CheckCircle,
  HelpCircle,
  Heart,
  Smile,
  Shield,
  Lightbulb,
} from 'lucide-react';

export const PosterAndSdgView: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-2xl p-6 lg:p-8 shadow-xl text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold tracking-wide uppercase">
          Academic Engineering Poster Presentation Reference
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
          EnergyGuard AI
        </h1>
        <p className="text-sm lg:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          IoT-Enabled Intelligent Energy Monitoring and Optimization System for Small-Scale Manufacturing Industries
        </p>
      </div>

      {/* Empathy Map Section (Directly from Poster Specification) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white">
              Empathy Map: The Small Factory Owner's Reality
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">User-Centric Design Foundation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* SAYS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider block">
              1. What they SAY
            </span>
            <blockquote className="italic text-slate-200 text-sm font-medium border-l-2 border-emerald-500 pl-3 py-1">
              "Why is my electricity bill so unexpectedly high every month?"
            </blockquote>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Factory owners receive end-of-month aggregate utility bills with zero visibility into which specific machine caused peak penalty charges.
            </p>
          </div>

          {/* THINKS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-blue-400 text-xs uppercase tracking-wider block">
              2. What they THINK
            </span>
            <blockquote className="italic text-slate-200 text-sm font-medium border-l-2 border-blue-500 pl-3 py-1">
              "I am bleeding money and wasting power on idle machines."
            </blockquote>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Suspicion that compressors and presses run continuously through worker lunch breaks and idle shift changes without producing value.
            </p>
          </div>

          {/* DOES */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 text-xs uppercase tracking-wider block">
              3. What they DO
            </span>
            <blockquote className="italic text-slate-200 text-sm font-medium border-l-2 border-amber-500 pl-3 py-1">
              "Checks machines only after catastrophic breakdown occurs."
            </blockquote>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Reactive maintenance model. Relying on monthly paper electricity bills rather than proactive sub-metered monitoring.
            </p>
          </div>

          {/* FEELS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-rose-400 text-xs uppercase tracking-wider block">
              4. What they FEEL
            </span>
            <blockquote className="italic text-slate-200 text-sm font-medium border-l-2 border-rose-500 pl-3 py-1">
              "Frustrated, helpless, and vulnerable to tariff hikes."
            </blockquote>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Large industrial SCADA systems cost ₹10-25 Lakhs ($15,000+), rendering commercial energy monitoring out of reach for micro-enterprises.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainable Development Goals (SDG) Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SDG 7 */}
        <div className="bg-amber-950/20 border border-amber-600/40 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-lg">
              7
            </div>
            <div>
              <h3 className="font-bold text-white text-base">UN SDG 7: Affordable & Clean Energy</h3>
              <p className="text-xs text-amber-400/80">Target 7.3: Double the global rate of improvement in energy efficiency</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            By identifying idle power dissipation, air compressor pneumatic leaks, and sub-optimal motor loading, 
            EnergyGuard AI enables small factories to eliminate avoidable waste, decreasing carbon intensity per unit 
            manufactured without expensive machinery overhauls.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <CheckCircle className="h-4 w-4 text-amber-400" />
            <span>Reduces unproductive grid consumption by 12% - 20%</span>
          </div>
        </div>

        {/* SDG 9 */}
        <div className="bg-blue-950/20 border border-blue-600/40 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-black text-lg">
              9
            </div>
            <div>
              <h3 className="font-bold text-white text-base">UN SDG 9: Industry, Innovation & Infrastructure</h3>
              <p className="text-xs text-blue-400/80">Target 9.4: Upgrade infrastructure and retrofit industries with clean technologies</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Replaces legacy non-monitored equipment with low-cost open-source IoT edge sensors ($10 ESP32 + SCT-013 vs $500 industrial meters). 
            Democratizes Industry 4.0 predictive intelligence for Tier-2 and Tier-3 manufacturing MSMEs.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-300">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            <span>Affordable retrofit for legacy equipment</span>
          </div>
        </div>
      </div>

      {/* Proposed Low-Cost Solution Topology */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Cpu className="h-5 w-5 text-emerald-400" />
          End-to-End System Hardware & Software Flow
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-emerald-400 font-bold block text-sm">1. SENSORS</span>
            <span className="font-bold text-white block">SCT-013 + ZMPT101B</span>
            <p className="text-slate-400 text-[11px]">Non-invasive clamp-on current & isolated voltage</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-emerald-400 font-bold block text-sm">2. EDGE NODE</span>
            <span className="font-bold text-white block">ESP32 2.4GHz</span>
            <p className="text-slate-400 text-[11px]">RMS calculation, calibration & MQTT JSON packing</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-emerald-400 font-bold block text-sm">3. BROKER</span>
            <span className="font-bold text-white block">Mosquitto MQTT</span>
            <p className="text-slate-400 text-[11px]">Low-overhead pub/sub with QoS 1 guarantees</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-indigo-400 font-bold block text-sm">4. AI BACKEND</span>
            <span className="font-bold text-white block">FastAPI + Scikit-Learn</span>
            <p className="text-slate-400 text-[11px]">Isolation Forest anomaly scoring & DB persistence</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-blue-400 font-bold block text-sm">5. DASHBOARD</span>
            <span className="font-bold text-white block">React + Tailwind</span>
            <p className="text-slate-400 text-[11px]">Live WebSocket telemetry, alerts & ROI audits</p>
          </div>
        </div>
      </div>
    </div>
  );
};
