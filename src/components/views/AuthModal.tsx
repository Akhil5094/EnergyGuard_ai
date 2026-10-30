import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { setUserRole } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('factory.owner@energyguard.ai');
  const [password, setPassword] = useState('industrial2026');
  const [name, setName] = useState('Rajesh Sharma');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setUserRole(selectedRole);
    onSuccess();
    onClose();
  };

  const handleSelectDemoUser = (role: UserRole, demoEmail: string, demoName: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setName(demoName);
    setPassword('industrial2026');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Brand */}
        <div className="text-center mb-5">
          <div className="h-10 w-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {isRegister ? 'Register Factory User' : 'Sign In to EnergyGuard AI'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC) Authentication
          </p>
        </div>

        {/* Demo Fast-Login Pills */}
        <div className="mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2 font-mono">
            One-Click Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleSelectDemoUser('owner', 'factory.owner@energyguard.ai', 'Rajesh Sharma')}
              className={`p-1.5 rounded text-left border transition ${
                selectedRole === 'owner' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="font-bold block">Factory Owner</span>
              <span className="text-[10px] text-slate-400">Full Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemoUser('energy_manager', 'energy.manager@energyguard.ai', 'Sunita Verma')}
              className={`p-1.5 rounded text-left border transition ${
                selectedRole === 'energy_manager' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="font-bold block">Energy Manager</span>
              <span className="text-[10px] text-slate-400">Audits & AI</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemoUser('supervisor', 'supervisor@energyguard.ai', 'Anil Kumar')}
              className={`p-1.5 rounded text-left border transition ${
                selectedRole === 'supervisor' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="font-bold block">Supervisor</span>
              <span className="text-[10px] text-slate-400">Shift Alert Ops</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemoUser('operator', 'operator@energyguard.ai', 'Manoj Rao')}
              className={`p-1.5 rounded text-left border transition ${
                selectedRole === 'operator' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="font-bold block">Operator</span>
              <span className="text-[10px] text-slate-400">Machine View</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
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
            <label className="block text-slate-300 mb-1">Select Access Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
            >
              <option value="owner">Factory Owner (Full Plant Administration)</option>
              <option value="energy_manager">Energy Manager (Analytics & AI Audits)</option>
              <option value="supervisor">Supervisor (Monitoring & Alert Resolution)</option>
              <option value="operator">Operator (Machine View & Status)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md mt-2"
          >
            {isRegister ? 'Register & Continue' : 'Sign In with Selected Role'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] text-slate-400 hover:text-emerald-400 transition"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register new user'}
          </button>
        </div>
      </div>
    </div>
  );
};
