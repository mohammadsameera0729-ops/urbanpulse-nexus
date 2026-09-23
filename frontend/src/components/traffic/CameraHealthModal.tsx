import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrafficCamera } from '../../types/traffic';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle, RefreshCw, Radio } from 'lucide-react';

interface CameraHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameras: TrafficCamera[];
}

export const CameraHealthModal: React.FC<CameraHealthModalProps> = ({ isOpen, onClose, cameras }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!isOpen) return null;

  const handleRunDiagnostic = () => {
    setIsScanning(true);
    setScanned(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanned(true);
    }, 1500);
  };

  const onlineCount = cameras.filter((c) => c.status === 'online').length;
  const offlineCount = cameras.filter((c) => c.status === 'offline').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Traffic Camera Network Diagnostic Health</h3>
              <p className="text-xs text-slate-400">
                Diagnostic scan of optical sensors, IP telemetry streams, and AI edge hardware.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">
            ✕
          </button>
        </div>

        {/* Diagnostic Overview Cards */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Monitored Nodes</span>
            <p className="text-xl font-mono font-black text-white mt-1">{cameras.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Optimal Health</span>
            <p className="text-xl font-mono font-black text-emerald-400 mt-1">{onlineCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hardware Faults</span>
            <p className="text-xl font-mono font-black text-rose-400 mt-1">{offlineCount}</p>
          </div>
        </div>

        {/* Scan Status Log */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 font-bold uppercase text-[10px]">
            <span>System Telemetry Check</span>
            <span>{isScanning ? 'SCANNING NOW...' : scanned ? 'DIAGNOSTIC PASSED' : 'READY'}</span>
          </div>

          <div className="space-y-1 text-slate-300">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Optical Lens Self-Cleaning Cycle: <span className="text-emerald-400">100% Operational</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              AI Object Detection Latency: <span className="text-brand-400">12ms (Optimal)</span>
            </p>
            <p className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Node CAM-106 (Metro Central): <span className="text-amber-400">Signal Loss - Field Ticket Dispatched</span>
            </p>
            <p className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Node CAM-112 (City Center Underpass): <span className="text-amber-400">Backup Radio Battery 18%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunDiagnostic}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />}
            className="border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            {isScanning ? 'Running Scan...' : 'Re-Run Diagnostic Scan'}
          </Button>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close Health Diagnostics
          </Button>
        </div>
      </Card>
    </div>
  );
};
