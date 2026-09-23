export type TrafficLevel = 'low' | 'moderate' | 'high' | 'critical';
export type CameraStatus = 'online' | 'offline';
export type CameraHealth = 'Optimal' | 'Degraded' | 'Maintenance Required' | 'Offline';
export type CameraType = 
  | 'ANPR / License Plate' 
  | 'Speed Radar 360' 
  | 'Intersection Hawk' 
  | 'PTZ HD Telemetry';

export type IncidentType = 
  | 'Heavy Traffic' 
  | 'Vehicle Breakdown' 
  | 'Signal Failure' 
  | 'Emergency Vehicle Detected' 
  | 'Road Closure';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Active' | 'Investigating' | 'Resolved' | 'Dispatch Sent';

export interface CameraEvent {
  id: string;
  time: string;
  type: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // percentage offset
  y: number; // percentage offset
  width: number;
  height: number;
  type: 'car' | 'truck' | 'bus' | 'motorcycle';
}

export interface TrafficCamera {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: CameraStatus;
  healthStatus: CameraHealth;
  trafficLevel: TrafficLevel;
  vehicleCount: number; // vehicles per hour
  avgSpeed: number; // km/h
  todayVehicles: number;
  lastUpdated: string;
  aiDetectionStatus: string;
  trafficDensity: number; // 0 - 100 percentage
  installationDate: string;
  cameraType: CameraType;
  imageUrl: string;
  lat: number;
  lng: number;
  resolution: string;
  ipAddress: string;
  firmware: string;
  recentEvents: CameraEvent[];
  simulatedBoxes: BoundingBox[];
}

export interface TrafficIncident {
  id: string;
  time: string;
  location: string;
  zone: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  details: string;
  cameraId?: string;
  cameraName?: string;
}

export interface HourlyTrafficData {
  time: string;
  vehicles: number;
  avgSpeed: number;
  density: number;
  congestion: number;
}

export interface PeakHourStat {
  period: string;
  volume: number;
  avgSpeed: number;
  status: string;
}

export interface TrafficOverviewMetrics {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  vehiclesToday: string;
  activeAlerts: number;
  averageSpeed: string;
  peakHour: string;
  currentCongestion: string;
  vehiclesPerMinute: number;
  averageWaitingTime: string;
  signalEfficiency: string;
}
