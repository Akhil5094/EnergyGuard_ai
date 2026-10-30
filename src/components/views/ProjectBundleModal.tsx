import React, { useState } from 'react';
import {
  X,
  Download,
  Terminal,
  FolderArchive,
  Check,
  Copy,
  BookOpen,
  Cpu,
  Server,
  FileCode,
  Shield,
  Layers,
} from 'lucide-react';

import { exportProjectZip } from '../../utils/zipExporter';

interface ProjectBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectBundleModal: React.FC<ProjectBundleModalProps> = ({ isOpen, onClose }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      await exportProjectZip();
    } catch (e) {
      console.error('ZIP export failed', e);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const quickStartCommands = `# 1. Clone or extract the repository
cd energyguard-ai

# 2. Launch complete infrastructure with Docker Compose
docker compose up --build -d

# 3. Check health and running containers
docker compose ps
curl http://localhost:8000/api/health

# 4. Access the web dashboard at http://localhost:3000`;

  const devAccounts = `DEFAULT DEVELOPMENT ACCOUNTS (RBAC):
---------------------------------------------------------------
1. Factory Owner (Full Administrator):
   Email:    factory.owner@energyguard.ai
   Password: industrial2026

2. Energy Manager (Auditor & AI Recommendations):
   Email:    energy.manager@energyguard.ai
   Password: industrial2026

3. Shopfloor Supervisor (Live Alerts & Acknowledgment):
   Email:    supervisor@energyguard.ai
   Password: industrial2026

4. Machine Operator (Asset Monitoring):
   Email:    operator@energyguard.ai
   Password: industrial2026`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <FolderArchive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                EnergyGuard AI • Project Deliverables & Handover
              </h2>
              <p className="text-xs text-slate-400">
                Complete academic software deliverables, firmware, Docker setup, and credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quickstart Terminal Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-emerald-400" />
              One-Command Docker Deployment
            </span>
            <button
              onClick={() => copyToClipboard(quickStartCommands, 'docker')}
              className="flex items-center gap-1 text-slate-400 hover:text-white"
            >
              {copiedItem === 'docker' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedItem === 'docker' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800">
            {quickStartCommands}
          </pre>
        </div>

        {/* Default Development Accounts */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-blue-400" />
              Default RBAC Seed Accounts
            </span>
            <button
              onClick={() => copyToClipboard(devAccounts, 'accounts')}
              className="flex items-center gap-1 text-slate-400 hover:text-white"
            >
              {copiedItem === 'accounts' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedItem === 'accounts' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800">
            {devAccounts}
          </pre>
        </div>

        {/* Deliverable Files Grid */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-white text-sm">Included Source Deliverables in Project Workspace:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-300">firmware/esp32/EnergyGuard_ESP32.ino</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300">backend/app/main.py (FastAPI)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span className="text-slate-300">backend/app/ai/anomaly_detector.py</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <span className="text-slate-300">simulator/simulate_telemetry.py</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span className="text-slate-300">docs/PROJECT_REPORT.md</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-teal-400" />
                <span className="text-slate-300">docker-compose.yml</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Generating ZIP Archive...' : 'Download Full Project ZIP (.zip)'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
