import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AccidentDetectionEvent } from '../../types/aiDetection';
import { ShieldAlert, AlertTriangle, Clock, MapPin, CheckCircle2, Zap, Siren } from 'lucide-react';

interface AccidentDetectionSectionProps {
  accidents: AccidentDetectionEvent[];
  onInspectCamera?: (cameraId: string) => void;
}

export const AccidentDetectionSection: React.FC<AccidentDetectionSectionProps> = ({
  accidents,
  onInspectCamera,
}) => {
  const [dispatchedIds, setDispatchedIds] = useState<Record<string, boolean>>({});

  const handleDispatch = (id: string) => {
    setDispatchedIds((prev) => ({ ...prev, [id]: true }));
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-950 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      default:
        return 'bg-sky-950 text-sky-400 border-sky-500/40';
    }
  };

  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'Active':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Dispatching':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Cleared':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Automated Accident & Impact Telemetry
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-rose-950 text-rose-400 border border-rose-500/40">
                {accidents.filter((a) => a.status !== 'Cleared').length} Active Incidents
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Computer-vision multi-frame impact & sudden deceleration detection.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-rose-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          Emergency Priority Protocol ON
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accidents.map((acc) => {
          const isDispatched = dispatchedIds[acc.id] || acc.status === 'Dispatching' || acc.status === 'Cleared';
          return (
            <div
              key={acc.id}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {acc.id}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getSeverityStyle(acc.severity)}`}>
                    {acc.severity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{acc.location}</span>
                </h4>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {acc.time}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {acc.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  AI Mitigation Recommendation:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {acc.recommendedAction}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(acc.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {isDispatched ? 'Dispatched' : acc.status}
                </span>

                <div className="flex items-center gap-1.5">
                  {onInspectCamera && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInspectCamera(acc.cameraId)}
                      className="text-[10px] font-bold py-1 px-2 border-slate-800"
                    >
                      View Camera
                    </Button>
                  )}

                  <Button
                    variant={isDispatched ? 'outline' : 'danger'}
                    size="sm"
                    onClick={() => handleDispatch(acc.id)}
                    className="text-[10px] font-bold py-1 px-2.5"
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                        Dispatched
                      </>
                    ) : (
                      <>
                        <Siren className="w-3 h-3 mr-1" />
                        Dispatch Unit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
