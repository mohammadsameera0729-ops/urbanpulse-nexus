import React from 'react';
import { Card } from '../ui/Card';
import { CameraHealthTelemetry } from '../../types/aiDetection';
import { Activity, ShieldCheck, Wifi, HardDrive, Thermometer, Zap, CheckCircle2 } from 'lucide-react';

interface CameraHealthTelemetrySectionProps {
  telemetry: CameraHealthTelemetry;
}

export const CameraHealthTelemetrySection: React.FC<CameraHealthTelemetrySectionProps> = ({ telemetry }) => {
  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Optical Camera & Sensor Health Telemetry
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                {telemetry.healthPercentage}% Network Health
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Diagnostic telemetry monitoring stream FPS, fiber latency, thermal temps, and power backup.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Node Health Optimal
        </span>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Network Health
          </span>
          <p className="text-2xl font-black text-emerald-400">{telemetry.healthPercentage}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Frame Rate
          </span>
          <p className="text-2xl font-black text-purple-400">{telemetry.fps} FPS</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-brand-400" />
            Stream Latency
          </span>
          <p className="text-2xl font-black text-brand-400">{telemetry.latency}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            NVMe Buffer
          </span>
          <p className="text-xs font-bold text-white mt-2 truncate">{telemetry.storageUsage}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            Thermal Status
          </span>
          <p className="text-xs font-bold text-amber-400 mt-2 truncate">{telemetry.temperature}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Grid Power
          </span>
          <p className="text-[10px] font-bold text-slate-300 mt-2 leading-tight">{telemetry.powerStatus}</p>
        </div>
      </div>
    </Card>
  );
};
