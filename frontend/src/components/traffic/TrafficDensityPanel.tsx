import React from 'react';
import { Card } from '../ui/Card';
import { TrafficCamera } from '../../types/traffic';
import { Activity, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface TrafficDensityPanelProps {
  cameras: TrafficCamera[];
}

export const TrafficDensityPanel: React.FC<TrafficDensityPanelProps> = ({ cameras }) => {
  const lowCount = cameras.filter((c) => c.trafficLevel === 'low').length;
  const modCount = cameras.filter((c) => c.trafficLevel === 'moderate').length;
  const highCount = cameras.filter((c) => c.trafficLevel === 'high').length;
  const critCount = cameras.filter((c) => c.trafficLevel === 'critical').length;
  const total = cameras.length || 1;

  const lowPct = Math.round((lowCount / total) * 100);
  const modPct = Math.round((modCount / total) * 100);
  const highPct = Math.round((highCount / total) * 100);
  const critPct = Math.round((critCount / total) * 100);

  const densityTiers = [
    {
      title: 'Low Density Flow',
      level: 'low',
      count: lowCount,
      percentage: lowPct,
      color: 'emerald',
      bg: 'bg-emerald-500',
      badgeBg: 'bg-emerald-950 text-emerald-400 border-emerald-500/30',
      description: 'Optimal free-flow velocity (> 50 km/h)',
      icon: ShieldCheck,
    },
    {
      title: 'Moderate Density',
      level: 'moderate',
      count: modCount,
      percentage: modPct,
      color: 'sky',
      bg: 'bg-sky-500',
      badgeBg: 'bg-sky-950 text-sky-400 border-sky-500/30',
      description: 'Steady volume (35 - 50 km/h)',
      icon: Activity,
    },
    {
      title: 'High Density Load',
      level: 'high',
      count: highCount,
      percentage: highPct,
      color: 'amber',
      bg: 'bg-amber-500',
      badgeBg: 'bg-amber-950 text-amber-400 border-amber-500/30',
      description: 'Heavy queue buildup (20 - 35 km/h)',
      icon: AlertTriangle,
    },
    {
      title: 'Critical Congestion',
      level: 'critical',
      count: critCount,
      percentage: critPct,
      color: 'rose',
      bg: 'bg-rose-500',
      badgeBg: 'bg-rose-950 text-rose-400 border-rose-500/30',
      description: 'Gridlock / Bottleneck (< 20 km/h)',
      icon: Flame,
    },
  ];

  return (
    <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              City Density Distribution Panel
            </h3>
            <p className="text-xs text-slate-400">
              Live AI camera telemetry density classification across all sectors.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          100% City Coverage
        </span>
      </div>

      {/* Density Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {densityTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.level}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg uppercase border ${tier.badgeBg}`}
                >
                  {tier.level}
                </span>
                <Icon className={`w-4 h-4 text-${tier.color}-400`} />
              </div>

              <div>
                <p className="text-xs font-bold text-white">{tier.title}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-mono font-black text-white">
                    {tier.count}{' '}
                    <span className="text-xs text-slate-400 font-normal">nodes</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {tier.percentage}%
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${tier.percentage}%` }}
                  className={`h-full rounded-full ${tier.bg} transition-all duration-500`}
                />
              </div>

              <p className="text-[10px] text-slate-400 font-medium">{tier.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
