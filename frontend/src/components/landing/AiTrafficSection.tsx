import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAFFIC_METRICS } from '../../data/landingData';
import { 
  Video, 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  Clock,
  Radio
} from 'lucide-react';
import { Card } from '../ui/Card';

const cameraFeeds = [
  { id: 'cam-1', name: 'Downtown Central Corridor', status: 'Optimal', fps: 60, detectedVehicles: 48 },
  { id: 'cam-2', name: 'Highway 101 Interchange', status: 'Moderate', fps: 59, detectedVehicles: 112 },
  { id: 'cam-3', name: 'Hospital Emergency Route', status: 'Priority Clearance', fps: 60, detectedVehicles: 18 },
];

export const AiTrafficSection: React.FC = () => {
  const [activeCam, setActiveCam] = useState(cameraFeeds[0]);

  return (
    <section id="ai-traffic" className="py-24 relative overflow-hidden bg-slate-900 text-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" /> Edge AI Computer Vision Engine
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Real-Time AI Traffic Monitoring & Predictions
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Our neural network algorithms process live CCTV video streams at 60 FPS, automatically detecting vehicle density, predicting gridlocks, and clearing routes for emergency services.
          </p>
        </div>

        {/* Grid Layout: Left Illustration / Visual Feed, Right Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Live Computer Vision Stream Simulator */}
          <div className="lg:col-span-6 space-y-4">
            {/* Feed Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {cameraFeeds.map((feed) => (
                <button
                  key={feed.id}
                  onClick={() => setActiveCam(feed)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    activeCam.id === feed.id
                      ? 'bg-brand-600 text-white border-brand-500 shadow-lg shadow-brand-500/25'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeCam.id === feed.id ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  {feed.name}
                </button>
              ))}
            </div>

            {/* Simulated Live Camera Box */}
            <Card className="p-0 overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl rounded-3xl relative">
              {/* Top Stream Control Bar */}
              <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Video className="w-4 h-4 text-brand-400" />
                  <span>{activeCam.name.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE | {activeCam.fps} FPS
                  </span>
                  <span className="text-slate-400 hidden sm:inline">LATENCY: 14ms</span>
                </div>
              </div>

              {/* Video Grid Canvas Frame */}
              <div className="relative h-72 sm:h-80 bg-slate-950 flex flex-col justify-between p-4 overflow-hidden">
                {/* Visual Grid Lines Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

                {/* Animated AI Scanning Line */}
                <motion.div
                  animate={{ y: [0, 280, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-[0_0_15px_#38bdf8] z-20 pointer-events-none"
                />

                {/* Simulated Bounding Boxes (Object Detection) */}
                <div className="relative z-10 flex-1">
                  {/* Vehicle 1 Bounding Box */}
                  <motion.div
                    animate={{ x: [10, 140, 10], y: [20, 30, 20] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    className="absolute top-8 left-6 p-2 rounded-lg border-2 border-emerald-400/80 bg-emerald-950/30 text-emerald-300 text-[10px] font-mono backdrop-blur-xs space-y-0.5 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">SEDAN #942</span>
                      <span className="text-[9px] bg-emerald-500/20 px-1 rounded">99.8%</span>
                    </div>
                    <p className="text-slate-300 text-[9px]">Speed: 48 km/h</p>
                  </motion.div>

                  {/* Vehicle 2 (Transit Bus) Bounding Box */}
                  <motion.div
                    animate={{ x: [180, 40, 180], y: [100, 120, 100] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    className="absolute top-28 right-8 p-2 rounded-lg border-2 border-brand-400/80 bg-brand-950/40 text-brand-300 text-[10px] font-mono backdrop-blur-xs space-y-0.5 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">CITY BUS #04</span>
                      <span className="text-[9px] bg-brand-500/20 px-1 rounded">99.4%</span>
                    </div>
                    <p className="text-slate-300 text-[9px]">Lane: Express Transit</p>
                  </motion.div>

                  {/* Emergency Vehicle Priority Flag */}
                  <motion.div
                    animate={{ scale: [0.98, 1.03, 0.98] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-6 left-12 p-2.5 rounded-xl border border-rose-500/60 bg-rose-950/80 text-rose-200 text-[11px] font-mono backdrop-blur-md flex items-center gap-2 shadow-xl z-30"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                    <div>
                      <p className="font-bold text-white">AMBULANCE #12 IN ROUTE</p>
                      <p className="text-[9px] text-rose-300">Green Wave Signal Override Active</p>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Canvas Stats Strip */}
                <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-brand-400" />
                    <span>OBJECTS DETECTED: <strong className="text-white">{activeCam.detectedVehicles}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>FLOW RATE: 98%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Live Camera Specs Card */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400">Detection Model</p>
                <p className="text-sm font-bold text-white mt-0.5">YOLOv8-Urban</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Night Vision</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">IR Enhanced</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Signal Override</p>
                <p className="text-sm font-bold text-sky-400 mt-0.5">Auto Active</p>
              </div>
            </div>
          </div>

          {/* RIGHT: 5 Key Capabilities with Animated Progress Bars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                Core AI Capabilities
              </span>
              <h3 className="text-2xl font-bold text-white">
                Sub-Second Road Network Intelligence
              </h3>
            </div>

            <div className="space-y-5">
              {TRAFFIC_METRICS.map((metric, idx) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-brand-500/50 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      {metric.title}
                    </h4>
                    <span className="text-sm font-extrabold text-brand-400 font-mono">
                      {metric.value}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {metric.description}
                  </p>

                  {/* Progress Bar Container */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-700/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-600/50">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 via-sky-400 to-emerald-400"
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${metric.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2 + idx * 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>0% Threshold</span>
                      <span>Target: {metric.percentage}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
