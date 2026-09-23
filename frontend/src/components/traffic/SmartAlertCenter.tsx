import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartAlert, AlertType, AlertSeverity, AlertStatus, AIActionRecommendation } from '../../types/trafficIntelligence';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Construction, 
  Siren, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Zap,
  UserCheck,
  Building,
  Activity,
  Sparkles,
  Check,
  Navigation,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const RemoveLeafletPrefix: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    if (map.attributionControl) {
      map.attributionControl.setPrefix(false);
    }
  }, [map]);
  return null;
};

// Leaflet Div Icon Generator for Incident Locations
const createIncidentIcon = (severity: AlertSeverity) => {
  const color = 
    severity === 'Critical' ? '#ef4444' : 
    severity === 'High' ? '#f59e0b' : 
    severity === 'Medium' ? '#eab308' : '#10b981';
  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 15px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const INITIAL_ALERTS: SmartAlert[] = [
  {
    id: 'ALT-101',
    type: 'Major Accident',
    severity: 'Critical',
    location: '7th Ave & Main St Junction',
    zone: 'Zone 1 - Downtown',
    time: '10:42 AM',
    date: '2026-07-27',
    status: 'Pending',
    recommendedAction: 'Dispatch Traffic Police, Notify Ambulance & Divert Traffic',
    impactScore: 'Critical',
    lat: 40.7128,
    lng: -74.0060,
    nearbyJunction: 'JNC-101 (7th Ave & Main St)',
    affectedRoad: 'Main Street Corridor (Northbound)',
    trafficStatus: 'Heavy Gridlock (88% Congestion)',
    assignedDepartment: 'Traffic Police Patrol & Emergency Services',
    assignedOfficer: 'Officer M. Vance (Badge #409)',
    timeSinceReported: '12 mins ago',
    estimatedResolutionTime: '25 mins',
    currentProgress: 35,
    recommendations: [
      { id: 'REC-101-1', actionTitle: 'Dispatch Traffic Police Patrol Unit', confidence: 98.6, estimatedResolutionTime: '10 mins', priority: 'Critical' },
      { id: 'REC-101-2', actionTitle: 'Notify Ambulance Unit AMB-402', confidence: 99.2, estimatedResolutionTime: '8 mins', priority: 'Critical' },
      { id: 'REC-101-3', actionTitle: 'Divert Traffic via 8th Ave Bypass', confidence: 95.4, estimatedResolutionTime: '15 mins', priority: 'High' }
    ]
  },
  {
    id: 'ALT-102',
    type: 'Heavy Congestion',
    severity: 'High',
    location: 'I-95 Expressway Exit 14',
    zone: 'Zone 2 - Highways',
    time: '10:35 AM',
    date: '2026-07-27',
    status: 'In Progress',
    recommendedAction: 'Increase Green Signal Time & Recommend Alternate Route',
    impactScore: 'High Impact',
    lat: 40.7280,
    lng: -73.9940,
    nearbyJunction: 'JNC-102 (Exit 14 Interchange)',
    affectedRoad: 'I-95 Northbound Freight Ramp',
    trafficStatus: 'Severe Bottleneck (94% Density)',
    assignedDepartment: 'Traffic Management Center',
    assignedOfficer: 'Supervisor D. Ross (Badge #210)',
    timeSinceReported: '18 mins ago',
    estimatedResolutionTime: '15 mins',
    currentProgress: 60,
    recommendations: [
      { id: 'REC-102-1', actionTitle: 'Increase Green Signal Time (+18s)', confidence: 98.1, estimatedResolutionTime: '5 mins', priority: 'High' },
      { id: 'REC-102-2', actionTitle: 'Recommend Alternate Route via Industrial Ring', confidence: 94.7, estimatedResolutionTime: '10 mins', priority: 'Medium' }
    ]
  },
  {
    id: 'ALT-103',
    type: 'Signal Failure',
    severity: 'Critical',
    location: 'Wall St & Broadway Crossing',
    zone: 'Zone 1 - Financial District',
    time: '10:20 AM',
    date: '2026-07-27',
    status: 'In Progress',
    recommendedAction: 'Activate Backup Signal & Notify Maintenance Team',
    impactScore: 'Critical',
    lat: 40.7060,
    lng: -74.0090,
    nearbyJunction: 'JNC-103 (Wall St Gateway)',
    affectedRoad: 'Broadway Southbound',
    trafficStatus: 'Intermittent Flow (Manual Override)',
    assignedDepartment: 'Signal Maintenance & Field Ops',
    assignedOfficer: 'Tech Lead A. Chen (Emp #884)',
    timeSinceReported: '24 mins ago',
    estimatedResolutionTime: '10 mins',
    currentProgress: 75,
    recommendations: [
      { id: 'REC-103-1', actionTitle: 'Activate Backup Signal Controller Node', confidence: 97.8, estimatedResolutionTime: '3 mins', priority: 'High' },
      { id: 'REC-103-2', actionTitle: 'Notify Maintenance Emergency Team', confidence: 96.1, estimatedResolutionTime: '20 mins', priority: 'Medium' }
    ]
  },
  {
    id: 'ALT-104',
    type: 'Emergency Vehicle Detected',
    severity: 'High',
    location: 'University Circle & 5th Ave',
    zone: 'Zone 3 - Campus District',
    time: '10:48 AM',
    date: '2026-07-27',
    status: 'Pending',
    recommendedAction: 'Activate Green Corridor & Notify Nearby Junctions',
    impactScore: 'Critical',
    lat: 40.7350,
    lng: -73.9910,
    nearbyJunction: 'JNC-104 (University Roundabout)',
    affectedRoad: '5th Ave Medical Expressway',
    trafficStatus: 'Corridor Lock Priority',
    assignedDepartment: 'Emergency Dispatch',
    assignedOfficer: 'Dispatcher K. Miller',
    timeSinceReported: '4 mins ago',
    estimatedResolutionTime: '5 mins',
    currentProgress: 20,
    recommendations: [
      { id: 'REC-104-1', actionTitle: 'Activate Green Corridor Lock (4 Junctions)', confidence: 99.8, estimatedResolutionTime: '2 mins', priority: 'Critical' },
      { id: 'REC-104-2', actionTitle: 'Notify Nearby Junction Controllers', confidence: 97.5, estimatedResolutionTime: '4 mins', priority: 'High' }
    ]
  },
  {
    id: 'ALT-105',
    type: 'Road Blockage',
    severity: 'Medium',
    location: 'Harbor Bridge Mile 2 West',
    zone: 'Zone 4 - Maritime Corridor',
    time: '10:15 AM',
    date: '2026-07-27',
    status: 'Resolved',
    recommendedAction: 'Dispatch Towing Unit & Clear Right Lane',
    impactScore: 'Medium Impact',
    lat: 40.7020,
    lng: -73.9870,
    nearbyJunction: 'JNC-106 (Bridge Approach)',
    affectedRoad: 'Harbor Bridge Westbound',
    trafficStatus: 'Normalizing (Flow Restored)',
    assignedDepartment: 'Highway Patrol & Towing Unit',
    assignedOfficer: 'Officer S. Gomez (Badge #112)',
    timeSinceReported: '45 mins ago',
    estimatedResolutionTime: '0 mins',
    currentProgress: 100,
    recommendations: [
      { id: 'REC-105-1', actionTitle: 'Dispatch Towing Heavy Unit #04', confidence: 96.5, estimatedResolutionTime: '12 mins', priority: 'Medium', executed: true },
      { id: 'REC-105-2', actionTitle: 'Update VMS Signage to Lane Clear', confidence: 99.1, estimatedResolutionTime: '2 mins', priority: 'Medium', executed: true }
    ]
  }
];

interface SmartAlertCenterProps {
  alerts?: SmartAlert[];
}

export const SmartAlertCenter: React.FC<SmartAlertCenterProps> = ({ alerts: propAlerts }) => {
  const [alertsState, setAlertsState] = useState<SmartAlert[]>(() => {
    return propAlerts && propAlerts.length > 0 ? propAlerts.map((a, idx) => ({
      ...a,
      lat: a.lat || (40.7128 + (idx * 0.008)),
      lng: a.lng || (-74.0060 + (idx * 0.006)),
      nearbyJunction: a.nearbyJunction || `JNC-${100 + idx} (${a.location})`,
      affectedRoad: a.affectedRoad || `${a.location} Corridor`,
      trafficStatus: a.trafficStatus || 'Active Operational Incident',
      assignedDepartment: a.assignedDepartment || 'Traffic Operations Control',
      assignedOfficer: a.assignedOfficer || 'Duty Control Officer',
      timeSinceReported: a.timeSinceReported || a.time || '10 mins ago',
      estimatedResolutionTime: a.estimatedResolutionTime || '15 mins',
      currentProgress: a.currentProgress ?? (a.status === 'Resolved' ? 100 : a.status === 'In Progress' ? 50 : 25),
      recommendations: a.recommendations || [
        { id: `REC-${a.id}-1`, actionTitle: a.recommendedAction, confidence: 98.2, estimatedResolutionTime: '10 mins', priority: a.severity === 'Critical' ? 'Critical' : 'High' }
      ]
    })) : INITIAL_ALERTS;
  });

  const [selectedAlertId, setSelectedAlertId] = useState<string>(INITIAL_ALERTS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  const selectedAlert = useMemo(() => {
    return alertsState.find((a) => a.id === selectedAlertId) || alertsState[0];
  }, [alertsState, selectedAlertId]);

  const filteredAlerts = useMemo(() => {
    return alertsState.filter((alert) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = alert.location.toLowerCase().includes(q) || alert.id.toLowerCase().includes(q) || alert.type.toLowerCase().includes(q);
      const matchesType = typeFilter === 'all' || alert.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [alertsState, searchTerm, typeFilter, severityFilter]);

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'Major Accident':
      case 'Accident Detected':
        return ShieldAlert;
      case 'Heavy Congestion':
        return AlertTriangle;
      case 'Signal Failure':
        return Wrench;
      case 'Road Blockage':
      case 'Road Closure':
      case 'Road Construction':
        return Construction;
      case 'Emergency Vehicle Detected':
      case 'Emergency Vehicle Route':
        return Siren;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40';
      case 'Resolved':
      case 'Low':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'Pending':
      case 'Active':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'In Progress':
      case 'Dispatched':
      case 'Investigating':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const handleExecuteAction = (actionId: string) => {
    setExecutedActions((prev) => ({ ...prev, [actionId]: true }));
  };

  const handleStatusChange = (newStatus: AlertStatus) => {
    setAlertsState((prev) =>
      prev.map((a) => {
        if (a.id === selectedAlertId) {
          const isResolved = newStatus === 'Resolved';
          return {
            ...a,
            status: newStatus,
            severity: isResolved ? 'Resolved' : a.severity,
            currentProgress: isResolved ? 100 : newStatus === 'In Progress' ? 65 : 25
          };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Smart Alert Center (Part 4)
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40">
                {filteredAlerts.length} Active Operational Incidents
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Live critical alerts, AI response execution, incident GIS mapping, and dispatch workflow control.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[210px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alert location or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Alert Type: All</option>
            <option value="Major Accident">Major Accident</option>
            <option value="Heavy Congestion">Heavy Congestion</option>
            <option value="Signal Failure">Signal Failure</option>
            <option value="Road Blockage">Road Blockage</option>
            <option value="Emergency Vehicle Detected">Emergency Vehicle Detected</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Severity: All</option>
            <option value="Critical">Critical (Red)</option>
            <option value="High">High (Orange)</option>
            <option value="Medium">Medium (Yellow)</option>
            <option value="Resolved">Resolved (Green)</option>
          </select>
        </div>
      </div>

      {/* Grid Layout: Section 1 (Left Column) & Sections 2, 3, 4 (Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ====================================================
            SECTION 1: LIVE CRITICAL ALERTS (Span 5)
            ==================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                SECTION 1: Live Critical Alerts
              </h3>
              <span className="text-xs text-slate-400 font-mono font-medium">Select alert to view details</span>
            </div>

            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No alerts match your filter criteria.
                </div>
              ) : (
                filteredAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  const isSelected = alert.id === selectedAlertId;

                  return (
                    <motion.div
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-brand-950/70 via-slate-900 to-slate-900 border-brand-500 shadow-lg shadow-brand-500/10'
                          : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border ${
                            alert.severity === 'Critical' ? 'bg-rose-950/80 text-rose-400 border-rose-500/40' :
                            alert.severity === 'High' ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' :
                            alert.severity === 'Medium' ? 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40' :
                            'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {alert.id}
                              </span>
                              <h4 className="text-xs font-bold text-white">{alert.type}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{alert.location}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getSeverityBadge(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(alert.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {alert.status}
                        </span>

                        <span className="text-[11px] text-brand-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Inspect Alert <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Sections 2, 3 & 4 for Selected Alert (Span 7) */}
        <div className="lg:col-span-7 space-y-6">

          {/* ====================================================
              SECTION 2: AI RECOMMENDED ACTIONS
              ==================================================== */}
          <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
                SECTION 2: AI Recommended Actions
              </h3>
              <span className="text-xs font-mono text-brand-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {selectedAlert.id} • {selectedAlert.type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(selectedAlert.recommendations || []).map((rec) => {
                const isExecuted = executedActions[rec.id] || rec.executed;

                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                          rec.priority === 'Critical' ? 'bg-rose-950 text-rose-400 border-rose-500/40' : 'bg-amber-950 text-amber-400 border-amber-500/40'
                        }`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {rec.confidence}% AI Confidence
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">
                        {rec.actionTitle}
                      </h4>

                      <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Est. Resolution: <strong className="text-slate-300">{rec.estimatedResolutionTime}</strong>
                      </p>
                    </div>

                    <Button
                      variant={isExecuted ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleExecuteAction(rec.id)}
                      className="w-full text-xs font-bold py-1.5"
                    >
                      {isExecuted ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                          Action Dispatched
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
                          Execute Action
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ====================================================
              SECTION 3: INCIDENT LOCATION
              ==================================================== */}
          <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                SECTION 3: Incident Location
              </h3>
              <span className="text-xs text-slate-400 font-mono">GIS Spatial Node</span>
            </div>

            {/* Interactive City Map */}
            <div className="h-[260px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner relative">
              <MapContainer
                center={[selectedAlert.lat || 40.7128, selectedAlert.lng || -74.0060]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <RemoveLeafletPrefix />
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[selectedAlert.lat || 40.7128, selectedAlert.lng || -74.0060]}
                  icon={createIncidentIcon(selectedAlert.severity)}
                >
                  <Popup>
                    <div className="p-2 min-w-[180px]">
                      <h4 className="text-xs font-bold text-slate-900">{selectedAlert.id}: {selectedAlert.type}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{selectedAlert.location}</p>
                      <p className="text-[10px] text-brand-600 font-bold mt-1">{selectedAlert.trafficStatus}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Location Meta Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
                <span className="block text-[10px] text-slate-500 uppercase font-sans font-semibold">Incident Marker</span>
                <strong className="text-white text-xs block truncate mt-0.5">{selectedAlert.location}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
                <span className="block text-[10px] text-slate-500 uppercase font-sans font-semibold">Nearby Junction</span>
                <strong className="text-brand-400 text-xs block truncate mt-0.5">{selectedAlert.nearbyJunction}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
                <span className="block text-[10px] text-slate-500 uppercase font-sans font-semibold">Affected Road</span>
                <strong className="text-sky-400 text-xs block truncate mt-0.5">{selectedAlert.affectedRoad}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
                <span className="block text-[10px] text-slate-500 uppercase font-sans font-semibold">Traffic Status</span>
                <strong className="text-amber-400 text-xs block truncate mt-0.5">{selectedAlert.trafficStatus}</strong>
              </div>
            </div>
          </Card>

          {/* ====================================================
              SECTION 4: ALERT STATUS & ASSIGNMENT
              ==================================================== */}
          <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-400" />
                SECTION 4: Alert Status & Assignment
              </h3>
              <span className="text-xs text-slate-400 font-mono font-medium">Operational Dispatch Control</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned Department</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-400" />
                  {selectedAlert.assignedDepartment}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned Officer</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedAlert.assignedOfficer}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Time Since Reported</span>
                <p className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {selectedAlert.timeSinceReported}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated Resolution Time</span>
                <p className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedAlert.estimatedResolutionTime}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Current Progress</span>
                  <span className="font-mono font-bold text-brand-400">{selectedAlert.currentProgress}% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${selectedAlert.currentProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Status Change Control Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">Change Incident Status:</span>
              <div className="flex items-center gap-2">
                {(['Pending', 'In Progress', 'Resolved'] as AlertStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedAlert.status === st
                        ? st === 'Pending'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                          : st === 'In Progress'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/20'
                          : 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
};

