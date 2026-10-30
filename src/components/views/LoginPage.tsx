import React, { useState } from 'react';
import {
  Zap,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToLanding }) => {
  const { login, setUserRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('factory.owner@energyguard.ai');
  const [password, setPassword] = useState('industrial2026');
  const [name, setName] = useState('Rajesh Sharma');
  const [role, setRole] = useState<UserRole>('owner');
  const [factoryName, setFactoryName] = useState('Apex Precision Engineering Works');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMessage('Please enter your full name to complete registration.');
      return;
    }

    // Authenticate user into application context
    login(role, email, name || 'Industrial User');
    setUserRole(role);
    onLoginSuccess();
  };

  const handlePreFillDemo = (
    demoRole: UserRole,
    demoEmail: string,
    demoName: string
  ) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setName(demoName);
    setPassword('industrial2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Zap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            EnergyGuard <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            IoT Energy Monitoring & Optimization System for Manufacturing MSMEs
          </p>
        </div>

        {/* Main Card Container */}
        <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Tabs: Sign In / Register */}
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition ${
                mode === 'login'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition ${
                mode === 'register'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Register New Factory
            </button>
          </div>

          {/* Development Demo Credentials Fast-Select (Per Page 2 Spec) */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                Demo Credentials (One-Click Auto-Fill):
              </span>
              <span className="text-[10px] text-emerald-400">DEV MODE</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() =>
                  handlePreFillDemo(
                    'owner',
                    'factory.owner@energyguard.ai',
                    'Rajesh Sharma'
                  )
                }
                className={`p-2 rounded-lg text-left border transition ${
                  role === 'owner'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold block">Factory Owner</span>
                <span className="text-[10px] text-slate-400 font-mono">Full Admin Access</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePreFillDemo(
                    'energy_manager',
                    'energy.manager@energyguard.ai',
                    'Sunita Verma'
                  )
                }
                className={`p-2 rounded-lg text-left border transition ${
                  role === 'energy_manager'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold block">Energy Manager</span>
                <span className="text-[10px] text-slate-400 font-mono">Audits & AI Models</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePreFillDemo(
                    'supervisor',
                    'supervisor@energyguard.ai',
                    'Anil Kumar'
                  )
                }
                className={`p-2 rounded-lg text-left border transition ${
                  role === 'supervisor'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold block">Supervisor</span>
                <span className="text-[10px] text-slate-400 font-mono">Shift Alerts & Ops</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePreFillDemo(
                    'operator',
                    'operator@energyguard.ai',
                    'Manoj Rao'
                  )
                }
                className={`p-2 rounded-lg text-left border transition ${
                  role === 'operator'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold block">Operator</span>
                <span className="text-[10px] text-slate-400 font-mono">Telemetry Read-Only</span>
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Manufacturing Plant / Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={factoryName}
                      onChange={e => setFactoryName(e.target.value)}
                      placeholder="e.g. Apex Precision Engineering Works"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@factory.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold">
                  Password *
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-slate-500 hover:text-emerald-400 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Access Role & Permissions
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="owner">Factory Owner (Full Plant Administration & Tariff)</option>
                <option value="energy_manager">Energy Manager (Audits, Analytics & AI Models)</option>
                <option value="supervisor">Supervisor (Monitoring & Alert Resolution)</option>
                <option value="operator">Operator (Assigned Machine Status View)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 text-sm mt-3"
            >
              <span>{mode === 'login' ? 'Sign In to Command Center' : 'Create Factory Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Security and SDG Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>Protected by JWT Token Authentication & Encrypted MQTT Communication</p>
          <p className="font-mono text-[11px]">EnergyGuard AI • UN SDG 7 & SDG 9 Aligned</p>
        </div>
      </div>
    </div>
  );
};
