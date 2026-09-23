import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AICameraNode } from '../../types/aiDetection';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Camera, 
  MapPin, 
  Eye, 
  History, 
  Clock, 
  Cpu, 
  Car, 
  Users, 
  Search, 
  Filter,
  Wifi,
  Radio,
  Maximize2
} from 'lucide-react';

interface LiveDetectionGridProps {
  cameras: AICameraNode[];
  onSelectCamera: (camera: AICameraNode) => void;
  onOpenHistory: (cameraId: string) => void;
}

export const LiveDetectionGrid: React.FC<LiveDetectionGridProps> = ({
  cameras,
  onSelectCamera,
  onOpenHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [liveTimestamp, setLiveTimestamp] = useState(new Date().toISOString().replace('T', ' ').substring(0, 19));
  const [fpsFluctuation, setFpsFluctuation] = useState(60);

  // Dynamic live clock & FPS simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTimestamp(now.toISOString().replace('T', ' ').substring(0, 19));
      setFpsFluctuation(58 + Math.floor(Math.random() * 3));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        cam.name.toLowerCase().includes(q) ||
        cam.id.toLowerCase().includes(q) ||
        cam.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || cam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cameras, searchTerm, statusFilter]);

  const getBoundingBoxColor = (type: string) => {
    switch (type) {
      case 'car':
        return 'border-sky-400 text-sky-300 bg-sky-500/10 shadow-[0_0_8px_rgba(56,189,248,0.4)]';
      case 'bus':
        return 'border-amber-400 text-amber-300 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
      case 'truck':
        return 'border-pink-400 text-pink-300 bg-pink-500/10 shadow-[0_0_8px_rgba(236,72,153,0.4)]';
      case 'motorcycle':
      case 'bicycle':
        return 'border-emerald-400 text-emerald-300 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'pedestrian':
        return 'border-purple-400 text-purple-300 bg-purple-500/10 shadow-[0_0_8px_rgba(168,85,247,0.4)]';
      case 'emergency_vehicle':
        return 'border-rose-500 text-rose-300 bg-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse';
      case 'traffic_cone':
        return 'border-orange-400 text-orange-300 bg-orange-500/15 shadow-[0_0_8px_rgba(249,115,22,0.4)]';
      default:
        return 'border-brand-400 text-brand-300 bg-brand-500/10';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Live AI Detection Camera Grid
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-brand-950 text-brand-400 border border-brand-500/30">
                12 Live Video Streams
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Edge optical sensors processing 60 FPS real-time object bounding boxes with live HUD overlays.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search camera ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Status: All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* 12 Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCameras.map((camera) => (
          <motion.div
            key={camera.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all group relative">
              
              {/* Camera Live Preview Stream HUD */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={camera.imageUrl}
                  alt={camera.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                
                {/* Laser Scanline Motion Animation */}
                {camera.status === 'online' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/10 to-transparent pointer-events-none animate-scanline" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/70 pointer-events-none" />

                {/* Top Overlay Badges: LIVE, REC, ID */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-1.5">
                    {/* LIVE BADGE */}
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black font-mono uppercase rounded-md bg-black/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>

                    {/* REC INDICATOR */}
                    {camera.status === 'online' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black font-mono uppercase rounded-md bg-rose-950/80 text-rose-400 border border-rose-500/40 backdrop-blur-md animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        REC
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-black rounded-md bg-black/80 text-brand-400 border border-brand-500/40 backdrop-blur-md">
                      {camera.id}
                    </span>
                    <button
                      onClick={() => onSelectCamera(camera)}
                      className="pointer-events-auto p-1 rounded-md bg-black/80 text-slate-300 hover:text-white border border-slate-700/60"
                      title="Fullscreen HUD"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Realistic YOLO Bounding Boxes Overlay */}
                {camera.status === 'online' && (
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
                        )} flex items-start justify-start p-0.5`}
                      >
                        {/* Corner Reticle */}
                        <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-current" />
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-current" />

                        <span className="text-[8px] font-mono font-bold bg-black/90 px-1 py-0.2 rounded-xs shadow border border-current/40 whitespace-nowrap">
                          {box.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom HUD Stream Meta: Live Timestamp, FPS, Link */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[9px] text-slate-300 font-mono z-10">
                  <span className="bg-black/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 text-slate-200 border border-slate-800">
                    <Clock className="w-2.5 h-2.5 text-brand-400" />
                    {liveTimestamp}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="bg-black/80 px-2 py-0.5 rounded backdrop-blur-xs text-purple-400 border border-purple-500/30">
                      {fpsFluctuation} FPS
                    </span>
                    <span className="bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-xs text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5" title="Signal Strength 5/5">
                      <Wifi className="w-2.5 h-2.5" />
                      5G
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                    {camera.name}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{camera.location}</span>
                  </p>
                </div>

                {/* Current Detection Summary */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-400 shrink-0 animate-pulse" />
                  <span className="text-[11px] text-slate-200 font-mono truncate">
                    {camera.currentDetectionSummary}
                  </span>
                </div>

                {/* Counts & Confidence */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-sky-400" />
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">Vehicles</p>
                      <p className="font-bold text-white">{camera.vehicleCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">Pedestrians</p>
                      <p className="font-bold text-white">{camera.pedestrianCount}</p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelectCamera(camera)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="text-[11px] font-bold"
                  >
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenHistory(camera.id)}
                    leftIcon={<History className="w-3.5 h-3.5" />}
                    className="text-[11px] border-slate-800 text-slate-300 hover:bg-slate-800 font-semibold"
                  >
                    History
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
