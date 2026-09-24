import { TrafficObservation } from '../types/trafficCongestion';
import { getGoogleMapsUrl } from '../utils/formatters';
import { API_BASE_URL } from '../config/api';

const FALLBACK_TRAFFIC_OBSERVATIONS: TrafficObservation[] = [
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
    googleMapsUrl: getGoogleMapsUrl(16.49502, 80.65205, 'NTR Statue Junction, Patamata, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.51364, 80.62972, 'Police Control Room Circle, MG Road, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.52308, 80.61802, 'Tammina Poturaju Junction, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.49444, 80.66306, 'Benz Circle Junction, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.52904, 80.60501, 'Sitara Junction, Vidhyadharapuram, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.51103, 80.66205, 'Mahanadu Junction, NH65, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.52560, 80.67720, 'Ramavarappadu Ring Junction, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.54122, 80.59254, 'Gollapudi Y Junction, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.52502, 80.66104, 'Gunadala Railway Bridge Junction, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.49204, 80.67106, 'Auto Nagar Main Gate Junction, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.50602, 80.65405, 'Ramesh Hospital Junction, Ring Road, Vijayawada, Andhra Pradesh'),
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
    googleMapsUrl: getGoogleMapsUrl(16.51278, 80.60389, 'Kanakadurga Flyover Entry, Vijayawada, Andhra Pradesh'),
  },
];

export async function fetchTrafficObservations(token?: string | null): Promise<TrafficObservation[]> {
  const authToken =
    token ||
    localStorage.getItem('urbanpulse_auth_token') ||
    sessionStorage.getItem('urbanpulse_auth_token');

  if (!authToken) {
    return FALLBACK_TRAFFIC_OBSERVATIONS;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/traffic/observations`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Error fetching traffic observations from backend, using observation service fallback:', err);
  }

  return FALLBACK_TRAFFIC_OBSERVATIONS;
}
