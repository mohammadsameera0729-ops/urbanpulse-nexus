import React from 'react';
import { Card } from '../ui/Card';
import { Camera, FileText, AlertTriangle, Siren, ChevronRight } from 'lucide-react';

interface TrafficQuickActionsProps {
  onViewAllCameras: () => void;
  onFilterCongestionAlerts: () => void;
  onOpenReports: () => void;
  onEmergencyResponse: () => void;
}

export const TrafficQuickActions: React.FC<TrafficQuickActionsProps> = ({
  onViewAllCameras,
  onFilterCongestionAlerts,
  onOpenReports,
  onEmergencyResponse,
}) => {
  const actions = [
    {
      title: 'View All Cameras',
      description: 'Monitor live city camera feeds.',
      icon: Camera,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20 hover:border-brand-500/50',
      onClick: onViewAllCameras,
    },
    {
      title: 'Congestion Alerts',
      description: 'View active congestion incidents.',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
      onClick: onFilterCongestionAlerts,
    },
    {
      title: 'Traffic Reports',
      description: 'Generate and export operational reports.',
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
      onClick: onOpenReports,
    },
    {
      title: 'Emergency Response',
      description: 'View active emergency incidents and dispatch status.',
      icon: Siren,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50',
      onClick: onEmergencyResponse,
    },
  ];

  return (
    <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          Operations Center
        </h3>
        <span className="text-xs text-slate-400 font-medium">Operational Control Hub</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={act.onClick}
              className={`p-4 rounded-2xl ${act.bg} border backdrop-blur-md text-left transition-all duration-200 group flex flex-col justify-between space-y-3 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl bg-slate-950/80 ${act.color} border border-slate-800`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {act.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

