export type HeatmapTrafficLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'critical';

export type AlertType = 
  | 'Major Accident'
  | 'Heavy Congestion' 
  | 'Signal Failure' 
  | 'Road Blockage' 
  | 'Emergency Vehicle Detected'
  | 'Accident Detected'
  | 'Road Closure'
  | 'Emergency Vehicle Route' 
  | 'Road Construction';

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved';

export type AlertStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Active' | 'Dispatched' | 'Investigating';

export type ImpactLevel = 'Critical' | 'High Impact' | 'Medium Impact' | 'Quick Fix';

export type TimeHorizon = 'today' | 'yesterday' | '7days' | '30days' | '12months';

export interface AIActionRecommendation {
  id: string;
  actionTitle: string;
  confidence: number;
  estimatedResolutionTime: string;
  priority: 'Critical' | 'High' | 'Medium';
  executed?: boolean;
}

export interface TrafficZone {
  id: string;
  name: string;
  code: string;
  trafficLevel: HeatmapTrafficLevel;
  trafficDensity: number; // 0 - 100 percentage
  avgSpeed: number; // km/h
  activeVehicles: number;
  cameraCount: number;
  signalStatus: string;
  healthScore: number; // 0 - 100
  lat: number;
  lng: number;
  primaryCorridor: string;
  peakHour: string;
  aiRecommendation?: string;
}

export interface JunctionAnalytics {
  id: string;
  name: string;
  location: string;
  zone: string;
  vehicleCount: number; // veh / hr
  congestion: number; // percentage
  congestionLevel: 'low' | 'moderate' | 'high' | 'critical';
  avgSpeed: number; // km/h
  waitingTime: number; // seconds
  signalEfficiency: number; // percentage
  trafficHealth: 'Optimal' | 'Degraded' | 'Critical';
  lastUpdated: string;
  laneCount: number;
  signalPhase: string;
  cameraCount: number;
  vehicleQueueMeters?: number;
  currentSignalStatus?: 'red' | 'yellow' | 'green';
  recommendedSignalTiming?: string;
  nearbyIncidentsCount?: number;
  aiRecommendation?: string;
  imageUrl?: string;
}

export interface SmartAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  location: string;
  zone: string;
  time: string;
  date: string;
  status: AlertStatus;
  recommendedAction: string;
  impactScore: ImpactLevel;
  affectedLanes?: number;
  cameraId?: string;
  junctionId?: string;
  // Part 4 extended fields
  recommendations?: AIActionRecommendation[];
  lat?: number;
  lng?: number;
  nearbyJunction?: string;
  affectedRoad?: string;
  trafficStatus?: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  timeSinceReported?: string;
  estimatedResolutionTime?: string;
  currentProgress?: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'Signal Timing' | 'Police Dispatch' | 'Flow Prediction' | 'Delay Analysis' | 'Volume Spike' | 'Road Hazard';
  impactLevel: ImpactLevel;
  confidenceScore: number; // percentage (e.g. 98.4%)
  recommendedAction: string;
  location: string;
  timestamp: string;
  status: 'Active' | 'Applied' | 'Dismissed';
}

export interface AIOperationalRecommendation {
  id: string;
  type: 'Signal Timing Optimization' | 'Emergency Vehicle Priority' | 'Traffic Route Diversion' | 'Incident Response';
  priority: 'Critical Priority' | 'High Priority' | 'Medium Priority';
  affectedLocation: string; // Affected Junction / Road / Incident Location
  reason: string; // Reason / ETA / Congested Road
  detailParam?: string; // e.g. Suggested Alternate Route / Responsible Dept
  confidenceScore: number; // percentage
  recommendedAction: string;
  applied?: boolean;
  metaBadge?: string; // e.g. "LOCKED - Pre-emptive Green Signal Active" or "Expected -28% Delay"
}

export interface VehicleTypeBreakdown {
  type: string;
  percentage: number;
  count: number;
  color: string;
}

export interface HistoricalComparisonStat {
  label: string;
  currentValue: string | number;
  previousValue: string | number;
  changePercentage: number;
  isPositiveTrend: boolean;
  unit?: string;
}

export interface TrafficReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Daily Executive' | 'Congestion Analysis' | 'Incident Summary' | 'Signal Performance' | 'Environmental Impact';
  generatedDate?: string;
  fileSize?: string;
  downloadUrl?: string;
  pageCount?: number;
  estimatedPages?: number;
  fileFormat?: string;
  lastGenerated?: string;
}
