import React from 'react';
import { Card } from '../../components/ui/Card';
import { 
  MapPin, 
  CheckCircle2, 
  Info,
  Building2,
  VideoOff,
  Video,
  Calendar,
  Layers
} from 'lucide-react';
import { SmartCityMap } from '../../components/maps/SmartCityMap';
import { getGoogleMapsUrl } from '../../utils/formatters';
import { TrafficCongestionDetectionModule } from '../../components/traffic/TrafficCongestionDetectionModule';
import { LocalWebcamDemo } from '../../components/traffic/LocalWebcamDemo';

interface LocationPoint {
  id: string;
  name: string;
  location: string;
  type: 'Traffic Hotspot' | 'Official Live Camera';
  category?: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  streamUrl?: string;
}

export const VIJAYAWADA_TRAFFIC_MONITORING_POINTS: LocationPoint[] = [
  {
    id: 'UP-TRF-01',
    name: 'NTR Statue Junction / NTR Circle',
    location: 'NTR Statue Junction, Patamata, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.49502, lng: 80.65205 },
    googleMapsUrl: getGoogleMapsUrl(16.49502, 80.65205, 'NTR Statue Junction, Patamata, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-02',
    name: 'Control Room Circle',
    location: 'Police Control Room Circle, MG Road, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.51364, lng: 80.62972 },
    googleMapsUrl: getGoogleMapsUrl(16.51364, 80.62972, 'Police Control Room Circle, MG Road, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-03',
    name: 'Tammina Poturaju Junction',
    location: 'Tammina Poturaju Junction, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.52308, lng: 80.61802 },
    googleMapsUrl: getGoogleMapsUrl(16.52308, 80.61802, 'Tammina Poturaju Junction, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-04',
    name: 'Benz Circle',
    location: 'Benz Circle Junction, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.49444, lng: 80.66306 },
    googleMapsUrl: getGoogleMapsUrl(16.49444, 80.66306, 'Benz Circle Junction, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-05',
    name: 'Sitara Junction',
    location: 'Sitara Junction, Vidhyadharapuram, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.52904, lng: 80.60501 },
    googleMapsUrl: getGoogleMapsUrl(16.52904, 80.60501, 'Sitara Junction, Vidhyadharapuram, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-06',
    name: 'Mahanadu Junction',
    location: 'Mahanadu Junction, NH65, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.51103, lng: 80.66205 },
    googleMapsUrl: getGoogleMapsUrl(16.51103, 80.66205, 'Mahanadu Junction, NH65, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-07',
    name: 'Ramavarappadu Junction',
    location: 'Ramavarappadu Ring Junction, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.52560, lng: 80.67720 },
    googleMapsUrl: getGoogleMapsUrl(16.52560, 80.67720, 'Ramavarappadu Ring Junction, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-08',
    name: 'Gollapudi Junction',
    location: 'Gollapudi Y Junction, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.54122, lng: 80.59254 },
    googleMapsUrl: getGoogleMapsUrl(16.54122, 80.59254, 'Gollapudi Y Junction, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-10',
    name: 'Gunadala Bridge Junction',
    location: 'Gunadala Railway Bridge Junction, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.52502, lng: 80.66104 },
    googleMapsUrl: getGoogleMapsUrl(16.52502, 80.66104, 'Gunadala Railway Bridge Junction, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-11',
    name: 'Auto Nagar Junction',
    location: 'Auto Nagar Main Gate Junction, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.49204, lng: 80.67106 },
    googleMapsUrl: getGoogleMapsUrl(16.49204, 80.67106, 'Auto Nagar Main Gate Junction, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-12',
    name: 'Ramesh Hospital Junction',
    location: 'Ramesh Hospital Junction, Ring Road, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.50602, lng: 80.65405 },
    googleMapsUrl: getGoogleMapsUrl(16.50602, 80.65405, 'Ramesh Hospital Junction, Ring Road, Vijayawada, Andhra Pradesh'),
  },
  {
    id: 'UP-TRF-19',
    name: 'Kanakadurga Flyover / Varadhi Entry',
    location: 'Kanakadurga Flyover Entry, Vijayawada, Andhra Pradesh',
    type: 'Traffic Hotspot',
    coordinates: { lat: 16.51278, lng: 80.60389 },
    googleMapsUrl: getGoogleMapsUrl(16.51278, 80.60389, 'Kanakadurga Flyover Entry, Vijayawada, Andhra Pradesh'),
  },
];

export const TrafficMonitoringPage: React.FC = () => {
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Traffic Monitoring
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Vijayawada municipal traffic monitoring locations and junction corridors.
          </p>
        </div>

        {/* Dynamic System Date Display */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800/90 text-slate-200 text-xs font-bold font-mono border border-slate-700/80 shadow-md">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>{currentDateStr}</span>
          </div>
        </div>
      </div>

      {/* Prominent Disclaimers */}
      <div className="space-y-3">
        <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-3 shadow-lg">
          <Info className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="text-white font-extrabold uppercase tracking-wide block text-[11px]">Notice</span>
            Traffic monitoring location data only. UrbanPulse does not provide or claim access to live government CCTV feeds.
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 text-slate-300 border border-slate-800 text-xs flex items-center gap-3">
          <VideoOff className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            Public live camera feeds are not available through official public sources.
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Monitoring Points */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Monitoring Points</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{VIJAYAWADA_TRAFFIC_MONITORING_POINTS.length}</span>
        </div>

        {/* Card 2: Registered Corridors */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Monitored Corridors</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
              <Video className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-200 font-mono">{VIJAYAWADA_TRAFFIC_MONITORING_POINTS.length}</span>
        </div>

        {/* Card 3: Traffic Hotspots */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Traffic Hotspots</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">{VIJAYAWADA_TRAFFIC_MONITORING_POINTS.length}</span>
        </div>

        {/* Card 4: Online Feeds */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Online CCTV Streams</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-base font-black text-amber-400 font-mono">
            0 Online Streams
          </span>
        </div>

      </div>

      {/* Primary GIS Visualization: Traffic Infrastructure Command Map */}
      <Card className="p-6 bg-[#111827] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <Layers className="w-5 h-5 text-[#2563EB]" />
              Vijayawada Traffic Infrastructure Map
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              12 Vijayawada traffic monitoring points with congestion classification
            </p>
          </div>

          {/* Compact Traffic Classification Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">Heavy</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] font-bold text-blue-400">
              12 Points
            </span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <SmartCityMap height="550px" showTrafficSensors={true} showComplaints={false} />
        </div>
      </Card>

      {/* Local Development Demo Webcam Section */}
      <LocalWebcamDemo />

      {/* Traffic / Congestion Detection AI Intelligence Module */}
      <TrafficCongestionDetectionModule />

    </div>
  );
};

export default TrafficMonitoringPage;
