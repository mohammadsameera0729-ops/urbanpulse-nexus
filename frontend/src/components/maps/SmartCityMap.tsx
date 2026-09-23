import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getGoogleMapsUrl, getStatusBadgeStyle } from '../../utils/formatters';
import { fetchTrafficObservations } from '../../services/trafficObservationService';
import { TrafficObservation } from '../../types/trafficCongestion';

// Custom Marker Constructor for Traffic Monitoring Points
const createTrafficMarkerIcon = (status: string) => {
  let color = '#22c55e'; // Normal -> Green
  let shadow = 'rgba(34, 197, 94, 0.4)';
  if (status === 'Heavy') {
    color = '#ef4444'; // Heavy -> Red
    shadow = 'rgba(239, 68, 68, 0.4)';
  } else if (status === 'Moderate') {
    color = '#f59e0b'; // Moderate -> Amber/Yellow
    shadow = 'rgba(245, 158, 11, 0.4)';
  }

  return L.divIcon({
    className: 'custom-traffic-marker',
    html: `
      <div style="
        position: relative;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: ${shadow};
        "></div>
        <div style="
          position: relative;
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 5px; height: 5px; border-radius: 50%; background-color: white;"></div>
        </div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
};

// Complaint Marker Constructor
const createComplaintMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const redIcon = createComplaintMarkerIcon('#ef4444');
const amberIcon = createComplaintMarkerIcon('#f59e0b');
const blueIcon = createComplaintMarkerIcon('#3b82f6');

// Helper to remove Leaflet branding attribution prefix
const RemoveLeafletPrefix: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    if (map.attributionControl) {
      map.attributionControl.setPrefix(false);
    }
  }, [map]);
  return null;
};

// Helper component to auto-fit map bounds to all points
const AutoFitBounds: React.FC<{ coords: [number, number][] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, coords]);
  return null;
};

export interface SmartCityMapProps {
  height?: string;
  showTrafficSensors?: boolean;
  showComplaints?: boolean;
  selectedComplaintId?: string;
}

export const SmartCityMap: React.FC<SmartCityMapProps> = ({
  height = '500px',
  showTrafficSensors = false,
  showComplaints = true,
}) => {
  const { theme } = useTheme();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [trafficObservations, setTrafficObservations] = useState<TrafficObservation[]>([]);

  // Default Map center: Vijayawada, Andhra Pradesh
  const center: [number, number] = [16.513, 80.640];

  // Fetch Complaints if enabled
  useEffect(() => {
    if (!showComplaints) return;

    let isMounted = true;
    const fetchComplaintsData = async () => {
      try {
        const token = localStorage.getItem('urbanpulse_auth_token') || sessionStorage.getItem('urbanpulse_auth_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch('http://localhost:5000/api/admin/complaints', { method: 'GET', headers });
        if (!response.ok) {
          response = await fetch('http://localhost:5000/api/staff/complaints', { method: 'GET', headers });
        }
        if (!response.ok) {
          response = await fetch('http://localhost:5000/api/complaints', { method: 'GET', headers });
        }

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.complaints) && isMounted) {
            setComplaints(data.complaints);
          }
        }
      } catch (error) {
        // Fallback safely if API call fails
      }
    };

    fetchComplaintsData();
    return () => {
      isMounted = false;
    };
  }, [showComplaints]);

  // Fetch Traffic Observations if enabled
  useEffect(() => {
    if (!showTrafficSensors) return;

    let isMounted = true;
    const loadTraffic = async () => {
      const obs = await fetchTrafficObservations();
      if (isMounted) {
        setTrafficObservations(obs);
      }
    };

    loadTraffic();
    return () => {
      isMounted = false;
    };
  }, [showTrafficSensors]);

  // Collect all traffic coordinates for auto-fitting bounds
  const trafficCoords = useMemo<[number, number][]>(() => {
    if (!showTrafficSensors || !trafficObservations.length) return [];
    return trafficObservations
      .filter((obs) => typeof obs.coordinates?.lat === 'number' && typeof obs.coordinates?.lng === 'number')
      .map((obs) => [obs.coordinates.lat, obs.coordinates.lng] as [number, number]);
  }, [showTrafficSensors, trafficObservations]);

  return (
    <div style={{ height }} className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <RemoveLeafletPrefix />
        {trafficCoords.length > 0 && <AutoFitBounds coords={trafficCoords} />}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 12 Traffic Monitoring Point Markers */}
        {showTrafficSensors &&
          trafficObservations.map((obs) => {
            const hasLat = typeof obs.coordinates?.lat === 'number' && !isNaN(obs.coordinates.lat);
            const hasLng = typeof obs.coordinates?.lng === 'number' && !isNaN(obs.coordinates.lng);
            if (!hasLat || !hasLng) return null;

            const position: [number, number] = [obs.coordinates.lat, obs.coordinates.lng];
            const markerIcon = createTrafficMarkerIcon(obs.trafficStatus);
            const googleUrl = obs.googleMapsUrl || getGoogleMapsUrl(obs.coordinates.lat, obs.coordinates.lng, obs.location);

            return (
              <Marker key={obs.monitoringPointId} position={position} icon={markerIcon}>
                <Popup>
                  <div className="p-3 min-w-[240px] max-w-[280px] font-sans">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-1.5 mb-2">
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        {obs.monitoringPointId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          obs.trafficStatus === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : obs.trafficStatus === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {obs.trafficStatus} Traffic
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {obs.junctionName}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                      {obs.location}
                    </p>

                    {typeof obs.congestionLevel === 'number' && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Congestion Index</span>
                        <span className="font-mono font-black text-slate-900 dark:text-white">{obs.congestionLevel}%</span>
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-[11px] transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Complaint Markers fetched from MongoDB API */}
        {showComplaints &&
          complaints.map((item) => {
            const hasLat = typeof item.latitude === 'number' && !isNaN(item.latitude) && item.latitude !== 0;
            const hasLng = typeof item.longitude === 'number' && !isNaN(item.longitude) && item.longitude !== 0;

            const hasObjLat = typeof item.location?.lat === 'number' && !isNaN(item.location.lat) && item.location.lat !== 0;
            const hasObjLng = typeof item.location?.lng === 'number' && !isNaN(item.location.lng) && item.location.lng !== 0;

            let coords: [number, number] | null = null;
            if (hasLat && hasLng) {
              coords = [item.latitude, item.longitude];
            } else if (hasObjLat && hasObjLng) {
              coords = [item.location.lat, item.location.lng];
            }

            if (!coords) return null;

            const priority = item.priority || 'medium';
            const icon = priority === 'critical' ? redIcon : priority === 'high' ? amberIcon : blueIcon;
            const statusStr = item.status ? String(item.status).replace('_', ' ') : 'Submitted';
            const deptName = item.assignedDepartment || item.department?.name || item.department || 'Municipal Services';

            return (
              <Marker
                key={item._id || item.id || item.ticketId}
                position={coords}
                icon={icon}
              >
                <Popup>
                  <div className="p-3 min-w-[220px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Ticket #{item.ticketId || String(item._id).slice(-6).toUpperCase()}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1">{item.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusBadgeStyle(item.status || 'submitted')}`}>
                        {statusStr}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{deptName}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};
