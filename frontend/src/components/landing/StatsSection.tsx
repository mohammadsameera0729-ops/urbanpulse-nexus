import React from 'react';
import { motion } from 'framer-motion';
import { STATS_COUNTERS } from '../../data/landingData';
import { Users, CheckCircle2, Target, Building, Camera, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

const statIconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-7 h-7 text-brand-600 dark:text-brand-400" />,
  CheckCircle2: <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
  Target: <Target className="w-7 h-7 text-sky-600 dark:text-sky-400" />,
  Building: <Building className="w-7 h-7 text-amber-600 dark:text-amber-400" />,
  Camera: <Camera className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
};

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-brand-950 via-slate-900 to-slate-950 text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Proven Impact At Scale
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Transforming Municipalities by the Numbers
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            Real-time operational metrics across active smart city deployments worldwide.
          </p>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STATS_COUNTERS.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Card className="h-full p-6 bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 shadow-2xl transition-all duration-300 flex flex-col justify-between rounded-2xl text-center relative overflow-hidden backdrop-blur-md">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-inner">
                    {statIconMap[stat.iconName]}
                  </div>

                  {/* Value Counter */}
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent tracking-tight font-mono"
                    >
                      {stat.displayValue}
                    </motion.p>
                    <h3 className="text-sm font-bold text-slate-200 mt-1 uppercase tracking-wider">
                      {stat.label}
                    </h3>
                  </div>

                  {/* Subtext */}
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    {stat.subtext}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
