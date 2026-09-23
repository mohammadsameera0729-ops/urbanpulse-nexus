import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cloud, Activity, Check, MapPin, Eye, Car, AlertTriangle, TrendingUp, Cpu, Server } from 'lucide-react';
import { Button } from '../ui/Button';
import { HERO_TRUST_BADGES } from '../../data/landingData';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative pt-32 lg:pt-40 pb-20 overflow-hidden">
      {/* Background Ambient Glowing Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/20 via-sky-500/15 to-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Version / Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-sky-50 dark:from-brand-950/80 dark:to-sky-950/60 border border-brand-200/80 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
              <span>Next-Gen Enterprise Smart City SaaS Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            >
              Building Smarter Cities with{' '}
              <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </motion.h1>

            {/* Sub Heading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              UrbanPulse Nexus helps citizens report civic issues while enabling governments to monitor city operations using AI-powered dashboards, intelligent traffic analysis, GIS maps, and real-time analytics.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  variant="primary"
                  className="shadow-lg shadow-brand-500/25 px-8 py-3.5 text-sm font-bold rounded-xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/admin/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3.5 text-sm font-bold border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  leftIcon={<Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                >
                  Explore Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 border-t border-slate-200/60 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>AI Powered</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Secure</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Real-Time</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Cloud Based</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Interactive Animated SaaS Dashboard Illustration */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Main Container Frame */}
              <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 dark:bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-4 text-white">
                
                {/* Header Mock Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-xs font-mono text-slate-400">urbanpulse-nexus-live.gov</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY
                  </div>
                </div>

                {/* Dashboard Grid 2x2 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* CARD 1: Traffic Analytics Card */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-brand-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                          <Car className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">Traffic Analytics</span>
                      </div>
                      <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">98.4% Flow</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Arterial Flow Rate</span>
                        <span className="font-semibold text-emerald-400">Optimal</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '84%' }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>1,420 Vehicles/hr</span>
                      <span className="text-emerald-400 font-medium">↑ 12% vs Avg</span>
                    </div>
                  </motion.div>

                  {/* CARD 2: Complaint Statistics Card */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-emerald-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">Civic SLA Resolution</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">SLA 98%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <p className="text-lg font-black text-white">15,420</p>
                        <p className="text-[9px] text-slate-400">Resolved</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <p className="text-lg font-black text-amber-400">142</p>
                        <p className="text-[9px] text-slate-400">In Progress</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* CARD 3: Smart City Map Card */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-sky-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">Smart City GIS Map</span>
                      </div>
                      <span className="text-[10px] text-sky-400">Zone Central</span>
                    </div>

                    {/* Visual Map Simulator Grid */}
                    <div className="h-24 rounded-xl bg-slate-900 relative overflow-hidden border border-slate-700/50 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                      
                      {/* Active Pins */}
                      <div className="absolute top-4 left-6 flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm animate-bounce">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Pothole Cleared
                      </div>

                      <div className="absolute bottom-3 right-5 flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        Signal Active
                      </div>
                    </div>
                  </motion.div>

                  {/* CARD 4: AI Monitoring Card */}
                  <motion.div
                    animate={{ y: [0, -9, 0] }}
                    transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.8 }}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-purple-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                          <Eye className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">AI Vision Feed</span>
                      </div>
                      <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Camera #09</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-purple-400" /> Auto-Detect Model
                        </span>
                        <span className="text-purple-400 font-mono">Conf: 99.2%</span>
                      </div>
                      <div className="p-1.5 rounded bg-purple-950/60 border border-purple-800/50 text-[10px] text-purple-200 flex justify-between">
                        <span>Incident: Debris Detected</span>
                        <span className="text-amber-400 font-bold">Auto Dispatched</span>
                      </div>
                    </div>
                  </motion.div>

                </div>

                {/* Footer status summary pill */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-brand-400" />
                    <span>Active IoT Sensors: <strong>1,280 Nodes</strong></span>
                  </div>
                  <span className="text-emerald-400 font-medium">System Health: 100%</span>
                </div>
              </div>

              {/* Floating Decorative Glow Pill */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  98%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">AI Accuracy Index</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Verified by 120+ Departments</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
