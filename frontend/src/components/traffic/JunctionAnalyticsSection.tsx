import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JunctionAnalytics } from '../../types/trafficIntelligence';
import { MOCK_TOP_10_JUNCTIONS } from '../../data/trafficIntelligenceData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  GitCommit, 
  Car, 
  Gauge, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Maximize2,
  X,
  Radio,
  Eye,
  Zap
} from 'lucide-react';

interface JunctionAnalyticsSectionProps {
  junctions?: JunctionAnalytics[];
}

export const JunctionAnalyticsSection: React.FC<JunctionAnalyticsSectionProps> = ({
  junctions = MOCK_TOP_10_JUNCTIONS,
}) => {
  // Restrict strictly to Top 10 busiest intersections
  const top10Junctions = junctions.slice(0, 10);
  const [selectedJunction, setSelectedJunction] = useState<JunctionAnalytics | null>(null);

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'Optimal':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/30';
      case 'Degraded':
        return 'bg-amber-950 text-amber-400 border-amber-500/30';
      case 'Critical':
        return 'bg-rose-950 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <GitCommit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Junction Intelligence
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-purple-950 text-purple-400 border border-purple-500/40">
                Top 10 Busiest Intersections
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live traffic density, queue lengths, signal phase efficiency, and AI recommendations.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          Ranked by Traffic Density
        </span>
      </div>

      {/* Top 10 Junction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {top10Junctions.map((jnc) => (
          <motion.div
            key={jnc.id}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              onClick={() => setSelectedJunction(jnc)}
              className="p-4 bg-slate-950/80 border border-slate-800 hover:border-brand-500/50 rounded-2xl shadow-md cursor-pointer transition-all space-y-3 flex flex-col justify-between group"
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-brand-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {jnc.id}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${getHealthBadge(jnc.trafficHealth)}`}>
                    {jnc.trafficHealth}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {jnc.name}
                </h4>
              </div>

              {/* Density & Queue */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">Traffic Density</span>
                  <span className="font-bold text-emerald-400">{jnc.congestion}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">Queue Length</span>
                  <span className="font-bold text-white">{jnc.vehicleQueueMeters || 85}m</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">Avg Wait Time</span>
                  <span className="font-bold text-cyan-400">{jnc.waitingTime}s</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">Signal Efficiency</span>
                  <span className="font-bold text-purple-400">{jnc.signalEfficiency}%</span>
                </div>
              </div>

              {/* Signal Status */}
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Signal Phase:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {jnc.currentSignalStatus?.toUpperCase() || 'GREEN'}
                </span>
              </div>

              {/* AI Recommendation */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 space-y-0.5">
                <span className="text-brand-400 font-bold uppercase block">AI Recommendation:</span>
                <p className="line-clamp-2 leading-tight">{jnc.aiRecommendation}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] py-1 border-slate-800 text-slate-300 group-hover:bg-slate-800"
              >
                Inspect Junction
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Junction Detail Compact Modal */}
      <AnimatePresence>
        {selectedJunction && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <Card className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-white shadow-2xl my-8">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-brand-600 text-white">
                    {selectedJunction.id}
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{selectedJunction.name}</h3>
                    <p className="text-xs text-slate-400">{selectedJunction.location}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedJunction(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Camera Preview HUD */}
              <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={selectedJunction.imageUrl || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80'}
                  alt={selectedJunction.name}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 text-[10px] font-mono font-bold bg-black/80 text-emerald-400 rounded-lg border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE CAMERA SNAPSHOT
                </div>

                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-xs text-[11px] font-mono text-slate-200 flex items-center justify-between">
                  <span>Detected: 14 Cars, 2 Buses, 1 Ambulance</span>
                  <span className="text-brand-400 font-bold">{selectedJunction.vehicleCount} v/h</span>
                </div>
              </div>

              {/* Recommended Signal Timing */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                <span className="text-brand-400 font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                  Recommended Signal Timing:
                </span>
                <p className="text-slate-200 font-sans font-medium">
                  {selectedJunction.recommendedSignalTiming || 'Extend Green phase by +18 seconds for Northbound traffic'}
                </p>
              </div>

              {/* Nearby Incidents & Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Signal Status</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{selectedJunction.signalPhase}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Nearby Incidents</span>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">
                    {selectedJunction.nearbyIncidentsCount ? `${selectedJunction.nearbyIncidentsCount} Incident Alert` : 'None Reported'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <Button variant="primary" size="sm" onClick={() => setSelectedJunction(null)}>
                  Close Inspection
                </Button>
              </div>

            </Card>
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
};
