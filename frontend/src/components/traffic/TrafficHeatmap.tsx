import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrafficZone, HeatmapTrafficLevel } from '../../types/trafficIntelligence';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Map, 
  Search, 
  Filter, 
  Activity, 
  ShieldCheck, 
  Gauge, 
  Camera, 
  Sliders, 
  HeartPulse, 
  X,
  ChevronRight
} from 'lucide-react';

interface TrafficHeatmapProps {
  zones: TrafficZone[];
}

export const TrafficHeatmap: React.FC<TrafficHeatmapProps> = ({ zones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<TrafficZone | null>(null);

  const getLevelBadge = (level: HeatmapTrafficLevel) => {
    switch (level) {
      case 'very_low':
        return { label: 'Very Low Traffic', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', color: '#10b981' };
      case 'low':
        return { label: 'Low Traffic', bg: 'bg-teal-500/20 text-teal-400 border-teal-500/30', color: '#14b8a6' };
      case 'moderate':
        return { label: 'Moderate Traffic', bg: 'bg-sky-500/20 text-sky-400 border-sky-500/30', color: '#38bdf8' };
      case 'high':
        return { label: 'High Traffic', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30', color: '#f59e0b' };
      case 'critical':
        return { label: 'Critical Traffic', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30', color: '#ef4444' };
    }
  };

  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q) || z.primaryCorridor.toLowerCase().includes(q);
      const matchesFilter = levelFilter === 'all' || z.trafficLevel === levelFilter;
      return matchesSearch && matchesFilter;
    });
  }, [zones, searchTerm, levelFilter]);

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-6">
      
      {/* Top Header & Search / Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Map className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              City-Wide Traffic Heatmap Matrix
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-brand-950 text-brand-400 border border-brand-500/30">
                {filteredZones.length} / {zones.length} Zones
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 25-zone city telemetry matrix monitoring density, speeds, and signal status.
            </p>
          </div>
        </div>

        {/* Search & Level Filter */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search zone, code, corridor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Level: All Zones</option>
            <option value="very_low">Very Low Traffic</option>
            <option value="low">Low Traffic</option>
            <option value="moderate">Moderate Traffic</option>
            <option value="high">High Traffic</option>
            <option value="critical">Critical Traffic</option>
          </select>
        </div>
      </div>

      {/* Heatmap Legend Bar */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-brand-400" />
          Heatmap Color Legend:
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300 text-[11px]">Very Low (&lt; 20%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-400" />
            <span className="text-slate-300 text-[11px]">Low (20% - 40%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400" />
            <span className="text-slate-300 text-[11px]">Moderate (40% - 65%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-300 text-[11px]">High (65% - 85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-300 text-[11px]">Critical (&gt; 85%)</span>
          </div>
        </div>
      </div>

      {/* 25 Zones Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredZones.map((zone) => {
          const badge = getLevelBadge(zone.trafficLevel);
          return (
            <motion.div
              key={zone.id}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div
                onClick={() => setSelectedZone(zone)}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/50 shadow-md cursor-pointer transition-all space-y-3 relative overflow-hidden group"
              >
                {/* Top Status & Code */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-brand-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {zone.code}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${badge.bg}`}>
                    {zone.trafficLevel.replace('_', ' ')}
                  </span>
                </div>

                {/* Zone Title & Corridor */}
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                    {zone.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {zone.primaryCorridor}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60 font-mono">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Density</p>
                    <p className="font-bold text-white">{zone.trafficDensity}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Avg Speed</p>
                    <p className="font-bold text-emerald-400">{zone.avgSpeed} km/h</p>
                  </div>
                </div>

                {/* Heatmap Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${zone.trafficDensity}%`, backgroundColor: badge.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Zone Telemetry Drawer Modal */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <Card className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-brand-600 text-white">
                    {selectedZone.code}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{selectedZone.name}</h3>
                    <p className="text-xs text-slate-400">{selectedZone.primaryCorridor}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Zone Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Traffic Density</span>
                  <p className="text-xl font-mono font-black text-brand-400">{selectedZone.trafficDensity}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Average Speed</span>
                  <p className="text-xl font-mono font-black text-emerald-400">{selectedZone.avgSpeed} km/h</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Active Vehicles</span>
                  <p className="text-lg font-mono font-bold text-white">{selectedZone.activeVehicles.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Camera Nodes</span>
                  <p className="text-lg font-mono font-bold text-sky-400">{selectedZone.cameraCount} Optical Nodes</p>
                </div>
              </div>

              {/* Signal & Health */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Signal Controllers:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedZone.signalStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Zone Peak Window:</span>
                  <span className="font-mono text-amber-400">{selectedZone.peakHour}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Zone Health Score:</span>
                  <span className="font-mono text-white font-bold">{selectedZone.healthScore} / 100</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={() => setSelectedZone(null)}>
                  Close Telemetry Drawer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
