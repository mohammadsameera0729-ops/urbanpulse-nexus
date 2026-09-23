export type IncidentType = 'Accident / Collision' | 'Road Obstruction' | 'Stopped / Disabled Vehicle';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Active' | 'Monitoring' | 'Resolved';

export interface TrafficIncident {
  id: string;
  monitoringPointId: string;
  locationName: string;
  location: string;
  latitude: number;
  longitude: number;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  source: 'Pre-camera incident observation';
  detectedAt: string;
  updatedAt: string;
  googleMapsUrl: string;
}

export interface IncidentClassificationResult {
  severityBadgeClass: string;
  statusBadgeClass: string;
  categoryIconColor: string;
  impactSummary: string;
}
