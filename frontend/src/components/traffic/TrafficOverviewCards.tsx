import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle2, AlertTriangle, Activity, Zap, Radio } from 'lucide-react';
import { Card } from '../ui/Card';

interface OverviewCardData {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  sparklineData: number[];
}

const sparklineDataTotal = [40, 55, 60, 75, 80, 95, 105];
const sparklineDataOnline = [88, 90, 92, 94, 96, 95, 98];
const sparklineDataOffline = [12, 10, 8, 9, 7, 8, 7];
const sparklineDataVehicles = [210, 230, 245, 260, 270, 280, 284.5];
const sparklineDataAlerts = [18, 15, 16, 14, 13, 11, 12];
const sparklineDataSpeed = [38, 39, 40, 41, 40, 43, 42];

const renderSparkline = (data: number[], color: string) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 28;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-24 h-7 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#grad-${color})`}
        points={`0,${height} ${points} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const TrafficOverviewCards: React.FC = () => {
  const cards: OverviewCardData[] = [
    {
      title: 'Total Cameras',
      value: '105',
      change: '+12 Network Nodes',
      isPositive: true,
      icon: Camera,
      gradient: 'from-slate-900 via-brand-950/80 to-slate-900 border-brand-500/30',
      iconBg: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
      sparklineData: sparklineDataTotal,
    },
    {
      title: 'Online Cameras',
      value: '98',
      change: '93.3% Uptime Rate',
      isPositive: true,
      icon: CheckCircle2,
      gradient: 'from-slate-900 via-emerald-950/70 to-slate-900 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      sparklineData: sparklineDataOnline,
    },
    {
      title: 'Offline Cameras',
      value: '7',
      change: '-2 vs Yesterday',
      isPositive: true,
      icon: Radio,
      gradient: 'from-slate-900 via-rose-950/70 to-slate-900 border-rose-500/30',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      sparklineData: sparklineDataOffline,
    },
    {
      title: 'Vehicles Today',
      value: '284,520',
      change: '+8.4% Flow Index',
      isPositive: true,
      icon: Activity,
      gradient: 'from-slate-900 via-sky-950/70 to-slate-900 border-sky-500/30',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      sparklineData: sparklineDataVehicles,
    },
    {
      title: 'Active Alerts',
      value: '12',
      change: '4 Critical Bottlenecks',
      isPositive: false,
      icon: AlertTriangle,
      gradient: 'from-slate-900 via-amber-950/70 to-slate-900 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      sparklineData: sparklineDataAlerts,
    },
    {
      title: 'Average Speed',
      value: '42 km/h',
      change: '+3 km/h Corridor Wave',
      isPositive: true,
      icon: Zap,
      gradient: 'from-slate-900 via-cyan-950/70 to-slate-900 border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      sparklineData: sparklineDataSpeed,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const sparklineColor = card.isPositive ? '#10b981' : '#f59e0b';
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card
              className={`p-4 bg-gradient-to-br ${card.gradient} border backdrop-blur-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-2xl group cursor-pointer relative overflow-hidden`}
            >
              {/* Subtle glass shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-2xl xl:text-2.5xl font-black text-white font-mono tracking-tight mt-1">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-inner shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Sparkline & Trend Badge */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono">
                  {card.change}
                </span>
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {renderSparkline(card.sparklineData, sparklineColor)}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
