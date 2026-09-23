import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

export interface TrafficIncidentDTO {
  id: string;
  monitoringPointId: string;
  locationName: string;
  location: string;
  latitude: number;
  longitude: number;
  incidentType: 'Accident / Collision' | 'Road Obstruction' | 'Stopped / Disabled Vehicle';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Monitoring' | 'Resolved';
  description: string;
  source: 'Pre-camera incident observation';
  detectedAt: string;
  updatedAt: string;
  googleMapsUrl: string;
}

const CONTROLLED_TRAFFIC_INCIDENTS: TrafficIncidentDTO[] = [
  {
    id: 'INC-TRF-01',
    monitoringPointId: 'UP-TRF-04',
    locationName: 'Benz Circle',
    location: 'Benz Circle Junction, Vijayawada, Andhra Pradesh',
    latitude: 16.49444,
    longitude: 80.66306,
    incidentType: 'Accident / Collision',
    severity: 'High',
    status: 'Active',
    description: 'Two-vehicle collision near highway flyover ramp causing right-lane bottleneck.',
    source: 'Pre-camera incident observation',
    detectedAt: '2026-09-15T08:15:00.000Z',
    updatedAt: '2026-09-15T08:25:00.000Z',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.49444,80.66306',
  },
  {
    id: 'INC-TRF-02',
    monitoringPointId: 'UP-TRF-07',
    locationName: 'Ramavarappadu Junction',
    location: 'Ramavarappadu Ring Junction, Vijayawada, Andhra Pradesh',
    latitude: 16.52560,
    longitude: 80.67720,
    incidentType: 'Road Obstruction',
    severity: 'Critical',
    status: 'Active',
    description: 'Fallen freight container blocking right turn lane towards Eluru Road corridor.',
    source: 'Pre-camera incident observation',
    detectedAt: '2026-09-15T07:45:00.000Z',
    updatedAt: '2026-09-15T08:20:00.000Z',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.52560,80.67720',
  },
  {
    id: 'INC-TRF-03',
    monitoringPointId: 'UP-TRF-02',
    locationName: 'Control Room Circle',
    location: 'Police Control Room Circle, MG Road, Vijayawada, Andhra Pradesh',
    latitude: 16.51364,
    longitude: 80.62972,
    incidentType: 'Stopped / Disabled Vehicle',
    severity: 'Medium',
    status: 'Monitoring',
    description: 'Stalled municipal bus in central lane; traffic diverted around circle approach.',
    source: 'Pre-camera incident observation',
    detectedAt: '2026-09-15T08:00:00.000Z',
    updatedAt: '2026-09-15T08:28:00.000Z',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.51364,80.62972',
  },
  {
    id: 'INC-TRF-04',
    monitoringPointId: 'UP-TRF-06',
    locationName: 'Mahanadu Junction',
    location: 'Mahanadu Junction, NH65, Vijayawada, Andhra Pradesh',
    latitude: 16.51103,
    longitude: 80.66205,
    incidentType: 'Road Obstruction',
    severity: 'Low',
    status: 'Monitoring',
    description: 'Construction material spilled on shoulder lane near NH65 slip road.',
    source: 'Pre-camera incident observation',
    detectedAt: '2026-09-15T07:30:00.000Z',
    updatedAt: '2026-09-15T08:10:00.000Z',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.51103,80.66205',
  },
  {
    id: 'INC-TRF-05',
    monitoringPointId: 'UP-TRF-19',
    locationName: 'Kanakadurga Flyover / Varadhi Entry',
    location: 'Kanakadurga Flyover Entry, Vijayawada, Andhra Pradesh',
    latitude: 16.51278,
    longitude: 80.60389,
    incidentType: 'Accident / Collision',
    severity: 'High',
    status: 'Resolved',
    description: 'Minor rear-end collision on flyover approach ramp; cleared by traffic patrol.',
    source: 'Pre-camera incident observation',
    detectedAt: '2026-09-15T06:50:00.000Z',
    updatedAt: '2026-09-15T07:40:00.000Z',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.51278,80.60389',
  },
];

/**
 * GET /api/traffic/incidents
 * Returns controlled traffic incident observations associated ONLY with the 12 Vijayawada monitoring points.
 */
router.get('/incidents', authenticateToken, async (_req: AuthRequest, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: CONTROLLED_TRAFFIC_INCIDENTS,
    });
  } catch (error) {
    console.error('GET /api/traffic/incidents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch traffic incidents',
    });
  }
});

export default router;
