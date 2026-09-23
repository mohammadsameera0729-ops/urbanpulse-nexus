import React, { useState } from 'react';
import { TrafficIncident } from '../../types/traffic';
import { Card } from '../ui/Card';
import { AlertTriangle, ShieldAlert, Wrench, Siren, Construction, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface LiveIncidentFeedProps {
  incidents: TrafficIncident[];
  onSelectIncidentCamera?: (cameraId: string) => void;
}

export const LiveIncidentFeed: React.FC<LiveIncidentFeedProps> = ({
  incidents,
  onSelectIncidentCamera,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'Heavy Traffic':
        return AlertTriangle;
      case 'Vehicle Breakdown':
        return Wrench;
      case 'Signal Failure':
        return ShieldAlert;
      case 'Emergency Vehicle Detected':
        return Siren;
      case 'Road Closure':
        return Construction;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-950 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-sky-950 text-sky-400 border-sky-500/40';
      case 'Low':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Investigating':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Dispatch Sent':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredIncidents = incidents.filter((item) => {
    const matchesSev = filterSeverity === 'all' || item.severity === filterSeverity;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSev && matchesType;
  });

  return (
    <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col h-[520px]">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Live City Incident Stream
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Computer-vision & telemetry incident alerts across city corridors.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
          {filteredIncidents.length} Telemetry Events
        </span>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Severity filter pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {['all', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                filterSeverity === sev
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Type select filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Incident Types</option>
          <option value="Heavy Traffic">Heavy Traffic</option>
          <option value="Vehicle Breakdown">Vehicle Breakdown</option>
          <option value="Signal Failure">Signal Failure</option>
          <option value="Emergency Vehicle Detected">Emergency Vehicle</option>
          <option value="Road Closure">Road Closure</option>
        </select>
      </div>

      {/* Incident Scrolling List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No incidents match your selected filters.
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const Icon = getIncidentIcon(incident.type);
            return (
              <div
                key={incident.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                {/* Top Row: Type Icon, Location, Time, Severity */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900 text-brand-400 border border-slate-800">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                        {incident.type}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {incident.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {incident.time}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getSeverityBadgeClass(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </span>
                  </div>
                </div>

                {/* Details Description */}
                <p className="text-xs text-slate-300 pl-10 leading-relaxed">
                  {incident.details}
                </p>

                {/* Bottom Row: Status Badge & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 pl-10 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadgeClass(
                      incident.status
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {incident.status}
                  </span>

                  {incident.cameraId && onSelectIncidentCamera && (
                    <button
                      onClick={() => onSelectIncidentCamera(incident.cameraId!)}
                      className="text-[11px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      Inspect Camera <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
