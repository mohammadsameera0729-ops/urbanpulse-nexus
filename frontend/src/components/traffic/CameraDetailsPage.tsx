import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrafficCamera } from '../../types/traffic';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  ArrowLeft, 
  RefreshCw, 
  History, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  MapPin, 
  Calendar, 
  Cpu, 
  Activity, 
  Gauge, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Clock, 
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CameraDetailsPageProps {
  camera: TrafficCamera;
  onBack: () => void;
}

export const CameraDetailsPage: React.FC<CameraDetailsPageProps> = ({ camera, onBack }) => {
  const [showAIOverlay, setShowAIOverlay] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [signalOverrideActive, setSignalOverrideActive] = useState(false);

  const handleRefreshStream = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleToggleSignalOverride = () => {
    setSignalOverrideActive(!signalOverrideActive);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 font-semibold"
          >
            Back to Grid
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-lg bg-brand-950 text-brand-400 border border-brand-500/40">
                {camera.id}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {camera.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {camera.location} • <span className="text-slate-300 font-medium">{camera.zone}</span>
            </p>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStream}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Stream
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIOverlay(!showAIOverlay)}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
          >
            {showAIOverlay ? (
              <>
                <EyeOff className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                Hide Bounding Boxes
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
                Show AI Overlay
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryModal(true)}
            leftIcon={<History className="w-3.5 h-3.5" />}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
          >
            View History
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}
            leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
            className="text-xs shadow-lg shadow-brand-500/20"
          >
            Full Screen HUD
          </Button>
        </div>
      </div>

      {/* Main Grid: Stream & Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large Interactive Camera Stream HUD (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Stream HUD Container */}
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
              
              <img
                src={camera.imageUrl}
                alt={camera.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isRefreshing ? 'opacity-40' : 'opacity-90'
                }`}
              />

              {/* HUD Crosshairs Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2)_0%,transparent_70%)]" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-16 h-16 border border-brand-500/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-ping" />
                </div>
              </div>

              {/* Simulated AI Object Detection Bounding Boxes */}
              {showAIOverlay && camera.status === 'online' && (
                <div className="absolute inset-0 pointer-events-none">
                  {camera.simulatedBoxes.map((box) => (
                    <motion.div
                      key={box.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                      className="absolute border-2 border-brand-400 bg-brand-500/15 rounded shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-start justify-start p-1"
                    >
                      <div className="bg-slate-900/90 text-brand-300 border border-brand-500/50 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        {box.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Top HUD Telemetry Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE STREAM 4K @ 60FPS
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-brand-400">
                    LAT: {camera.lat.toFixed(4)} | LNG: {camera.lng.toFixed(4)}
                  </span>
                  <span className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
                    YOLOv8 ON
                  </span>
                </div>
              </div>

              {/* Bottom HUD Analytics Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs font-mono">
                <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                  IP: {camera.ipAddress} | FW: {camera.firmware}
                </div>
                <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-amber-400">
                  LIVE VEHICLES IN FRAME: {camera.simulatedBoxes.length}
                </div>
              </div>
            </div>

            {/* Stream Action Toolbar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={signalOverrideActive ? 'danger' : 'outline'}
                  size="sm"
                  onClick={handleToggleSignalOverride}
                  leftIcon={<Sliders className="w-4 h-4" />}
                  className="text-xs font-bold"
                >
                  {signalOverrideActive ? 'Signal Override ACTIVE (Manual Green)' : 'Request AI Signal Priority'}
                </Button>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Resolution: <span className="text-white font-bold">{camera.resolution}</span>
              </div>
            </div>
          </Card>

          {/* Recent AI Detection Events Log */}
          <Card className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Camera Event & Telemetry Logs
            </h3>

            <div className="space-y-2">
              {camera.recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-brand-400">
                        {evt.time}
                      </span>
                      <span className="text-xs font-bold text-white">{evt.type}</span>
                    </div>
                    <p className="text-xs text-slate-400">{evt.description}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      evt.severity === 'critical'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : evt.severity === 'warning'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {evt.severity}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Metadata Breakdown (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-400" />
              Camera Telemetry Parameters
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Camera ID:</span>
                <span className="font-mono font-bold text-brand-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {camera.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Zone / Corridor:</span>
                <span className="font-bold text-white">{camera.zone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Installation Date:</span>
                <span className="font-mono text-slate-300">{camera.installationDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Online Status:</span>
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full uppercase ${
                    camera.status === 'online'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {camera.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Health Diagnostics:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {camera.healthStatus}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Camera Architecture:</span>
                <span className="font-bold text-slate-200">{camera.cameraType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Today's Vehicles Total:</span>
                <span className="font-mono font-bold text-brand-400 text-sm">
                  {camera.todayVehicles.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Density Progress Bar Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Traffic Density Level</span>
                <span className="font-mono font-bold text-white">{camera.trafficDensity}%</span>
              </div>

              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${camera.trafficDensity}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                />
              </div>
            </div>

            {/* Today's Key Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Current Flow</span>
                <p className="text-lg font-mono font-black text-white">
                  {camera.vehicleCount} <span className="text-xs font-normal text-slate-400">v/h</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Speed</span>
                <p className="text-lg font-mono font-black text-emerald-400">
                  {camera.avgSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </p>
              </div>
            </div>

            {/* AI Model Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/60 to-slate-950 border border-brand-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                AI Edge Detection Engine
              </div>
              <p className="text-xs text-slate-300">{camera.aiDetectionStatus}</p>
            </div>
          </Card>
        </div>

      </div>

      {/* Full Screen HUD Overlay Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between text-white border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-brand-600 text-white font-mono font-bold text-sm">
                  {camera.id}
                </span>
                <h2 className="text-xl font-bold">{camera.name} - Full Screen Telemetry</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(false)}
                leftIcon={<Minimize2 className="w-4 h-4" />}
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Exit Full Screen
              </Button>
            </div>

            {/* Modal Stream Preview */}
            <div className="flex-1 my-4 relative rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={camera.imageUrl} alt={camera.name} className="w-full h-full object-cover" />
              {showAIOverlay && (
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
                      className="absolute border-2 border-brand-400 bg-brand-500/20 rounded flex items-start justify-start p-1"
                    >
                      <span className="text-xs font-mono font-bold bg-brand-600 text-white px-2 py-0.5 rounded">
                        {box.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-4">
              <span>STATUS: ONLINE | LAT: {camera.lat} LNG: {camera.lng}</span>
              <span>YOLOv8 STREAM ANALYTICS ACTIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <Card className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-brand-400" />
                  Historical Analytics - {camera.id}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-slate-400 hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400">
                24-Hour historical vehicle throughput and speed log for {camera.name}.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span>08:00 AM Peak:</span>
                  <span className="text-brand-400 font-bold">2,140 vehicles/hr @ 24 km/h</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span>12:00 PM Midday:</span>
                  <span className="text-emerald-400 font-bold">1,420 vehicles/hr @ 48 km/h</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span>05:00 PM Rush:</span>
                  <span className="text-amber-400 font-bold">2,450 vehicles/hr @ 18 km/h</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setShowHistoryModal(false)}>
                  Close History
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
