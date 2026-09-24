import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { 
  MapPin, 
  Navigation, 
  ChevronDown,
  X,
  Building,
  User,
  Search
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getStatusBadgeStyle, openGoogleMaps, resolveVijayawadaLocationFrontend } from '../../utils/formatters';
import { ComplaintStatus } from '../../types';

import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';

// Smooth Map Pan / FlyTo Helper Component
const MapFlyTo: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Automatic Leaflet Container Resize Fix
const MapResizeFix: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Remove Leaflet Prefix from Attribution
const RemoveLeafletPrefix: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    if (map.attributionControl) {
      map.attributionControl.setPrefix(false);
    }
  }, [map]);
  return null;
};

// Custom Leaflet Div Icon Generator
const createDIVIcon = (color: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-unified-gis-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 13px;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const complaintIconCritical = createDIVIcon('#ef4444', '📍');
const complaintIconHigh = createDIVIcon('#f59e0b', '📍');
const complaintIconNormal = createDIVIcon('#3b82f6', '📍');

interface MappedComplaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: string;
  location: string;
  assignedDepartment: string;
  assignedAgent: string;
  citizenName: string;
  createdAt: string;
  lat?: number;
  lng?: number;
  hasValidCoords: boolean;
}

export const InteractiveMapPage: React.FC = () => {
  const { user, token: authToken } = useAuth();
  const [searchParams] = useSearchParams();
  const targetComplaintId = searchParams.get('complaintId');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Map state & selection
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.5062, 80.6480]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [complaints, setComplaints] = useState<MappedComplaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<MappedComplaint | null>(null);

  // Fetch real complaints dynamically based on user role (Admin vs Citizen)
  useEffect(() => {
    let isMounted = true;
    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const token = authToken || localStorage.getItem('urbanpulse_auth_token') || sessionStorage.getItem('urbanpulse_auth_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const endpoint = user?.role === 'admin'
          ? `${API_BASE_URL}/admin/complaints`
          : user?.role === 'staff'
          ? `${API_BASE_URL}/staff/complaints`
          : `${API_BASE_URL}/complaints`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.complaints) && isMounted) {
            const mappedList: MappedComplaint[] = data.complaints.map((item: any) => {
              const locStr = typeof item.location === 'string'
                ? item.location
                : (item.location?.address || item.location?.name || 'Vijayawada');

              const hasStoredLat = typeof item.latitude === 'number' && !isNaN(item.latitude) && item.latitude !== 0;
              const hasStoredLng = typeof item.longitude === 'number' && !isNaN(item.longitude) && item.longitude !== 0;

              const hasObjLat = typeof item.location?.lat === 'number' && !isNaN(item.location.lat) && item.location.lat !== 0;
              const hasObjLng = typeof item.location?.lng === 'number' && !isNaN(item.location.lng) && item.location.lng !== 0;

              const resolvedFallback = resolveVijayawadaLocationFrontend(locStr);
              const lat: number = hasStoredLat ? item.latitude : (hasObjLat ? item.location.lat : resolvedFallback.lat);
              const lng: number = hasStoredLng ? item.longitude : (hasObjLng ? item.location.lng : resolvedFallback.lng);

              const hasValidCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

              const validStatus: ComplaintStatus = (item.status && ['pending', 'in_progress', 'under_review', 'resolved', 'rejected'].includes(item.status))
                ? (item.status as ComplaintStatus)
                : 'pending';

              return {
                id: item._id || item.id,
                ticketId: item.ticketId || `UPN-${String(item._id || item.id).slice(-6).toUpperCase()}`,
                title: item.title || 'Civic Infrastructure Complaint',
                description: item.description || '',
                category: item.category || 'General',
                status: validStatus,
                priority: item.priority || 'medium',
                location: locStr,
                assignedDepartment: item.assignedDepartment || 'Unassigned',
                assignedAgent: item.assignedAgent || 'Unassigned',
                citizenName: item.citizen?.fullName || item.citizen?.name || 'Citizen User',
                createdAt: item.createdAt || new Date().toISOString(),
                lat,
                lng,
                hasValidCoords,
              };
            });
            setComplaints(mappedList);

            if (targetComplaintId && mappedList.length > 0) {
              const target = mappedList.find((c) => c.id === targetComplaintId || c.ticketId === targetComplaintId);
              if (target) {
                setSelectedComplaint(target);
                if (target.hasValidCoords && target.lat !== undefined && target.lng !== undefined) {
                  setMapCenter([target.lat, target.lng]);
                  setMapZoom(15);
                }
              }
            }
          }
        }
      } catch (err) {
        // Fallback safely if backend is unreachable
      } finally {
        if (isMounted) setLoadingComplaints(false);
      }
    };

    fetchComplaints();
    return () => {
      isMounted = false;
    };
  }, [targetComplaintId, user?.role]);

  const handleSelectComplaint = (c: MappedComplaint) => {
    setSelectedComplaint(c);
    if (c.hasValidCoords && typeof c.lat === 'number' && typeof c.lng === 'number') {
      setMapCenter([c.lat, c.lng]);
      setMapZoom(15);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      c.ticketId.toLowerCase().includes(search) ||
      c.title.toLowerCase().includes(search) ||
      c.category.toLowerCase().includes(search) ||
      c.location.toLowerCase().includes(search) ||
      c.assignedDepartment.toLowerCase().includes(search) ||
      c.assignedAgent.toLowerCase().includes(search);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Auto-focus map when search yields exactly 1 matching complaint with valid coordinates
  useEffect(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed !== '') {
      const validFiltered = filteredComplaints.filter((c) => c.hasValidCoords && typeof c.lat === 'number' && typeof c.lng === 'number');
      if (validFiltered.length === 1) {
        const singleMatch = validFiltered[0];
        if (selectedComplaint?.id !== singleMatch.id) {
          setSelectedComplaint(singleMatch);
          setMapCenter([singleMatch.lat!, singleMatch.lng!]);
          setMapZoom(15);
        }
      }
    }
  }, [searchTerm, statusFilter, complaints]);

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Smart City GIS Map
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-950 text-brand-400 border border-brand-500/40">
                Vijayawada Location Center
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Geospatial view of active citizen complaints mapped directly across Vijayawada.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Map (Span 7) & Complaint Records Panel (Span 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MAP SECTION (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Vijayawada GIS Map
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {filteredComplaints.filter((c) => c.hasValidCoords).length} Mapped Incidents
              </span>
            </div>

            {/* Standard OpenStreetMap Container */}
            <div className="h-[640px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner relative">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', backgroundColor: '#090d16' }}
              >
                <RemoveLeafletPrefix />
                <MapFlyTo center={mapCenter} zoom={mapZoom} />
                <MapResizeFix />

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Complaint Markers */}
                {filteredComplaints.map((c) => {
                  if (!c.hasValidCoords || typeof c.lat !== 'number' || typeof c.lng !== 'number') {
                    return null;
                  }

                  const icon = c.priority === 'critical' ? complaintIconCritical : c.priority === 'high' ? complaintIconHigh : complaintIconNormal;

                  return (
                    <Marker 
                      key={c.id} 
                      position={[c.lat, c.lng]} 
                      icon={icon}
                      ref={(markerRef) => {
                        if (markerRef && selectedComplaint?.id === c.id) {
                          markerRef.openPopup();
                        }
                      }}
                      eventHandlers={{
                        click: () => handleSelectComplaint(c),
                      }}
                    >
                      <Popup>
                        <div className="p-2.5 min-w-[210px] text-xs font-sans">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                            <span className="font-mono font-bold text-brand-600 text-[10px]">#{c.ticketId}</span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${getStatusBadgeStyle(c.status)}`}>
                              {c.status.replace('_', ' ')}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 mt-1.5">{c.title}</h4>
                          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">📍 {c.location}</p>
                          <p className="text-[10px] text-slate-500 mt-1">Dept: {c.assignedDepartment}</p>
                          <p className="text-[10px] text-slate-500">Staff: {c.assignedAgent}</p>
                          {c.hasValidCoords && (
                            <button
                              type="button"
                              onClick={() => openGoogleMaps(c.lat, c.lng, c.location)}
                              className="mt-2 w-full py-1 text-[10px] font-bold text-white bg-brand-600 rounded hover:bg-brand-700 transition-colors"
                            >
                              Open in Google Maps ↗
                            </button>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Map Legend overlay */}
              <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-[10px] text-slate-300 space-y-1 shadow-lg pointer-events-auto">
                <div className="flex items-center gap-1.5">
                  <span>📍</span> <span>Active Complaint Marker</span>
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* SIDE PANEL: ACTIVE COMPLAINT LOCATIONS (Span 5) */}
        <div className="lg:col-span-5 space-y-6">

          <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                Active Complaint Locations
              </h3>
              <span className="text-xs font-mono text-brand-400 font-bold bg-brand-950 px-2 py-0.5 rounded border border-brand-500/40">
                {filteredComplaints.length} Complaints
              </span>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Complaint items list */}
            {loadingComplaints ? (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">
                Loading complaint map data...
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">
                No matching complaints found.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredComplaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;

                  return (
                    <motion.div
                      key={c.id}
                      onClick={() => handleSelectComplaint(c)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-brand-950/70 via-slate-900 to-slate-900 border-brand-500 shadow-lg shadow-brand-500/10'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-brand-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              #{c.ticketId}
                            </span>
                            <h4 className="text-xs font-bold text-white">{c.title}</h4>
                          </div>

                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
                            {c.category}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border shrink-0 ${getStatusBadgeStyle(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                          <strong className="text-white font-medium">Location:</strong>
                          <span className="truncate">{c.location}</span>
                        </p>

                        <p className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-400">Department:</span>
                          <span className="text-slate-200 font-medium">{c.assignedDepartment}</span>
                        </p>

                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-400">Assigned Staff:</span>
                          <span className="text-emerald-400 font-semibold">{c.assignedAgent}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                        <span className="text-slate-500 font-mono">Priority: <strong className="uppercase text-slate-300">{c.priority}</strong></span>
                        {c.hasValidCoords ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openGoogleMaps(c.lat, c.lng, c.location);
                            }}
                            className="text-brand-400 font-bold text-[10px] hover:underline flex items-center gap-1"
                          >
                            Open in Google Maps ↗
                          </button>
                        ) : (
                          <span className="text-amber-400/90 font-medium text-[10px]">Location Text Only (Unmapped)</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>

        </div>

      </div>

      {/* DETAIL FOCUS DRAWER FOR COMPLAINT */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#111827] border-l border-slate-800 shadow-2xl flex flex-col justify-between z-50 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-400">
                    Ticket #{selectedComplaint.ticketId}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedComplaint.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complaint Description</span>
                  <p className="text-slate-200 leading-relaxed font-medium">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Status</span>
                    <div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getStatusBadgeStyle(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Priority</span>
                    <p className="font-bold uppercase text-amber-400">{selectedComplaint.priority}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location & Assignment</span>
                  
                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block">Location Address</span>
                          <span className="font-medium text-white">{selectedComplaint.location}</span>
                        </div>
                      </div>
                      {selectedComplaint.hasValidCoords && (
                        <button
                          type="button"
                          onClick={() => openGoogleMaps(selectedComplaint.lat, selectedComplaint.lng, selectedComplaint.location)}
                          className="px-2.5 py-1 text-[11px] font-bold text-brand-400 hover:underline border border-brand-500/30 rounded bg-brand-950/40 shrink-0"
                        >
                          Open in Google Maps ↗
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                      <Building className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Department</span>
                        <span className="font-medium text-white">{selectedComplaint.assignedDepartment}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                      <User className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Assigned Staff</span>
                        <span className="font-semibold text-emerald-400">{selectedComplaint.assignedAgent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InteractiveMapPage;
