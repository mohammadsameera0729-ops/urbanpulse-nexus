import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AIInsight } from '../../types/trafficIntelligence';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, CheckCircle2, Sliders, ShieldCheck, Zap, ArrowRight, BrainCircuit } from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights }) => {
  const [appliedInsightIds, setAppliedInsightIds] = useState<Record<string, boolean>>({});

  const handleApplyInsight = (id: string) => {
    setAppliedInsightIds((prev) => ({ ...prev, [id]: true }));
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'Critical':
        return 'bg-rose-950 text-rose-400 border-rose-500/30';
      case 'High Impact':
        return 'bg-amber-950 text-amber-400 border-amber-500/30';
      case 'Medium Impact':
        return 'bg-sky-950 text-sky-400 border-sky-500/30';
      case 'Quick Fix':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Nexus AI Traffic Intelligence & Recommendations
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-brand-950 text-brand-400 border border-brand-500/40">
                {insights.length} AI Models Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous computer vision telemetry recommendations for urban grid optimization.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          98.4% Prediction Precision
        </span>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {insights.map((insight, idx) => {
          const isApplied = appliedInsightIds[insight.id];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
            >
              <Card
                className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 hover:border-brand-500/40 rounded-2xl shadow-lg flex flex-col justify-between space-y-4 h-full relative overflow-hidden group"
              >
                {/* Subtle Glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />

                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase border ${getImpactBadge(insight.impactLevel)}`}>
                    {insight.impactLevel}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-brand-400 bg-brand-950/80 px-2 py-0.5 rounded border border-brand-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-400" />
                    {insight.confidenceScore}% Confidence
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {insight.description}
                  </p>
                </div>

                {/* Action Box */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Recommended AI Protocol:
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {insight.recommendedAction}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {insight.location}
                  </span>

                  <Button
                    variant={isApplied ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleApplyInsight(insight.id)}
                    className="text-[10px] font-bold py-1 px-2.5"
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                        Protocol Applied
                      </>
                    ) : (
                      <>
                        Apply Recommendation <ArrowRight className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
