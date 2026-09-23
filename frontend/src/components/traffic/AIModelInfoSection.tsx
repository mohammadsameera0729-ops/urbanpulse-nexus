import React from 'react';
import { Card } from '../ui/Card';
import { AIModelConfig } from '../../types/aiDetection';
import { Cpu, Activity, Zap, HardDrive, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AIModelInfoSectionProps {
  modelInfo: AIModelConfig;
}

export const AIModelInfoSection: React.FC<AIModelInfoSectionProps> = ({ modelInfo }) => {
  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI Engine & Hardware Inference Architecture
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-purple-950 text-purple-400 border border-purple-500/40">
                YOLOv8 Edge Matrix
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              TensorRT accelerated deep learning computer vision pipeline specs.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Zero Frame Drop Inference
        </span>
      </div>

      {/* Hardware Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">YOLO Model Version</span>
          <p className="text-base font-mono font-bold text-white">{modelInfo.yoloVersion}</p>
          <p className="text-[11px] text-brand-400 font-mono font-medium">{modelInfo.modelStatus}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Model Precision (mAP)</span>
          <p className="text-xl font-mono font-black text-emerald-400">{modelInfo.modelAccuracy}</p>
          <p className="text-[11px] text-slate-400 font-mono">Tested on COCO + Traffic Dataset</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Inference Speed</span>
          <p className="text-xl font-mono font-black text-brand-400">{modelInfo.inferenceSpeed}</p>
          <p className="text-[11px] text-slate-400 font-mono">TensorRT INT8 Quantized</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">GPU Acceleration</span>
          <p className="text-xs font-mono font-bold text-white truncate">{modelInfo.gpuStatus}</p>
          <p className="text-[11px] text-purple-400 font-mono">NVMM Shared Memory ON</p>
        </div>

      </div>

      {/* Resource Meters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">CPU Usage:</span>
          <span className="font-bold text-white">{modelInfo.cpuUsage}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">VRAM Allocation:</span>
          <span className="font-bold text-brand-400">{modelInfo.memoryUsage}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Pipeline Status:</span>
          <span className="font-bold text-emerald-400">Optimal (Updated {modelInfo.lastUpdated})</span>
        </div>
      </div>
    </Card>
  );
};
