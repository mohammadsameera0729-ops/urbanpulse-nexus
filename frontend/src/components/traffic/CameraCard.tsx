import React from 'react';
import { motion } from 'framer-motion';
import { TrafficCamera } from '../../types/traffic';
import { Card } from '../ui/Card';
import { Camera, MapPin, Gauge, Car, Cpu, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CameraCardProps {
  camera: TrafficCamera;
  onClick: (camera: TrafficCamera) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, onClick }) => {
  const getTrafficLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'moderate':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getDensityBarColor = (density: number) => {
    if (density >= 80) return 'from-rose-500 to-amber-500';
    if (density >= 50) return 'from-amber-500 to-sky-500';
    return 'from-emerald-500 to-teal-400';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={() => onClick(camera)}
        className="bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 shadow-lg hover:shadow-brand-500/10 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all group relative"
      >
        {/* Camera Image Thumbnail HUD */}
        <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
          <img
            src={camera.imageUrl}
            alt={camera.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60" />

          {/* Top HUD Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 text-[11px] font-black font-mono tracking-wider rounded-lg bg-black/75 text-brand-400 border border-brand-500/40 backdrop-blur-md">
              {camera.id}
            </span>

            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border backdrop-blur-md ${getTrafficLevelColor(
                  camera.trafficLevel
                )}`}
              >
                {camera.trafficLevel}
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md backdrop-blur-md ${
                  camera.status === 'online'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    camera.status === 'online'
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-rose-400'
                  }`}
                />
                {camera.status}
              </span>
            </div>
          </div>

          {/* Simulated AI Object Bounding Boxes */}
          {camera.status === 'online' && camera.simulatedBoxes.length > 0 && (
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
                  className="absolute border-2 border-brand-400/90 rounded bg-brand-500/10 shadow-[0_0_8px_rgba(56,189,248,0.4)] flex items-start justify-start p-0.5"
                >
                  <span className="text-[8px] font-mono font-bold bg-brand-600 text-white px-1 py-0.2 rounded-xs shadow">
                    {box.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom HUD Stream Meta */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-slate-300 font-mono">
            <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
              <Clock className="w-3 h-3 text-brand-400" />
              {camera.lastUpdated}
            </span>
            <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs text-slate-400">
              {camera.cameraType}
            </span>
          </div>
        </div>

        {/* Camera Info Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
              {camera.name}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{camera.location}</span>
            </p>
          </div>

          {/* AI Status Banner */}
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400 shrink-0 animate-pulse" />
            <span className="text-[10px] text-slate-300 font-mono truncate">
              {camera.aiDetectionStatus}
            </span>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/40">
                <Car className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Vehicles / hr</p>
                <p className="font-mono font-bold text-white text-xs">
                  {camera.vehicleCount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                <Gauge className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Speed</p>
                <p className="font-mono font-bold text-white text-xs">
                  {camera.avgSpeed} km/h
                </p>
              </div>
            </div>
          </div>

          {/* Traffic Density Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Traffic Density</span>
              <span className="font-mono font-bold text-slate-200">
                {camera.trafficDensity}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                style={{ width: `${camera.trafficDensity}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${getDensityBarColor(
                  camera.trafficDensity
                )} transition-all duration-500`}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
