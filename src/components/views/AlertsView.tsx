import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Search,
  Filter,
  Check,
  X,
  Clock,
  User,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Alert, AlertSeverity, AlertStatus } from '../../types';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, machines } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [resolvingAlert, setResolvingAlert] = useState<Alert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleOpenResolve = (alert: Alert) => {
    setResolvingAlert(alert);
    setResolutionNotes('');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvingAlert) {
      resolveAlert(resolvingAlert.id, resolutionNotes || 'Resolved during routine maintenance check.');
      setResolvingAlert(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-rose-400" />
            Alerts & Anomaly Resolution Center
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Real-time threshold violation alarms, power factor degradation flags, and AI anomaly notices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
            {alerts.filter(a => a.status === 'active').length} Active
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {alerts.filter(a => a.status === 'acknowledged').length} Acknowledged
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {alerts.filter(a => a.status === 'resolved').length} Resolved
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts by machine, title, or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No alerts matching your current filter criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const severityIcons = {
              critical: <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />,
              warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
              info: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
            };

            const severityBorder = {
              critical: 'border-l-4 border-l-rose-500 bg-slate-900/90',
              warning: 'border-l-4 border-l-amber-500 bg-slate-900/90',
              info: 'border-l-4 border-l-blue-500 bg-slate-900/90',
            };

            return (
              <div
                key={alert.id}
                className={`border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 ${severityBorder[alert.severity]}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{severityIcons[alert.severity]}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{alert.title}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                          {alert.machineName}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            alert.status === 'active'
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-600/40'
                              : alert.status === 'acknowledged'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-600/40'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.description}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {alert.status === 'active' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => handleOpenResolve(alert)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Values & Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80 gap-2">
                  <div className="flex items-center gap-4">
                    <span>
                      Triggered: <strong className="text-rose-300">{alert.triggeredValue}</strong>
                    </span>
                    <span>{alert.threshold}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    {alert.assignedUser && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <User className="h-3 w-3" />
                        {alert.assignedUser}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resolution Notes (if resolved) */}
                {alert.resolutionNotes && (
                  <div className="text-[11px] text-emerald-300/90 bg-emerald-950/30 border border-emerald-600/30 rounded p-2 flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Resolution Note: </strong>
                      {alert.resolutionNotes} (Resolved at{' '}
                      {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleTimeString() : 'N/A'})
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Notes Modal */}
      {resolvingAlert && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmResolve}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Resolve System Alert</h3>
              <button
                type="button"
                onClick={() => setResolvingAlert(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                <span className="font-bold text-white block">{resolvingAlert.title}</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  {resolvingAlert.machineName} • {resolvingAlert.triggeredValue}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Corrective Action / Resolution Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="e.g., Unloader solenoid valve cleaned and pneumatic leak repaired in Bay 2."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setResolvingAlert(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
