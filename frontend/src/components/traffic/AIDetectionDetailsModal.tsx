import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AICameraNode } from '../../types/aiDetection';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  X, 
  Car, 
  Bus, 
  Truck, 
  Bike, 
  Users, 
  Siren, 
  Gauge, 
  Cpu, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Maximize2,
  Clock,
  Wifi,
  Construction
} from 'lucide-react';

interface AIDetectionDetailsModalProps {
  camera: AICameraNode | null;
  onClose: () => void;
}

export const AIDetectionDetailsModal: React.FC<AIDetectionDetailsModalProps> = ({ camera, onClose }) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState(new Date().toISOString().replace('T', ' ').substring(0, 19));
  const [fpsFluctuation, setFpsFluctuation] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTimestamp(now.toISOString().replace('T', ' ').substring(0, 19));
      setFpsFluctuation(58 + Math.floor(Math.random() * 3));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!camera) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getBoundingBoxColor = (type: string) => {
    switch (type) {
      case 'car':
        return 'border-sky-400 text-sky-300 bg-sky-500/15 shadow-[0_0_12px_rgba(56,189,248,0.5)]';
      case 'bus':
        return 'border-amber-400 text-amber-300 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
      case 'truck':
        return 'border-pink-400 text-pink-300 bg-pink-500/15 shadow-[0_0_12px_rgba(236,72,153,0.5)]';
      case 'motorcycle':
      case 'bicycle':
        return 'border-emerald-400 text-emerald-300 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
      case 'pedestrian':
        return 'border-purple-400 text-purple-300 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.5)]';
      case 'emergency_vehicle':
        return 'border-rose-500 text-rose-300 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse';
      case 'traffic_cone':
        return 'border-orange-400 text-orange-300 bg-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.5)]';
      default:
        return 'border-brand-400 text-brand-300 bg-brand-500/15';
    }
  };

  const objectBreakdownItems = [
    { label: 'Cars', count: camera.detectedBreakdown.cars, icon: Car, color: 'text-sky-400', bg: 'bg-sky-950 border-sky-800' },
    { label: 'Buses', count: camera.detectedBreakdown.buses, icon: Bus, color: 'text-amber-400', bg: 'bg-amber-950 border-amber-800' },
    { label: 'Trucks', count: camera.detectedBreakdown.trucks, icon: Truck, color: 'text-pink-400', bg: 'bg-pink-950 border-pink-800' },
    { label: 'Motorcycles', count: camera.detectedBreakdown.motorcycles, icon: Bike, color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' },
    { label: 'Bicycles', count: camera.detectedBreakdown.bicycles, icon: Bike, color: 'text-teal-400', bg: 'bg-teal-950 border-teal-800' },
    { label: 'Pedestrians', count: camera.detectedBreakdown.pedestrians, icon: Users, color: 'text-purple-400', bg: 'bg-purple-950 border-purple-800' },
    { label: 'Emergency Vehicles', count: camera.detectedBreakdown.emergencyVehicles, icon: Siren, color: 'text-rose-400', bg: 'bg-rose-950 border-rose-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-white shadow-2xl my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-brand-600 text-white">
              {camera.id}
            </span>
            <div>
              <h3 className="text-xl font-bold">{camera.name}</h3>
              <p className="text-xs text-slate-400">{camera.location} • <span className="text-slate-300 font-medium">{camera.zone}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              {showBoundingBoxes ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                  Hide Boxes
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
                  Show AI Bounding Boxes
                </>
              )}
            </Button>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Live Stream Preview HUD */}
        <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          <img
            src={camera.imageUrl}
            alt={camera.name}
            className={`w-full h-full object-cover transition-opacity ${isRefreshing ? 'opacity-30' : 'opacity-90'}`}
          />

          {/* Laser Scanline Motion Overlay */}
          {camera.status === 'online' && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/10 to-transparent pointer-events-none animate-scanline" />
          )}

          {/* HUD Crosshairs */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
            <div className="w-24 h-24 border border-brand-400 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-brand-400 rounded-full animate-ping" />
            </div>
          </div>

          {/* Simulated YOLO Bounding Boxes Overlay */}
          {showBoundingBoxes && camera.status === 'online' && (
            <div className="absolute inset-0 pointer-events-none">
              {camera.simulatedBoxes.map((box) => (
                <div
                  key={box.id}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                  className={`absolute border-2 rounded ${getBoundingBoxColor(
                    box.type
                  )} flex items-start justify-start p-1`}
                >
                  <span className="text-[10px] font-mono font-bold bg-black/90 text-white border border-current/40 px-1.5 py-0.5 rounded shadow">
                    {box.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Top HUD Live & REC Telemetry */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM
              </span>

              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-rose-400 border border-rose-500/40 font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                REC 4K
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-purple-400 border border-purple-500/30">
                {fpsFluctuation} FPS
              </span>
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-brand-400 border border-brand-500/30 font-bold">
                CONFIDENCE: {camera.aiConfidence}%
              </span>
            </div>
          </div>

          {/* Bottom HUD Clock & Link Status */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              {liveTimestamp}
            </span>
            <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-slate-300 border border-slate-800 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              {camera.connectionStatus || 'Gigabit Fiber - Online'}
            </span>
          </div>
        </div>

        {/* Object Breakdown Cards Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" />
            Detected Object Breakdown (Live Frame Telemetry)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {objectBreakdownItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`p-3 rounded-2xl ${item.bg} border flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</span>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <p className="text-xl font-mono font-black text-white mt-1">{item.count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Current Speed</span>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{camera.currentSpeed} km/h</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">AI Confidence</span>
            <p className="text-lg font-bold text-brand-400 mt-0.5">{camera.aiConfidence}%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Frame Rate</span>
            <p className="text-lg font-bold text-purple-400 mt-0.5">{fpsFluctuation} FPS</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Camera Health</span>
            <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {camera.cameraHealth}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close AI Details
          </Button>
        </div>

      </Card>
    </div>
  );
};
