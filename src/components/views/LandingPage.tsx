import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Activity,
  BarChart3,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Radio,
  Sparkles,
  Layers,
  Globe2,
  Calculator,
  Clock,
  AlertTriangle,
  HelpCircle,
  Download,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  TrendingDown,
  Leaf,
  Server,
  Lock,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onOpenLogin: () => void;
  onOpenBundleModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenLogin,
  onOpenBundleModal,
}) => {
  const { login, totalEnergyTodayKwh, estimatedCostTodayInr, totalCurrentPowerDemandKw } = useApp();

  // Calculator State for MSME Factory Savings
  const [monthlyBill, setMonthlyBill] = useState<number>(180000); // ₹1.8 Lakhs
  const [machineCount, setMachineCount] = useState<number>(8);
  const [operatingHours, setOperatingHours] = useState<number>(16); // Double shift
  const [idlePercent, setIdlePercent] = useState<number>(22); // 22% typical idle
  const [tariffRate, setTariffRate] = useState<number>(8.5); // ₹8.5 per kWh

  // Interactive Architecture Tab
  const [activeArchTab, setActiveArchTab] = useState<'hardware' | 'mqtt' | 'ai' | 'dashboard'>('hardware');

  // Interactive Anomaly Tab
  const [activeAnomalyTab, setActiveAnomalyTab] = useState<'compressor' | 'press' | 'motor' | 'voltage'>('compressor');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculations for ROI
  const calculatedSavingsMonthly = Math.round(monthlyBill * (idlePercent / 100) * 0.78);
  const calculatedSavingsAnnual = calculatedSavingsMonthly * 12;
  const hardwareCost = machineCount * 1100; // ~₹1,100 per ESP32 + CT sensor node
  const paybackDays = Math.max(1, Math.round((hardwareCost / (calculatedSavingsMonthly / 30))));
  const co2AvoidedKg = Math.round((calculatedSavingsAnnual / tariffRate) * 0.82); // 0.82 kg CO2 / kWh grid factor

  const handleQuickDemoLaunch = () => {
    // Automatically log in as energy manager for immediate demo experience
    login('energy_manager', 'demo.manager@smartfactory.in', 'Demo Energy Manager');
    onEnterDashboard();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Industrial Web Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                EnergyGuard <span className="text-emerald-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 font-semibold">
                PUBLIC LIVE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              Intelligent IoT Energy Monitoring & Optimization System
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#overview" className="hover:text-emerald-400 transition">Overview</a>
          <a href="#calculator" className="hover:text-emerald-400 transition">MSME Calculator</a>
          <a href="#architecture" className="hover:text-emerald-400 transition">IoT Architecture</a>
          <a href="#anomalies" className="hover:text-emerald-400 transition">AI Engine</a>
          <a href="#sdg" className="hover:text-emerald-400 transition">SDG 7 & 9</a>
          <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition flex items-center gap-1.5"
            title="Sign in with specific factory role"
          >
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Role Sign In</span>
            <span className="sm:hidden">Sign In</span>
          </button>
          <button
            onClick={handleQuickDemoLaunch}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition group"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Live Console</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Website Content */}
      <main className="flex-1 space-y-20 lg:space-y-28">
        {/* HERO SECTION */}
        <section id="overview" className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-12 max-w-6xl mx-auto text-center space-y-6">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 font-mono shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold">Active System</span>
            <span className="text-slate-600">•</span>
            <span>ESP32 Hardware Nodes</span>
            <span className="text-slate-600">•</span>
            <span>Sub-Second Telemetry</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Stop Bleeding Money on <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Idle Industrial Machinery Energy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 sm:text-slate-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            A low-cost (~₹1,100 / $13 per machine) IoT hardware node and unsupervised AI telemetry platform 
            built specifically for small and medium manufacturing enterprises (MSMEs). 
            Detect hidden idle energy waste, isolate motor wear anomalies, and cut factory power bills by 15–25%.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={handleQuickDemoLaunch}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/80 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <Zap className="h-4 w-4" />
              <span>Launch Live Factory Console</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#calculator"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base flex items-center gap-2 transition"
            >
              <Calculator className="h-4 w-4 text-emerald-400" />
              <span>Calculate Factory Savings</span>
            </a>
          </div>

          {/* Live Telemetry Ticker Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-xl shadow-md">
              <span className="text-slate-400 text-xs block font-mono">Current Live Demand</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-white mt-1 block">
                {totalCurrentPowerDemandKw > 0 ? totalCurrentPowerDemandKw : '44.8'} kW
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">● Sub-second MQTT feed</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-xl shadow-md">
              <span className="text-slate-400 text-xs block font-mono">Energy Monitored Today</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1 block">
                {totalEnergyTodayKwh > 0 ? totalEnergyTodayKwh.toFixed(1) : '312.4'} kWh
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">₹{estimatedCostTodayInr.toLocaleString('en-IN')} estimated</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-xl shadow-md">
              <span className="text-slate-400 text-xs block font-mono">Hardware Node Cost</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-teal-300 mt-1 block">
                ~$13 / Node
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ESP32 + SCT-013 CT clamp</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-xl shadow-md">
              <span className="text-slate-400 text-xs block font-mono">UN SDG Alignment</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-1 block">
                SDG 7 & SDG 9
              </span>
              <span className="text-[10px] text-amber-400/80 block mt-0.5">Clean Energy & MSME Industry</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE MSME ROI & SAVINGS CALCULATOR */}
        <section id="calculator" className="px-4 sm:px-8 max-w-6xl mx-auto scroll-mt-20">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-semibold">
                <Calculator className="h-3.5 w-3.5" />
                <span>Interactive MSME Feasibility Tool</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Calculate Your Factory's Cost Savings & Payback
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Adjust the sliders below to match your manufacturing facility's bill and machine fleet.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-5 bg-slate-950/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80">
                {/* Slider 1: Monthly Bill */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">Monthly Electricity Bill:</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      ₹{monthlyBill.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="1000000"
                    step="10000"
                    value={monthlyBill}
                    onChange={e => setMonthlyBill(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>₹30,000</span>
                    <span>₹5,00,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                {/* Slider 2: Number of Heavy Machines */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">Monitored Heavy Machines:</span>
                    <span className="font-mono font-bold text-white text-base">
                      {machineCount} Machines
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={machineCount}
                    onChange={e => setMachineCount(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2 units</span>
                    <span>15 units</span>
                    <span>30 units</span>
                  </div>
                </div>

                {/* Slider 3: Daily Operating Hours */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">Daily Operating Hours:</span>
                    <span className="font-mono font-bold text-teal-300 text-base">
                      {operatingHours} Hours / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="4"
                    value={operatingHours}
                    onChange={e => setOperatingHours(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>8h (Single Shift)</span>
                    <span>16h (Double Shift)</span>
                    <span>24h (Continuous)</span>
                  </div>
                </div>

                {/* Slider 4: Idle Percentage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">Estimated Machine Idle Time:</span>
                    <span className="font-mono font-bold text-amber-400 text-base">
                      {idlePercent}% of Shift
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="1"
                    value={idlePercent}
                    onChange={e => setIdlePercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10% (Tightly scheduled)</span>
                    <span>25% (Typical MSME)</span>
                    <span>40% (Heavy idle)</span>
                  </div>
                </div>
              </div>

              {/* Live Output ROI Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-emerald-500/40 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                    Projected Monthly Savings
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 mt-1">
                    ₹{calculatedSavingsMonthly.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    ~₹{calculatedSavingsAnnual.toLocaleString('en-IN')} saved annually from idle shutdown
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Hardware Cost</span>
                    <span className="text-lg font-mono font-bold text-white">
                      ₹{hardwareCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">For {machineCount} nodes</span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Payback Period</span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {paybackDays} Days
                    </span>
                    <span className="text-[10px] text-emerald-400 block">Rapid ROI</span>
                  </div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-600/30 p-3.5 rounded-xl flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <strong className="text-emerald-300 block font-semibold">CO₂ Footprint Avoided</strong>
                    <span className="text-slate-300 font-mono">
                      {(co2AvoidedKg / 1000).toFixed(1)} Tonnes CO₂ / year
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleQuickDemoLaunch}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/60"
                >
                  <span>Test Savings in Live Console</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SYSTEM ARCHITECTURE (HARDWARE + IOT + AI) */}
        <section id="architecture" className="px-4 sm:px-8 max-w-6xl mx-auto space-y-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <Cpu className="h-3.5 w-3.5 text-teal-400" />
              <span>Full-Stack IoT Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Built on Non-Invasive, Industrial-Grade Components
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Zero line interruption, non-invasive split-core current sensing, sub-second MQTT telemetry.
            </p>
          </div>

          {/* Architecture Switcher */}
          <div className="flex justify-center border-b border-slate-800 overflow-x-auto gap-2 sm:gap-4 pb-2">
            {[
              { id: 'hardware', label: '1. Edge Hardware (ESP32)', icon: Cpu },
              { id: 'mqtt', label: '2. MQTT Gateway (Port 1883)', icon: Radio },
              { id: 'ai', label: '3. Isolation Forest ML', icon: BrainCircuit },
              { id: 'dashboard', label: '4. Web Console & Analytics', icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeArchTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveArchTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Architecture Detail Views */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8">
            {activeArchTab === 'hardware' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">ESP32-WROOM-32 MCU</h4>
                  <p className="text-slate-400 leading-relaxed">
                    240 MHz dual-core Tensilica processor with built-in 2.4 GHz 802.11 b/g/n Wi-Fi and 520 KB SRAM.
                    Runs FreeRTOS with non-blocking sample accumulation.
                  </p>
                  <div className="font-mono text-[10px] text-emerald-400 bg-slate-900 p-2 rounded border border-slate-800">
                    Cost: ~₹350 / $4.20
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">SCT-013-000 CT Clamp</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Split-core non-invasive current transformer rated 0–100A AC. Clips over the machine's live cable 
                    with zero power interruptions or electric hazards.
                  </p>
                  <div className="font-mono text-[10px] text-emerald-400 bg-slate-900 p-2 rounded border border-slate-800">
                    Cost: ~₹480 / $5.80
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">ADS1115 16-Bit ADC</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Precision 16-bit analog-to-digital converter over I2C (address 0x48) with programmable gain amplifier, 
                    eliminating the ESP32 internal ADC non-linearity.
                  </p>
                  <div className="font-mono text-[10px] text-emerald-400 bg-slate-900 p-2 rounded border border-slate-800">
                    Cost: ~₹270 / $3.25
                  </div>
                </div>
              </div>
            )}

            {activeArchTab === 'mqtt' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">MQTT Telemetry Pipeline</h4>
                    <p className="text-slate-400">Topic: <code className="text-emerald-400 font-mono">factory/telemetry/machine-id</code> • Port 1883 / 8884 (WSS)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] self-start sm:self-auto">
                    Publish Interval: 2.0s
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre>{`{
  "device_id": "esp32-node-001",
  "machine_id": "cnc-lathe-01",
  "timestamp": "2026-10-30T10:45:12.450Z",
  "voltage_v": 229.4,
  "current_a": 16.82,
  "power_factor": 0.88,
  "power_kw": 3.39,
  "energy_kwh": 48.21,
  "status": "running",
  "rssi_dbm": -58
}`}</pre>
                </div>
              </div>
            )}

            {activeArchTab === 'ai' && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-white text-sm">Unsupervised Isolation Forest Engine</h4>
                <p className="text-slate-300 leading-relaxed">
                  Unlike traditional SCADA threshold alarms that only trigger after equipment fails or trips a breaker, 
                  our Scikit-learn Isolation Forest model continuously scores multi-dimensional vectors (Voltage, Current, Power Factor, RMS Current Variance).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Zero Manual Tagging Needed</span>
                    <span className="text-slate-400">Learns normal shopfloor load curves automatically without human training sets.</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-1">Sub-Second Detection</span>
                    <span className="text-slate-400">Instant anomaly scoring with -1.0 (severe outlier) to +1.0 (nominal) output.</span>
                  </div>
                </div>
              </div>
            )}

            {activeArchTab === 'dashboard' && (
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-white text-sm">Industrial Operator Dashboard & Export</h4>
                <p className="text-slate-300 leading-relaxed">
                  Engineered with React 19, TypeScript, and high-frequency Canvas rendering. 
                  Allows shift supervisors, energy managers, and plant owners to inspect individual machine power draws, 
                  download certified audit CSV reports, and execute Time-of-Day (TOD) peak load shifting.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleQuickDemoLaunch}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Open Dashboard View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: UN SUSTAINABLE DEVELOPMENT GOALS (SDG 7 & 9) */}
        <section id="sdg" className="px-4 sm:px-8 max-w-6xl mx-auto space-y-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <Globe2 className="h-3.5 w-3.5 text-blue-400" />
              <span>United Nations 2030 Agenda</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Dedicated Alignment with UN SDG 7 & SDG 9
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Empowering resource-constrained manufacturing economies through affordable green technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SDG 7 Card */}
            <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-600/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-mono text-amber-400">SDG 7</span>
                <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-semibold">
                  Target 7.3
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Affordable and Clean Energy</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "By 2030, double the global rate of improvement in energy efficiency."
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Eliminates 15–25% of unmonitored machine idling in industrial workshops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Reduces carbon intensity per unit produced by shifting loads to off-peak tariff bands.</span>
                </li>
              </ul>
            </div>

            {/* SDG 9 Card */}
            <div className="bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-600/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-mono text-blue-400">SDG 9</span>
                <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-600/50 text-blue-300 text-xs font-semibold">
                  Target 9.4 & 9.b
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Industry, Innovation and Infrastructure</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "Upgrade infrastructure and retrofit industries to make them sustainable, with increased resource-use efficiency."
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Democratizes Industry 4.0 IoT instrumentation for MSMEs at &lt;5% the cost of commercial SCADA.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Supports domestic technology development and open hardware retrofitting in small manufacturing clusters.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="px-4 sm:px-8 max-w-4xl mx-auto space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Answers regarding deployment, hardware installation, and data security.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Does installing the IoT sensor require shutting down production or cutting wires?',
                a: 'No. The SCT-013 current sensor is a non-invasive split-core clamp that snaps directly over the insulated electrical feeder line. It requires zero electrical cutting, zero factory downtime, and zero contact with live copper.',
              },
              {
                q: 'How does EnergyGuard AI compare in cost to commercial SCADA or smart meters?',
                a: 'Commercial industrial smart meters and SCADA integration packages typically cost between ₹35,000 to ₹75,000 per machine point. EnergyGuard AI hardware nodes cost under ₹1,100 ($13) each to assemble using off-the-shelf ESP32 and SCT-013 components.',
              },
              {
                q: 'How does the machine learning detect anomalies without labeled training sets?',
                a: 'EnergyGuard AI utilizes Scikit-learn’s unsupervised Isolation Forest algorithm. It maps the multidimensional electrical load profile during initial operation and isolates unusual multi-factor outliers (sudden current spikes, mechanical bearing drag, or excessive unworked idle runtime).',
              },
              {
                q: 'What happens if the factory Wi-Fi drops temporarily?',
                a: 'The ESP32 firmware includes a local FreeRTOS circular ring buffer in SRAM. Telemetry samples are buffered locally and retransmitted to the MQTT broker as soon as the Wi-Fi connection recovers, guaranteeing zero data gaps.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: BOTTOM CONVERSION CTA BANNER */}
        <section className="px-4 sm:px-8 max-w-6xl mx-auto pb-12">
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white max-w-2xl mx-auto leading-tight">
              Ready to Experience the Live Industrial Factory Console?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
              Launch the interactive live console now to inspect real-time machine telemetry, 
              test anomaly injection scenarios, and review detailed machine fleet analytics.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleQuickDemoLaunch}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/80 flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Launch Live Factory Console</span>
              </button>
              <button
                onClick={onOpenLogin}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
              >
                Role-Based Sign In
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-8 text-center text-xs text-slate-500 space-y-3">
        <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-medium">
          <a href="#overview" className="hover:text-emerald-400">Overview</a>
          <a href="#calculator" className="hover:text-emerald-400">MSME Calculator</a>
          <a href="#architecture" className="hover:text-emerald-400">Architecture</a>
          <a href="#sdg" className="hover:text-emerald-400">SDG Alignment</a>
          <button onClick={onOpenLogin} className="hover:text-emerald-400">Console Sign In</button>
        </div>
        <p className="text-slate-500">
          EnergyGuard AI • IoT Energy Monitoring & Optimization System for Small-Scale Manufacturing Industries
        </p>
        <p className="text-[11px] text-slate-600">
          Academic Engineering Capstone • UN SDG 7 & SDG 9 Aligned • Apache 2.0 License
        </p>
      </footer>
    </div>
  );
};
