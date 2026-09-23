export type TrafficStatus = 'Normal' | 'Moderate' | 'Heavy';

export interface TrafficObservation {
  monitoringPointId: string;
  junctionName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  observedAt: string;
  trafficStatus: TrafficStatus;
  congestionLevel: number;
  source: 'Pre-camera traffic observation' | 'Live camera feed' | string;
  analysisStatus: 'Traffic analysis available' | string;
  cameraStatus: 'Not connected' | 'Connected' | string;
  googleMapsUrl: string;
}

export interface CongestionClassificationResult {
  status: TrafficStatus;
  badgeClass: string;
  severityLabel: string;
  description: string;
}
