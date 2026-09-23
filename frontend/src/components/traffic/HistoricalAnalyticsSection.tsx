import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { TimeHorizon } from '../../types/trafficIntelligence';
import { MOCK_HISTORICAL_COMPARISONS, MOCK_VEHICLE_TYPE_DISTRIBUTION } from '../../data/trafficIntelligenceData';
import { Calendar, TrendingUp, TrendingDown, Clock, PieChart, Activity } from 'lucide-react';

export const HistoricalAnalyticsSection: React.FC = () => {
  const [horizon, setHorizon] = useState<TimeHorizon>('7days');

  const comparisonStats = Array.isArray(MOCK_HISTORICAL_COMPARISONS)
    ? MOCK_HISTORICAL_COMPARISONS
    : (MOCK_HISTORICAL_COMPARISONS as any)[horizon] || [];

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-6">
      
      {/* Header & Time Horizon Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-400" />
            Historical Telemetry & Multi-Horizon Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare city-wide vehicle throughput, corridor speeds, and congestion trends across time horizons.
          </p>
        </div>

        {/* Horizon Tabs */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          {(['today', 'yesterday', '7days', '30days', '12months'] as TimeHorizon[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setHorizon(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                horizon === tab
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === '7days' ? 'Last 7 Days' : tab === '30days' ? 'Last 30 Days' : tab === '12months' ? 'Last 12 Months' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonStats.map((stat: any) => {
          const isUp = stat.changePercentage >= 0;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>

              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-mono font-black text-white">
                  {stat.currentValue}
                </p>
                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    stat.isPositiveTrend
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isUp ? '+' : ''}{stat.changePercentage}%
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-mono">
                Previous period: <span className="text-slate-300 font-medium">{stat.previousValue}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Vehicle Type Distribution Breakdown */}
      <div className="pt-2 border-t border-slate-800/80 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-brand-400" />
          Vehicle Type Telemetry Distribution ({horizon.toUpperCase()})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_VEHICLE_TYPE_DISTRIBUTION.map((item) => (
            <div
              key={item.type}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.type}</span>
                <span
                  style={{ backgroundColor: `${item.color}20`, color: item.color, borderColor: `${item.color}40` }}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                >
                  {item.percentage}% Total
                </span>
              </div>

              <p className="text-lg font-mono font-bold text-white">
                {item.count.toLocaleString()} <span className="text-xs text-slate-500 font-normal">units</span>
              </p>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
