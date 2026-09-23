import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingAlertItem } from '../../types/aiDetection';
import { MOCK_FLOATING_ALERTS } from '../../data/aiDetectionData';
import { ShieldAlert, AlertTriangle, Siren, X, Eye, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface SmartAIFloatingAlertsProps {
  onInspectCamera?: (cameraId: string) => void;
}

export const SmartAIFloatingAlerts: React.FC<SmartAIFloatingAlertsProps> = ({ onInspectCamera }) => {
  const [alerts, setAlerts] = useState<FloatingAlertItem[]>(MOCK_FLOATING_ALERTS);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-950/90 text-rose-400 border-rose-500/50 shadow-rose-500/20';
      case 'High':
        return 'bg-amber-950/90 text-amber-400 border-amber-500/50 shadow-amber-500/20';
      default:
        return 'bg-sky-950/90 text-sky-400 border-sky-500/50 shadow-sky-500/20';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl pointer-events-auto ${getPriorityStyle(
              alert.priority
            )} space-y-2 relative overflow-hidden`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  {alert.priority} ALERT
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-300">
                  {alert.confidence}% AI
                </span>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Location */}
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-current" />
                {alert.title}
              </h4>
              <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                {alert.location}
              </p>
            </div>

            {/* Actions & Timestamp */}
            <div className="flex items-center justify-between pt-1 text-xs border-t border-white/10 font-mono">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {alert.time}
              </span>

              {alert.cameraId && onInspectCamera && (
                <button
                  onClick={() => onInspectCamera(alert.cameraId!)}
                  className="text-[11px] font-bold text-white hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View Feed
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
