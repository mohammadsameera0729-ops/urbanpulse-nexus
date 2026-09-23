import React from 'react';
import { Card } from '../ui/Card';
import { EmergencyVehicleTelemetry } from '../../types/aiDetection';
import { Siren, Navigation, CheckCircle2, Shield, Clock, Zap } from 'lucide-react';

interface EmergencyVehiclePanelProps {
  vehicles: EmergencyVehicleTelemetry[];
}

export const EmergencyVehiclePanel: React.FC<EmergencyVehiclePanelProps> = ({ vehicles }) => {
  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Emergency Vehicle Priority System
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-rose-950 text-rose-400 border border-rose-500/40">
                Green Corridor Lock
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live tracking for Ambulances, Fire Trucks, and Police Patrol units with pre-emptive signal override.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Priority Corridor Active
        </span>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-950 to-slate-950 border border-rose-500/30 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                  <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
                  {v.type}
                </span>
                <span className="text-[10px] font-mono text-slate-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {v.vehicleNumber}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  Priority Route:
                </p>
                <p className="text-xs text-slate-300 font-mono mt-0.5 leading-relaxed">
                  {v.priorityRoute}
                </p>
              </div>
            </div>

            {/* Corridor Status & ETA Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Green Corridor</span>
                <p className="font-bold text-emerald-400 text-xs mt-0.5 truncate">{v.greenCorridorStatus}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Estimated ETA</span>
                <p className="font-bold text-brand-400 text-xs mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-400" />
                  {v.eta}
                </p>
              </div>
            </div>

            {/* Signal Override Banner */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 font-mono">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Signal Override Command:
              </span>
              <p className="text-xs text-emerald-300 font-mono font-bold">
                {v.signalOverrideStatus}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
