import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MOCK_12_AI_CAMERAS, 
  MOCK_6_OBJECT_PANEL, 
  MOCK_EMERGENCY_VEHICLES, 
  MOCK_DETECTION_HISTORY 
} from '../../data/aiDetectionData';
import { AICameraNode } from '../../types/aiDetection';
import { LiveDetectionGrid } from '../../components/traffic/LiveDetectionGrid';
import { AIDetectionDetailsModal } from '../../components/traffic/AIDetectionDetailsModal';
import { SmartTrafficSignalPanel } from '../../components/traffic/SmartTrafficSignalPanel';
import { ObjectDetectionPanel } from '../../components/traffic/ObjectDetectionPanel';
import { EmergencyVehiclePanel } from '../../components/traffic/EmergencyVehiclePanel';
import { DetectionHistoryTable } from '../../components/traffic/DetectionHistoryTable';
import { Button } from '../../components/ui/Button';
import { Radio, RefreshCw, Eye } from 'lucide-react';

export const AIDetectionCenterPage: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<AICameraNode | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const signalRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleOpenHistory = (cameraId: string) => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-brand-400 animate-ping" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              AI Detection Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time AI object detection, smart traffic signal control, emergency priority, and event telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => signalRef.current?.scrollIntoView({ behavior: 'smooth' })}
            leftIcon={<Radio className="w-4 h-4 text-amber-400" />}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
          >
            Signal Control
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRefresh}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            className="shadow-lg shadow-brand-500/20 text-xs font-bold"
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* SECTION 1: LIVE AI DETECTION CAMERA GRID */}
      <LiveDetectionGrid
        cameras={MOCK_12_AI_CAMERAS}
        onSelectCamera={(cam) => setSelectedCamera(cam)}
        onOpenHistory={handleOpenHistory}
      />

      {/* SECTION 2: SMART TRAFFIC SIGNAL CONTROLLER */}
      <div ref={signalRef}>
        <SmartTrafficSignalPanel />
      </div>

      {/* SECTION 3: AI OBJECT DETECTION DASHBOARD */}
      <ObjectDetectionPanel categories={MOCK_6_OBJECT_PANEL} />

      {/* SECTION 4: EMERGENCY VEHICLE PRIORITY SYSTEM */}
      <EmergencyVehiclePanel vehicles={MOCK_EMERGENCY_VEHICLES} />

      {/* SECTION 5: AI DETECTION EVENT LOGS */}
      <div ref={historyRef}>
        <DetectionHistoryTable historyItems={MOCK_DETECTION_HISTORY} />
      </div>

      {/* Camera Preview HUD Modal */}
      <AIDetectionDetailsModal
        camera={selectedCamera}
        onClose={() => setSelectedCamera(null)}
      />

    </div>
  );
};
