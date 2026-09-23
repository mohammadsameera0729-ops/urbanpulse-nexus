import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrafficSignalJunctionSim } from '../../types/aiDetection';
import { MOCK_TRAFFIC_SIGNALS_SIM } from '../../data/aiDetectionData';
import { Radio, Sliders, Clock, Users, Activity, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';

export const SmartTrafficSignalPanel: React.FC = () => {
  const [junctions, setJunctions] = useState<TrafficSignalJunctionSim[]>(MOCK_TRAFFIC_SIGNALS_SIM);
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});

  // Countdown timer loop to simulate live signal countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setJunctions((prev) =>
        prev.map((jnc) => {
          if (jnc.countdownSeconds > 1) {
            return { ...jnc, countdownSeconds: jnc.countdownSeconds - 1 };
          } else {
            // Cycle signal phase: green -> yellow -> red -> green
            const nextSignal =
              jnc.currentSignal === 'green'
                ? 'yellow'
                : jnc.currentSignal === 'yellow'
                ? 'red'
                : 'green';
            const nextTime = nextSignal === 'green' ? 30 : nextSignal === 'yellow' ? 4 : 25;
            return {
              ...jnc,
              currentSignal: nextSignal,
              countdownSeconds: nextTime,
              lastPhaseUpdate: 'Just now',
            };
          }
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleApplyRecommendation = (id: string) => {
    setAppliedIds((prev) => ({ ...prev, [id]: true }));
    setJunctions((prev) =>
      prev.map((j) => (j.id === id ? { ...j, countdownSeconds: j.countdownSeconds + 15 } : j))
    );
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Smart Traffic Signal Controller Simulation
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-amber-950 text-amber-400 border border-amber-500/40">
                Live Countdown Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous micro-phase timing, queue clearing, and emergency priority green waves.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          Grid Clock Synchronized
        </span>
      </div>

      {/* Junction Signal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {junctions.map((jnc) => {
          const isApplied = appliedIds[jnc.id];
          return (
            <div
              key={jnc.id}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/40 transition-all space-y-4 flex flex-col justify-between"
            >
              {/* Top Title & Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-brand-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {jnc.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    Health: {jnc.signalHealth}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{jnc.name}</h4>
                <p className="text-[11px] text-slate-400 truncate">{jnc.location}</p>
              </div>

              {/* Traffic Signal Visual Lights Display */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-black/60 p-2 rounded-xl border border-slate-800">
                  {/* RED */}
                  <span
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      jnc.currentSignal === 'red'
                        ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-pulse'
                        : 'bg-slate-800 opacity-40'
                    }`}
                  />
                  {/* YELLOW */}
                  <span
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      jnc.currentSignal === 'yellow'
                        ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse'
                        : 'bg-slate-800 opacity-40'
                    }`}
                  />
                  {/* GREEN */}
                  <span
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      jnc.currentSignal === 'green'
                        ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse'
                        : 'bg-slate-800 opacity-40'
                    }`}
                  />
                </div>

                {/* Remaining Countdown Timer */}
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Phase Time</span>
                  <span className="text-2xl font-black text-white">
                    {jnc.countdownSeconds}s
                  </span>
                </div>
              </div>

              {/* Queue Length & Pedestrians */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Vehicle Queue</span>
                  <p className="font-bold text-white text-xs mt-0.5">{jnc.queueLengthMeters}m ({jnc.queueVehicleCount} veh)</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Ped Crosswalk</span>
                  <p className="font-bold text-purple-400 text-xs mt-0.5">{jnc.pedestrianCrossing}</p>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-brand-950/40 to-slate-900 border border-brand-500/20 space-y-1">
                <span className="text-[10px] text-brand-300 font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-brand-400" />
                  AI Optimization Strategy:
                </span>
                <p className="text-xs text-slate-200 font-medium leading-tight">
                  {jnc.aiRecommendation}
                </p>
              </div>

              {/* Action Button */}
              <Button
                variant={isApplied ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleApplyRecommendation(jnc.id)}
                className="text-[11px] font-bold py-1.5 w-full"
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Green Extended +15s
                  </>
                ) : (
                  <>
                    <Sliders className="w-3.5 h-3.5 mr-1" />
                    Apply AI Timing Adjustment
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
