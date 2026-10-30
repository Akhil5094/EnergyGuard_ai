/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabId } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { MachineManagementView } from './components/views/MachineManagementView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AiInsightsView } from './components/views/AiInsightsView';
import { AlertsView } from './components/views/AlertsView';
import { IoTDevicesView } from './components/views/IoTDevicesView';
import { FirmwareAndDocsView } from './components/views/FirmwareAndDocsView';
import { SettingsView } from './components/views/SettingsView';
import { PosterAndSdgView } from './components/views/PosterAndSdgView';
import { LandingPage } from './components/views/LandingPage';
import { LoginPage } from './components/views/LoginPage';
import { ProjectBundleModal } from './components/views/ProjectBundleModal';
import { LogIn, LogOut } from 'lucide-react';
import { useApp } from './context/AppContext';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, logout } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>('landing');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);

  // STRICT AUTHENTICATION GATE:
  // When visitors first land, they experience the rich public website.
  // Entering the live operational dashboard requires authentication or 1-click demo pass.
  if (!isAuthenticated) {
    if (viewMode === 'landing') {
      return (
        <>
          <LandingPage
            onEnterDashboard={() => setViewMode(isAuthenticated ? 'app' : 'login')}
            onOpenLogin={() => setViewMode('login')}
            onOpenBundleModal={() => setIsBundleModalOpen(true)}
          />
          <ProjectBundleModal
            isOpen={isBundleModalOpen}
            onClose={() => setIsBundleModalOpen(false)}
          />
        </>
      );
    }

    return (
      <LoginPage
        onLoginSuccess={() => setViewMode('app')}
        onNavigateToLanding={() => setViewMode('landing')}
      />
    );
  }

  // If authenticated user chose to inspect public website
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onEnterDashboard={() => setViewMode('app')}
          onOpenLogin={() => setViewMode('app')}
          onOpenBundleModal={() => setIsBundleModalOpen(true)}
        />
        <ProjectBundleModal
          isOpen={isBundleModalOpen}
          onClose={() => setIsBundleModalOpen(false)}
        />
      </>
    );
  }

  const handleSelectMachineFromDashboard = (machineId: string) => {
    setSelectedMachineId(machineId);
    setActiveTab('machines');
  };

  const handleLogout = () => {
    logout();
    setViewMode('landing');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Industrial Navbar */}
      <Navbar
        onOpenAlerts={() => setActiveTab('alerts')}
        onLogout={handleLogout}
        onOpenWebsite={() => setViewMode('landing')}
        activeTab={activeTab}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navy Sidebar Navigation */}
        <div className="hidden lg:flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenWebsite={() => setViewMode('landing')}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 lg:pb-8">
          {/* Mobile Tab Selector */}
          <div className="lg:hidden p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setViewMode('landing')}
              className="px-3 py-1.5 rounded-lg shrink-0 bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 font-bold"
            >
              🌐 Website
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'live' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'machines' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Machines
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'analytics' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'ai' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
            >
              AI Insights
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'alerts' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Alerts
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'devices' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              ESP32 Fleet
            </button>
            <button
              onClick={() => setActiveTab('firmware')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'firmware' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Firmware
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'settings' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'poster' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Poster / SDGs
            </button>
          </div>

          {/* Render Active View */}
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={tab => setActiveTab(tab)}
              onSelectMachine={handleSelectMachineFromDashboard}
            />
          )}

          {activeTab === 'live' && <LiveMonitoringView />}

          {activeTab === 'machines' && (
            <MachineManagementView
              initialSelectedMachineId={selectedMachineId}
              onClearSelectedMachine={() => setSelectedMachineId(null)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'ai' && <AiInsightsView />}

          {activeTab === 'alerts' && <AlertsView />}

          {activeTab === 'devices' && <IoTDevicesView />}

          {activeTab === 'firmware' && <FirmwareAndDocsView />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'poster' && <PosterAndSdgView />}
        </main>
      </div>

      {/* Floating Quick Action Bar */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs border border-slate-700 hover:border-rose-800 shadow-xl transition flex items-center gap-1.5 backdrop-blur-sm"
          title="Sign out of factory command center"
        >
          <LogOut className="h-3.5 w-3.5 text-rose-400" />
          <span>Sign Out</span>
        </button>

        <button
          onClick={() => setIsBundleModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs border border-emerald-500/50 shadow-xl transition flex items-center gap-1.5 backdrop-blur-sm font-semibold"
        >
          <span>📦 Deliverables & Quickstart</span>
        </button>

        <button
          onClick={() => setViewMode('landing')}
          className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 shadow-xl transition flex items-center gap-1.5 backdrop-blur-sm"
        >
          <span>Project Overview & Poster</span>
        </button>
      </div>

      {/* Project Deliverables Bundle Modal */}
      <ProjectBundleModal
        isOpen={isBundleModalOpen}
        onClose={() => setIsBundleModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
