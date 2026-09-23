import React from 'react';
import { Card } from '../ui/Card';
import { TrafficOverviewMetrics } from '../../types/traffic';
import { Clock, TrendingUp, Zap, Hourglass, SlidersHorizontal } from 'lucide-react';

interface TrafficOverviewSectionProps {
  metrics: TrafficOverviewMetrics;
}

export const TrafficOverviewSection: React.FC<TrafficOverviewSectionProps> = ({ metrics }) => {
  const overviewItems = [
    {
      label: 'Peak Hour',
      value: metrics.peakHour,
      subtext: 'Morning commuters rush peak',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20 border-amber-500/30',
    },
    {
      label: 'Current Congestion Index',
      value: metrics.currentCongestion,
      subtext: 'Optimal vs capacity ratio',
      icon: TrendingUp,
      color: 'text-sky-400',
      bg: 'bg-sky-500/20 border-sky-500/30',
    },
    {
      label: 'Vehicles Per Minute',
      value: `${metrics.vehiclesPerMinute} VPM`,
      subtext: 'Real-time city throughput',
      icon: Zap,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20 border-emerald-500/30',
    },
    {
      label: 'Average Waiting Time',
      value: metrics.averageWaitingTime,
      subtext: '-14s vs standard timing',
      icon: Hourglass,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20 border-cyan-500/30',
    },
    {
      label: 'Signal Efficiency',
      value: metrics.signalEfficiency,
      subtext: 'AI Green Wave optimization',
      icon: SlidersHorizontal,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20 border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {overviewItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl ${item.bg} border shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-lg font-black text-white font-mono tracking-tight">
                {item.value}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.subtext}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

