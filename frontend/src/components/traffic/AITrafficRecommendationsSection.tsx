import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AIOperationalRecommendation } from '../../types/trafficIntelligence';
import { MOCK_4_AI_RECOMMENDATIONS } from '../../data/trafficIntelligenceData';
import { Sparkles, Sliders, Siren, Navigation, ShieldAlert, CheckCircle2, Clock, Zap } from 'lucide-react';

export const AITrafficRecommendationsSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIOperationalRecommendation[]>(MOCK_4_AI_RECOMMENDATIONS);
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});

  const handleApply = (id: string) => {
    setAppliedIds((prev) => ({ ...prev, [id]: true }));
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'Signal Timing Optimization':
        return Sliders;
      case 'Emergency Vehicle Priority':
        return Siren;
      case 'Traffic Route Diversion':
        return Navigation;
      case 'Incident Response':
        return ShieldAlert;
      default:
        return Sparkles;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority.includes('Critical')) {
      return 'bg-rose-950/80 text-rose-400 border-rose-500/40';
    }
    return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI Traffic Intelligence & Operational Recommendations
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-brand-950 text-brand-400 border border-brand-500/40">
                4 Decision Recommendations
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous decision-support telemetry evaluating signal timing, priority corridors, detours, and incident response.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          Decision Engine Active
        </span>
      </div>

      {/* 4 Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec) => {
          const Icon = getCardIcon(rec.type);
          const isApplied = appliedIds[rec.id];

          return (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-brand-500/40 transition-all space-y-4 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    {rec.type}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md border ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target Location:</span>
                  <p className="text-xs font-bold text-white">{rec.affectedLocation}</p>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p className="text-[11px] text-slate-400">Reason / Context:</p>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{rec.reason}</p>

                  {rec.detailParam && (
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-brand-300 font-bold mt-1">
                      {rec.detailParam}
                    </div>
                  )}
                </div>
              </div>

              {/* Action & Confidence Bar */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 font-mono">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    AI Recommended Action:
                  </span>
                  <p className="text-xs text-emerald-300 font-bold leading-tight">
                    {rec.recommendedAction}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">AI Confidence:</span>
                  <span className="text-emerald-400 font-bold">{rec.confidenceScore}%</span>
                </div>

                <Button
                  variant={isApplied ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleApply(rec.id)}
                  className="w-full text-xs font-bold py-2"
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                      Recommendation Executed
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Apply Recommendation
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
