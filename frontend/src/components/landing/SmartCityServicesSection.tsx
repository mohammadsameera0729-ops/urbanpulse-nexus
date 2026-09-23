import React from 'react';
import { motion } from 'framer-motion';
import { CITY_SERVICES } from '../../data/landingData';
import { 
  Truck, 
  Lightbulb, 
  Droplets, 
  Trash2, 
  ShieldAlert, 
  HeartPulse, 
  GraduationCap, 
  Leaf, 
  ArrowRight, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/Card';

const serviceIconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
  Lightbulb: <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
  Droplets: <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  Trash2: <Trash2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-red-600 dark:text-red-400" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
  Leaf: <Leaf className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
};

export const SmartCityServicesSection: React.FC = () => {
  return (
    <section id="solutions" className="py-24 relative overflow-hidden bg-slate-50/80 dark:bg-slate-950 border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Municipal Domain Coverage
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Integrated Smart City Public Services
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            One unified cloud command center managing eight vital urban utility sectors with automated sensors, workforce telemetry, and instant public reporting.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CITY_SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <Card className="h-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-brand-500/50 group-hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-2xl relative overflow-hidden">
                {/* Accent corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/15 transition-all pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Icon & Status */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/80 transition-all duration-300">
                      {serviceIconMap[service.iconName] || <Sparkles className="w-6 h-6 text-brand-600" />}
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      {service.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics Pill */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="block text-slate-400 text-[9px] uppercase font-sans font-semibold">Active Units</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{service.activeUnits.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="block text-slate-400 text-[9px] uppercase font-sans font-semibold">Coverage</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{service.coverage}</strong>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
