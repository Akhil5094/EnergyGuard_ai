import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  IndianRupee,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData, user } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [formData, setFormData] = useState({
    factoryName: settings.factoryName,
    location: settings.location,
    tariffPerKwh: settings.tariffPerKwh,
    idleDetectionThresholdKw: settings.idleDetectionThresholdKw,
    peakDemandThresholdKw: settings.peakDemandThresholdKw,
    telemetryIntervalSec: settings.telemetryIntervalSec,
    anomalySensitivity: settings.anomalySensitivity,
    mqttBrokerHost: settings.mqttBrokerHost,
    mqttPort: settings.mqttPort,
    mqttTopicPrefix: settings.mqttTopicPrefix,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const isOwner = user.role === 'owner';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      tariffPerKwh: Number(formData.tariffPerKwh),
      idleDetectionThresholdKw: Number(formData.idleDetectionThresholdKw),
      peakDemandThresholdKw: Number(formData.peakDemandThresholdKw),
      telemetryIntervalSec: Number(formData.telemetryIntervalSec),
      mqttPort: Number(formData.mqttPort),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" />
            System & Factory Configuration
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Configure state utility tariff slabs, peak kVA demand limits, MQTT broker parameters, and AI thresholds.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Factory Profile */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            Factory Profile & Utility Commercial Tariff
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Factory / Plant Name *</label>
              <input
                type="text"
                required
                disabled={!isOwner}
                value={formData.factoryName}
                onChange={e => setFormData({ ...formData, factoryName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Location / Industrial Area</label>
              <input
                type="text"
                disabled={!isOwner}
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Electricity Tariff (₹ INR / kWh) *
              </label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="50.0"
                required
                disabled={!isOwner}
                value={formData.tariffPerKwh}
                onChange={e => setFormData({ ...formData, tariffPerKwh: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Typical commercial LT-III/HT-I tariff in Telangana / Maharashtra: ₹8.50 - ₹11.50/kWh
              </span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Sanctioned Contract Peak Demand (kW) *
              </label>
              <input
                type="number"
                step="1"
                min="10"
                max="1000"
                required
                disabled={!isOwner}
                value={formData.peakDemandThresholdKw}
                onChange={e => setFormData({ ...formData, peakDemandThresholdKw: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Triggers warning banner if factory load reaches 85% of this contract capacity.
              </span>
            </div>
          </div>
        </div>

        {/* AI & Telemetry Thresholds */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            Telemetry Timing & AI Anomaly Thresholds
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Telemetry Sampling Interval (Seconds)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="60"
                required
                disabled={!isOwner}
                value={formData.telemetryIntervalSec}
                onChange={e => setFormData({ ...formData, telemetryIntervalSec: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Idle Power Trigger (kW)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                required
                disabled={!isOwner}
                value={formData.idleDetectionThresholdKw}
                onChange={e => setFormData({ ...formData, idleDetectionThresholdKw: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">AI Anomaly Sensitivity</label>
              <select
                disabled={!isOwner}
                value={formData.anomalySensitivity}
                onChange={e => setFormData({ ...formData, anomalySensitivity: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 disabled:opacity-50"
              >
                <option value="low">Low (Conservative, fewer alerts)</option>
                <option value="medium">Medium (Recommended)</option>
                <option value="high">High (Strict detection)</option>
              </select>
            </div>
          </div>
        </div>

        {/* MQTT Broker Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400" />
            MQTT Broker & Topic Routing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">MQTT Broker Host</label>
              <input
                type="text"
                disabled={!isOwner}
                value={formData.mqttBrokerHost}
                onChange={e => setFormData({ ...formData, mqttBrokerHost: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">MQTT Port</label>
              <input
                type="number"
                disabled={!isOwner}
                value={formData.mqttPort}
                onChange={e => setFormData({ ...formData, mqttPort: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Topic Root Prefix</label>
              <input
                type="text"
                disabled={!isOwner}
                value={formData.mqttTopicPrefix}
                onChange={e => setFormData({ ...formData, mqttTopicPrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          {isOwner && (
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Save className="h-4 w-4" />
              <span>Save & Apply Settings</span>
            </button>
          )}
        </div>
      </form>

      {/* Confirmation Modal for Resetting Settings */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset Configuration to Defaults?"
        message="This will revert all factory energy thresholds, electricity tariffs, and MQTT parameters to default factory baseline settings."
        confirmText="Reset to Defaults"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={resetToDefaultData}
        onClose={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
