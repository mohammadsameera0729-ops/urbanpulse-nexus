export type DetectedObjectType = 
  | 'car' 
  | 'bus' 
  | 'truck' 
  | 'motorcycle' 
  | 'bicycle' 
  | 'pedestrian' 
  | 'emergency_vehicle' 
  | 'traffic_cone'
  | 'animal' 
  | 'unknown';

export interface AIDetectionOverview {
  activeAICameras: number;
  vehiclesDetectedToday: string;
  pedestriansDetected: string;
  emergencyVehicles: string;
  accidentsDetected: string;
  averageAIConfidence: string;
}

export interface BoundingBoxDetection {
  id: string;
  label: string;
  confidence: number; // e.g. 0.984
  x: number; // percentage offset
  y: number; // percentage offset
  width: number;
  height: number;
  type: DetectedObjectType;
}

export interface AICameraNode {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: 'online' | 'offline';
  currentDetectionSummary: string;
  vehicleCount: number;
  pedestrianCount: number;
  trafficDensity: number; // percentage
  aiConfidence: number; // percentage (e.g. 98.6%)
  lastDetectionTime: string;
  resolution: string;
  fps: number;
  imageUrl: string;
  simulatedBoxes: BoundingBoxDetection[];
  detectedBreakdown: {
    cars: number;
    buses: number;
    trucks: number;
    motorcycles: number;
    bicycles: number;
    pedestrians: number;
    emergencyVehicles: number;
  };
  signalStatus: string;
  currentSpeed: number; // km/h
  cameraHealth: string;
  signalStrength?: number;
  connectionStatus?: string;
  cameraUptime?: string;
}

export interface ObjectDetectionCategoryCard {
  id: string;
  category: string;
  type: DetectedObjectType;
  count: number;
  confidence: number; // percentage
  trend: string; // e.g. "+3.4% ↑"
  lastDetection: string;
  iconName: string;
  color: string;
}

export interface AccidentDetectionEvent {
  id: string;
  location: string;
  zone: string;
  severity: 'Critical' | 'High' | 'Medium';
  time: string;
  date: string;
  confidence: number;
  recommendedAction: string;
  status: 'Active' | 'Dispatching' | 'Cleared';
  cameraId: string;
}

export interface EmergencyVehicleTelemetry {
  id: string;
  type: 'Ambulance' | 'Fire Truck' | 'Police Vehicle';
  vehicleNumber: string;
  priorityRoute: string;
  greenCorridorStatus: string; // e.g. "LOCKED - Clearway Active"
  eta: string; // e.g. "3 mins 20s"
  signalOverrideStatus: string;
  speed: number;
  destination: string;
  timeDetected: string;
  cameraId: string;
}

export interface AIModelConfig {
  yoloVersion: string;
  modelStatus: string;
  modelAccuracy: string;
  inferenceSpeed: string;
  gpuStatus: string;
  cpuUsage: string;
  memoryUsage: string;
  lastUpdated: string;
}

export interface CameraHealthTelemetry {
  healthPercentage: number;
  fps: number;
  latency: string;
  networkStatus: string;
  storageUsage: string;
  temperature: string;
  powerStatus: string;
}

export interface DetectionHistoryItem {
  id: string;
  time: string;
  date: string;
  cameraId: string;
  cameraName: string;
  objectType: string;
  confidence: number;
  location: string;
  status: string;
}

export interface AISettingsConfig {
  confidenceThreshold: number;
  detectionMode: 'High Precision' | 'High Speed' | 'Balanced';
  vehicleDetection: boolean;
  pedestrianDetection: boolean;
  accidentDetection: boolean;
  emergencyVehicleDetection: boolean;
  enableNotifications: boolean;
  enableRecording: boolean;
}

export interface TrafficSignalJunctionSim {
  id: string;
  name: string;
  location: string;
  currentSignal: 'red' | 'yellow' | 'green';
  countdownSeconds: number;
  queueLengthMeters: number;
  queueVehicleCount: number;
  pedestrianCrossing: 'Active' | 'Hold';
  signalHealth: number;
  trafficDensity: number;
  aiRecommendation: string;
  lastPhaseUpdate: string;
}

export interface FloatingAlertItem {
  id: string;
  title: string;
  type: 'Accident Detected' | 'Heavy Congestion' | 'Wrong Way Vehicle' | 'Illegal Parking' | 'Emergency Vehicle Detected' | 'Signal Failure' | 'Pedestrian Crossing Alert';
  priority: 'Critical' | 'High' | 'Medium';
  location: string;
  time: string;
  confidence: number;
  cameraId?: string;
  dismissed?: boolean;
}
