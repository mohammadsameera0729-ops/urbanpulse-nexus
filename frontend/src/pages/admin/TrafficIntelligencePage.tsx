import React from 'react';
import { TrafficCongestionDetectionModule } from '../../components/traffic/TrafficCongestionDetectionModule';
import { Activity } from 'lucide-react';

export const TrafficIntelligencePage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Traffic Intelligence Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Vijayawada municipal traffic congestion detection observation intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            12 Monitored Corridors Active
          </span>
        </div>
      </div>

      {/* Module 01: Traffic / Congestion Detection */}
      <TrafficCongestionDetectionModule />

    </div>
  );
};

export default TrafficIntelligencePage;
