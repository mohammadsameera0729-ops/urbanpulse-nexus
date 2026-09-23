import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { AIDetectionOverview } from '../../types/aiDetection';
import { Camera, Car, Users, Siren, ShieldAlert, Cpu } from 'lucide-react';

interface AIDetectionOverviewCardsProps {
  overview: AIDetectionOverview;
}

export const AIDetectionOverviewCards: React.FC<AIDetectionOverviewCardsProps> = ({ overview }) => {
  const cards = [
    {
      title: 'Active AI Cameras',
      value: `${overview.activeAICameras} Nodes`,
      change: '100% Edge Processing',
      isPositive: true,
      icon: Camera,
      gradient: 'from-slate-900 via-brand-950/70 to-slate-900 border-brand-500/30',
      iconBg: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
    },
    {
      title: 'Vehicles Detected Today',
      value: overview.vehiclesDetectedToday,
      change: '+8.4% vs Yesterday',
      isPositive: true,
      icon: Car,
      gradient: 'from-slate-900 via-sky-950/70 to-slate-900 border-sky-500/30',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    },
    {
      title: 'Pedestrians Detected',
      value: overview.pedestriansDetected,
      change: 'Safe Pedestrian Signals',
      isPositive: true,
      icon: Users,
      gradient: 'from-slate-900 via-purple-950/70 to-slate-900 border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    },
    {
      title: 'Emergency Vehicles',
      value: overview.emergencyVehicles,
      change: 'Green Wave Priority Active',
      isPositive: true,
      icon: Siren,
      gradient: 'from-slate-900 via-rose-950/70 to-slate-900 border-rose-500/30',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    },
    {
      title: 'Accidents Detected',
      value: overview.accidentsDetected,
      change: 'Auto-Dispatch En Route',
      isPositive: false,
      icon: ShieldAlert,
      gradient: 'from-slate-900 via-amber-950/70 to-slate-900 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      title: 'Average AI Confidence',
      value: overview.averageAIConfidence,
      change: 'YOLOv8 Engine Active',
      isPositive: true,
      icon: Cpu,
      gradient: 'from-slate-900 via-emerald-950/70 to-slate-900 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
          >
            <Card
              className={`p-4 bg-gradient-to-br ${card.gradient} border backdrop-blur-xl shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-2xl group cursor-pointer flex flex-col justify-between h-full`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-black text-white font-mono tracking-tight mt-1">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2 rounded-xl ${card.iconBg} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300 border border-slate-800 font-mono inline-block">
                  {card.change}
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
