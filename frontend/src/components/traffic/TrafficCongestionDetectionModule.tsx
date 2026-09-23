import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Activity, 
  MapPin, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';
import { TrafficObservation, TrafficStatus } from '../../types/trafficCongestion';
import { classifyCongestionLevel } from '../../utils/trafficCongestionClassifier';
import { fetchTrafficObservations } from '../../services/trafficObservationService';
import { useAuth } from '../../context/AuthContext';

export const TrafficCongestionDetectionModule: React.FC = () => {
  const { token } = useAuth();
  const [observations, setObservations] = useState<TrafficObservation[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'All' | TrafficStatus>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadObservations = async () => {
      setLoading(true);
      const data = await fetchTrafficObservations(token);
      if (isMounted) {
        setObservations(data);
        setLoading(false);
      }
    };
    loadObservations();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filteredObservations = observations.filter((obs) => {
    if (selectedFilter === 'All') return true;
    return obs.trafficStatus === selectedFilter;
  });

  const heavyCount = observations.filter((o) => o.trafficStatus === 'Heavy').length;
  const moderateCount = observations.filter((o) => o.trafficStatus === 'Moderate').length;
  const normalCount = observations.filter((o) => o.trafficStatus === 'Normal').length;

  return (
    <Card className="p-6 bg-[#111827] border border-slate-800 rounded-3xl space-y-6 shadow-xl font-sans">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-widest block">
                AI Traffic Intelligence Module 01
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Traffic / Congestion Detection
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Observation & congestion severity classification across 12 authoritative Vijayawada traffic monitoring points.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSelectedFilter('All')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFilter === 'All'
                ? 'bg-[#2563EB] text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({observations.length})
          </button>
          <button
            onClick={() => setSelectedFilter('Heavy')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFilter === 'Heavy'
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Heavy ({heavyCount})
          </button>
          <button
            onClick={() => setSelectedFilter('Moderate')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFilter === 'Moderate'
                ? 'bg-amber-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Moderate ({moderateCount})
          </button>
          <button
            onClick={() => setSelectedFilter('Normal')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFilter === 'Normal'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Normal ({normalCount})
          </button>
        </div>
      </div>

      {/* Observation Architecture Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 text-slate-300 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-slate-300">
            Source: <strong className="text-white">Pre-camera traffic observation</strong> &bull; Analysis: <strong className="text-emerald-400">Traffic analysis available</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0">
          Future CCTV Vision Pipeline Compatible
        </span>
      </div>

      {/* Observation Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-mono">
          Loading traffic congestion observations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredObservations.map((obs) => {
            const classification = classifyCongestionLevel(obs.congestionLevel);
            return (
              <div
                key={obs.monitoringPointId}
                className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  
                  {/* Top Row: Junction & ID */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">
                        {obs.monitoringPointId}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
                        {obs.junctionName}
                      </h3>
                    </div>
                    
                    {/* Status Badge */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold uppercase tracking-wider shrink-0 ${classification.badgeClass}`}
                    >
                      {obs.trafficStatus}
                    </span>
                  </div>

                  {/* Real Location */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate">{obs.location}</span>
                  </div>

                  {/* Congestion Meter */}
                  <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Congestion Index</span>
                      <span className="font-mono font-bold text-white">{obs.congestionLevel}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          obs.congestionLevel >= 70
                            ? 'bg-rose-500'
                            : obs.congestionLevel >= 40
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${obs.congestionLevel}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight pt-1">
                      {classification.description}
                    </p>
                  </div>

                </div>

                {/* Bottom Metadata & Action */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="leading-tight">Observation timestamp: {obs.observedAt.slice(0, 10)} 08:30 IST</span>
                    </div>
                  </div>

                  <a
                    href={obs.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700/60"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                    Open Location on Google Maps
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </Card>
  );
};
