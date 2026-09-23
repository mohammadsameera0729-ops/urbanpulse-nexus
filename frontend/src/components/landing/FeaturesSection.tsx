import React from 'react';
import { motion } from 'framer-motion';
import { FEATURE_CARDS } from '../../data/landingData';
import { 
  FileText, 
  Video, 
  Map, 
  TrendingUp, 
  BellRing, 
  Building2, 
  BarChart3, 
  Shield, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';
import { Card } from '../ui/Card';

// Map icon names to Lucide icons dynamically
const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
  Video: <Video className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
  Map: <Map className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
  BellRing: <BellRing className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
  Building2: <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
  Shield: <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
};

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 relative bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Platform Core Features
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Modern Enterprise Municipalities
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything your smart city needs to engage citizens, streamline municipal labor, automate traffic management, and guarantee SLA compliance.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <Card className="h-full p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 group-hover:border-brand-500/50 dark:group-hover:border-brand-500/50 group-hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden rounded-2xl">
                {/* Background ambient glow on hover */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Top Bar: Icon + Optional Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/80 transition-all duration-300">
                      {iconMap[feature.iconName] || <Sparkles className="w-6 h-6 text-brand-600" />}
                    </div>

                    {feature.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {feature.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1.5">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Footer link indicator */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Explore Module</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
