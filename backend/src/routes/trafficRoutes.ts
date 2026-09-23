import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

export interface TrafficObservationDTO {
  monitoringPointId: string;
  junctionName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  observedAt: string;
  trafficStatus: 'Normal' | 'Moderate' | 'Heavy';
  congestionLevel: number;
  source: 'Pre-camera traffic observation';
  analysisStatus: 'Traffic analysis available';
  cameraStatus: 'Not connected';
  googleMapsUrl: string;
}

const CONTROLLED_TRAFFIC_OBSERVATIONS: TrafficObservationDTO[] = [
  {
    monitoringPointId: 'UP-TRF-01',
    junctionName: 'NTR Statue Junction / NTR Circle',
    location: 'NTR Statue Junction, Patamata, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.49502, lng: 80.65205 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Moderate',
    congestionLevel: 48,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.49502,80.65205',
  },
  {
    monitoringPointId: 'UP-TRF-02',
    junctionName: 'Control Room Circle',
    location: 'Police Control Room Circle, MG Road, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.51364, lng: 80.62972 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Moderate',
    congestionLevel: 68,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.51364,80.62972',
  },
  {
    monitoringPointId: 'UP-TRF-03',
    junctionName: 'Tammina Poturaju Junction',
    location: 'Tammina Poturaju Junction, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.52308, lng: 80.61802 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Normal',
    congestionLevel: 28,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.52308,80.61802',
  },
  {
    monitoringPointId: 'UP-TRF-04',
    junctionName: 'Benz Circle',
    location: 'Benz Circle Junction, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.49444, lng: 80.66306 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Heavy',
    congestionLevel: 85,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.49444,80.66306',
  },
  {
    monitoringPointId: 'UP-TRF-05',
    junctionName: 'Sitara Junction',
    location: 'Sitara Junction, Vidhyadharapuram, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.52904, lng: 80.60501 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Normal',
    congestionLevel: 35,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.52904,80.60501',
  },
  {
    monitoringPointId: 'UP-TRF-06',
    junctionName: 'Mahanadu Junction',
    location: 'Mahanadu Junction, NH65, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.51103, lng: 80.66205 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Heavy',
    congestionLevel: 74,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.51103,80.66205',
  },
  {
    monitoringPointId: 'UP-TRF-07',
    junctionName: 'Ramavarappadu Junction',
    location: 'Ramavarappadu Ring Junction, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.52560, lng: 80.67720 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Heavy',
    congestionLevel: 78,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.52560,80.67720',
  },
  {
    monitoringPointId: 'UP-TRF-08',
    junctionName: 'Gollapudi Junction',
    location: 'Gollapudi Y Junction, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.54122, lng: 80.59254 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Normal',
    congestionLevel: 32,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.54122,80.59254',
  },
  {
    monitoringPointId: 'UP-TRF-10',
    junctionName: 'Gunadala Bridge Junction',
    location: 'Gunadala Railway Bridge Junction, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.52502, lng: 80.66104 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Moderate',
    congestionLevel: 58,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.52502,80.66104',
  },
  {
    monitoringPointId: 'UP-TRF-11',
    junctionName: 'Auto Nagar Junction',
    location: 'Auto Nagar Main Gate Junction, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.49204, lng: 80.67106 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Moderate',
    congestionLevel: 62,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.49204,80.67106',
  },
  {
    monitoringPointId: 'UP-TRF-12',
    junctionName: 'Ramesh Hospital Junction',
    location: 'Ramesh Hospital Junction, Ring Road, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.50602, lng: 80.65405 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Moderate',
    congestionLevel: 52,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.50602,80.65405',
  },
  {
    monitoringPointId: 'UP-TRF-19',
    junctionName: 'Kanakadurga Flyover / Varadhi Entry',
    location: 'Kanakadurga Flyover Entry, Vijayawada, Andhra Pradesh',
    coordinates: { lat: 16.51278, lng: 80.60389 },
    observedAt: '2026-09-15T08:30:00.000Z',
    trafficStatus: 'Heavy',
    congestionLevel: 82,
    source: 'Pre-camera traffic observation',
    analysisStatus: 'Traffic analysis available',
    cameraStatus: 'Not connected',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16.51278,80.60389',
  },
];

/**
 * GET /api/traffic/observations
 * Returns controlled traffic observations for the 12 Vijayawada traffic monitoring points.
 */
router.get('/observations', authenticateToken, async (_req: AuthRequest, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: CONTROLLED_TRAFFIC_OBSERVATIONS,
    });
  } catch (error) {
    console.error('GET /api/traffic/observations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch traffic observations',
    });
  }
});

export default router;
