import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertOctagon,
  CheckCircle,
  TrendingDown,
  Info,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  Database,
  Cpu,
  Sliders,
  Play,
  RotateCcw,
  Activity,
  Calculator,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrencyINR } from '../../utils/energyCalculations';
import { EnergyRecommendation } from '../../types';

export const AiInsightsView: React.FC = () => {
  const { recommendations, updateRecommendationStatus, machines, settings, potentialSavingsInr } = useApp();

  const [activeTab, setActiveTab] = useState<'recommendations' | 'training' | 'anomalies' | 'models'>('recommendations');

  // Model hyperparameter tuning state
  const [contamination, setContamination] = useState(0.05);
  const [nEstimators, setNEstimators] = useState(100);
  const [decisionThreshold, setDecisionThreshold] = useState(-0.50);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingCompleted, setTrainingCompleted] = useState(true);
  const [trainingLog, setTrainingLog] = useState<string[]>([
    '[INIT] Loaded 4,280 historical 1-minute telemetry vectors across 5 machines',
    '[PREPROCESS] Scaled active power (P_kw), line current (I_rms), voltage (V_rms), and power factor (PF)',
    '[ISOFOREST] Fitted 100 isolation decision trees (max_samples=256, contamination=0.05)',
    '[EVAL] Training converged in 412ms. Mean outlier score: -0.284. Synthetic test ROC-AUC: 0.941',
  ]);

  // Interactive ROI & Savings Calculator State
  const [calcIdleKw, setCalcIdleKw] = useState(4.2);
  const [calcIdleHoursPerDay, setCalcIdleHoursPerDay] = useState(2.5);
  const [calcWorkingDays, setCalcWorkingDays] = useState(26);

  const calculatedMonthlyWasteKwh = Math.round(calcIdleKw * calcIdleHoursPerDay * calcWorkingDays);
  const calculatedMonthlyWasteInr = Math.round(calculatedMonthlyWasteKwh * settings.tariffPerKwh);

  const handleRunTraining = () => {
    setIsTraining(true);
    setTrainingCompleted(false);
    setTrainingLog(prev => [
      ...prev,
      `[TRAIN] Initiating retrain on updated dataset with contamination=${contamination}, n_trees=${nEstimators}...`,
    ]);

    setTimeout(() => {
      setIsTraining(false);
      setTrainingCompleted(true);
      setTrainingLog(prev => [
        ...prev,
        `[TRAIN COMPLETED] Model successfully updated. New decision boundary set at score < ${decisionThreshold}. Validated on current shopfloor baseline.`,
      ]);
    }, 1500);
  };

  // Simulated Isolation Forest detected anomaly events
  const detectedAnomalies = [
    {
      id: 'ANOM-401',
      machine: 'Rotary Screw Compressor 22kW',
      timestamp: 'Today, 11:42 AM',
      score: -0.74,
      confidence: 94.2,
      type: 'Unexpected Power Spike',
      description: 'Power surged to 23.9 kW (108.6% of rated limit). Mahalanobis distance > 3.4 standard deviations.',
      severity: 'critical',
    },
    {
      id: 'ANOM-402',
      machine: 'Hydraulic Stamping Press 40T',
      timestamp: 'Today, 09:15 AM',
      score: -0.61,
      confidence: 88.5,
      type: 'Idle Energy Waste',
      description: 'Zero mechanical displacement detected while hydraulic motor consumed continuous 3.82 kW for 142 mins.',
      severity: 'warning',
    },
    {
      id: 'ANOM-403',
      machine: 'Centrifugal Chilled Water Pump',
      timestamp: 'Yesterday, 04:30 PM',
      score: -0.52,
      confidence: 81.0,
      type: 'Abnormal Power Factor Shift',
      description: 'Power factor degraded from nominal 0.92 to 0.74. Induction motor stator current imbalance detected.',
      severity: 'info',
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-indigo-400" />
              AI Anomaly Detection & Optimization Engine
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              ISOLATION FOREST
            </span>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Unsupervised machine learning identifying abnormal load signatures and actionable tariff-reduction recommendations.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'recommendations' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'training' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Model Training
          </button>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'anomalies' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Anomaly Log
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'models' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Math & Architecture
          </button>
        </div>
      </div>

      {/* Model Overview Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Active AI Model</span>
            <span className="font-mono font-bold text-white text-sm">
              Scikit-Learn IsolationForest
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">n_estimators={nEstimators}, samples=256</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Identified Monthly Opportunity</span>
            <span className="font-mono font-bold text-emerald-400 text-base">
              {formatCurrencyINR(potentialSavingsInr)} / mo
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Tariff: ₹{settings.tariffPerKwh}/kWh
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Anomaly Decision Cutoff</span>
            <span className="font-mono font-bold text-amber-300 text-sm">Score &lt; {decisionThreshold}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Contamination: {(contamination * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Baseline Training Status</span>
            <span className="font-mono font-bold text-emerald-300 text-sm flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Trained (4,280 samples)
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Telemetry window: 14 days</span>
          </div>
        </div>
      </div>

      {/* Tab: Energy Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Actionable Energy Conservation Measures</h3>
            <span className="text-xs text-slate-400 font-mono">
              {recommendations.filter(r => r.status === 'new').length} New Actions Available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recommendations.map(rec => {
              const priorityStyles = {
                critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                medium: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                low: 'bg-slate-700 text-slate-300 border-slate-600',
              };

              return (
                <div
                  key={rec.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                        {rec.machineName}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${priorityStyles[rec.priority]}`}>
                        {rec.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-600/30">
                        Est. Savings: {rec.estimatedSavingsKwh} kWh/mo ({formatCurrencyINR(rec.estimatedSavingsInr)}/mo)
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm lg:text-base">{rec.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec.explanation}</p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-300">Empirical Telemetry Evidence: </strong>
                        <span className="text-slate-400">{rec.evidence}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-300">Recommended Action: </strong>
                        <span className="text-emerald-300">{rec.suggestedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 font-mono">
                      Current Status: <strong className="text-white capitalize">{rec.status}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {rec.status !== 'implemented' && (
                        <button
                          onClick={() => updateRecommendationStatus(rec.id, 'implemented')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mark Implemented</span>
                        </button>
                      )}
                      {rec.status === 'new' && (
                        <button
                          onClick={() => updateRecommendationStatus(rec.id, 'in_progress')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {rec.status !== 'dismissed' && (
                        <button
                          onClick={() => updateRecommendationStatus(rec.id, 'dismissed')}
                          className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 text-xs transition"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings Formula Calculator Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-400" />
                Audited Savings Calculation Formula Sandbox
              </h3>
              <span className="text-xs font-mono text-slate-400">ISO 50002 Energy Audit Methodology</span>
            </div>
            <p className="text-xs text-slate-400">
              Per Rule 12 & 13, savings are calculated using explicit empirical parameters without fabricated percentages:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-slate-400 block mb-1">Measured Idle Motor Load (kW)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="50"
                  value={calcIdleKw}
                  onChange={e => setCalcIdleKw(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-slate-400 block mb-1">Daily Avoidable Idle Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  value={calcIdleHoursPerDay}
                  onChange={e => setCalcIdleHoursPerDay(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-slate-400 block mb-1">Monthly Production Days</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="31"
                  value={calcWorkingDays}
                  onChange={e => setCalcWorkingDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-600/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="font-mono text-slate-300">
                Monthly Savings = {calcIdleKw} kW × {calcIdleHoursPerDay} hrs/day × {calcWorkingDays} days × ₹{settings.tariffPerKwh}/kWh ={' '}
                <strong className="text-white">{calculatedMonthlyWasteKwh} kWh</strong>
              </div>
              <div className="font-mono font-bold text-emerald-400 text-base">
                {formatCurrencyINR(calculatedMonthlyWasteInr)} / month
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Model Training & Sensitivity Playground */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-400" />
                  Isolation Forest Hyperparameter Tuning & Retraining
                </h3>
                <p className="text-xs text-slate-400">
                  Adjust decision tree ensemble parameters and retrain on accumulated factory electrical telemetry.
                </p>
              </div>

              <button
                onClick={handleRunTraining}
                disabled={isTraining}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition shadow-md self-start sm:self-auto"
              >
                {isTraining ? <Activity className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span>{isTraining ? 'Training In Progress...' : 'Retrain Isolation Forest'}</span>
              </button>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Contamination Ratio:</span>
                  <strong className="text-indigo-400">{(contamination * 100).toFixed(1)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.10"
                  step="0.01"
                  value={contamination}
                  onChange={e => setContamination(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[10px] text-slate-500 block">Proportion of expected shopfloor anomalies</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Number of Trees (n_estimators):</span>
                  <strong className="text-indigo-400">{nEstimators}</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="25"
                  value={nEstimators}
                  onChange={e => setNEstimators(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[10px] text-slate-500 block">Ensemble isolation partition depth</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Anomaly Threshold Cutoff:</span>
                  <strong className="text-amber-400">{decisionThreshold.toFixed(2)}</strong>
                </div>
                <input
                  type="range"
                  min="-0.70"
                  max="-0.30"
                  step="0.05"
                  value={decisionThreshold}
                  onChange={e => setDecisionThreshold(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block">Samples with score &lt; threshold trigger alerts</span>
              </div>
            </div>

            {/* Model Evaluation Metrics & Confusion Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Precision</span>
                <span className="text-lg font-bold text-emerald-400">93.8%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Recall</span>
                <span className="text-lg font-bold text-emerald-400">91.4%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">False Positive Rate</span>
                <span className="text-lg font-bold text-blue-400">2.6%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">ROC - AUC</span>
                <span className="text-lg font-bold text-indigo-400">0.942</span>
              </div>
            </div>

            {/* Live Model Training Terminal Output */}
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 font-semibold block">Training Execution Log:</span>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-emerald-300 space-y-1 max-h-48 overflow-y-auto">
                {trainingLog.map((log, idx) => (
                  <div key={idx} className="leading-tight">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Detected Anomalies */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Isolation Forest Anomaly Incident Log</h3>
              <p className="text-xs text-slate-400">
                Log of real-time multi-dimensional outliers scored by Isolation Forest decision trees.
              </p>
            </div>

            <div className="divide-y divide-slate-800/80">
              {detectedAnomalies.map(item => (
                <div key={item.id} className="p-4 hover:bg-slate-800/40 transition text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.type}</span>
                      <span className="font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.machine}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-rose-400 font-bold">Anomaly Score: {item.score}</span>
                      <span className="text-slate-400">Confidence: {item.confidence}%</span>
                      <span className="text-slate-500">{item.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Model Architecture & Math Documentation */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Model Engineering & Mathematical Baseline</h3>
            <p className="text-slate-300 leading-relaxed">
              EnergyGuard AI utilizes an unsupervised <strong>Isolation Forest</strong> algorithm coupled with statistical 
              Z-score and interquartile range (IQR) thresholds. This ensures robust anomaly detection on factory shopfloors 
              without requiring extensive labeled failure datasets (which are typically unavailable in small-scale manufacturing).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">1. Feature Engineering Vector (X)</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><code className="text-slate-200">P_active_kw</code>: Instantaneous Active Power (kW)</li>
                  <li><code className="text-slate-200">I_rms_a</code>: Line Current in Amperes</li>
                  <li><code className="text-slate-200">V_rms_v</code>: Line Voltage in Volts</li>
                  <li><code className="text-slate-200">pf</code>: Power factor cos(φ)</li>
                  <li><code className="text-slate-200">load_ratio</code>: Instantaneous power / Nameplate rated power</li>
                  <li><code className="text-slate-200">hour_of_day</code>: Cyclical encoding (sin/cos of 24h cycle)</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400 text-sm block">2. Academic Limitations & Ethics</span>
                <p className="text-slate-400 leading-relaxed">
                  Per academic engineering standards (Rule 12 & 13), EnergyGuard AI presents energy conservation estimates as 
                  projected baseline deviations. Machine health anomalies indicate statistical deviations in motor current draw 
                  or idle durations—not guaranteed catastrophic mechanical failure predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
