import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Call To Action Box */}
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 border border-brand-500/30 p-8 sm:p-14 md:p-16 shadow-2xl overflow-hidden text-center space-y-8">
          
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <Zap className="w-3.5 h-3.5 text-brand-400 fill-current" /> Next-Generation Smart City Operating System
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
          >
            Transform Your City with{' '}
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Join forward-thinking municipalities, urban planners, and millions of empowered citizens in modernizing infrastructure today.
          </motion.p>

          {/* Buttons: Request Demo & Get Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link to="/register">
              <Button
                size="lg"
                variant="primary"
                className="shadow-xl shadow-brand-500/30 px-9 py-4 text-base font-bold rounded-2xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started
              </Button>
            </Link>

            <Link to="/help">
              <Button
                size="lg"
                variant="outline"
                className="px-9 py-4 text-base font-bold text-white border-slate-700 bg-slate-900/60 hover:bg-slate-800 rounded-2xl backdrop-blur-md"
                leftIcon={<Activity className="w-5 h-5 text-brand-400" />}
              >
                Request Demo
              </Button>
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold"
          >
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <ShieldCheck className="w-4 h-4" /> Enterprise Security SLA
            </span>
            <span className="flex items-center gap-1.5 text-brand-300">
              <Sparkles className="w-4 h-4" /> Instant Sandbox Setup
            </span>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
