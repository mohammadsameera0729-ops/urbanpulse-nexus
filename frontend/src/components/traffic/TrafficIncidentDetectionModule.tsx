import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { 
  AlertOctagon, 
  MapPin, 
  ExternalLink, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  VideoOff 
} from 'lucide-react';
import { TrafficIncident, IncidentType } from '../../types/trafficIncident';
import { classifyTrafficIncident } from '../../utils/trafficIncidentClassifier';
import { fetchTrafficIncidents } from '../../services/trafficIncidentService';
import { useAuth } from '../../context/AuthContext';

export const TrafficIncidentDetectionModule: React.FC = () => {
  const { token } = useAuth();
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'All' | IncidentType>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadIncidents = async () => {
      setLoading(true);
      const data = await fetchTrafficIncidents(token);
      if (isMounted) {
        setIncidents(data);
        setLoading(false);
      }
    };
    loadIncidents();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedTypeFilter === 'All') return true;
    return inc.incidentType === selectedTypeFilter;
  });

  const activeCount = incidents.filter((i) => i.status === 'Active').length;
  const highCriticalCount = incidents.filter((i) => i.severity === 'High' || i.severity === 'Critical').length;
  const monitoringCount = incidents.filter((i) => i.status === 'Monitoring').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;

  return (
    <Card className="p-6 bg-[#111827] border border-slate-800 rounded-3xl space-y-6 shadow-xl font-sans">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                AI Traffic Intelligence Module 02
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Incident Detection & Safety Observation
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Observation & safety incident classification across 12 authoritative Vijayawada monitoring corridors.
          </p>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSelectedTypeFilter('All')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedTypeFilter === 'All'
                ? 'bg-[#2563EB] text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Incidents ({incidents.length})
          </button>
          <button
            onClick={() => setSelectedTypeFilter('Accident / Collision')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedTypeFilter === 'Accident / Collision'
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Accident / Collision
          </button>
          <button
            onClick={() => setSelectedTypeFilter('Road Obstruction')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedTypeFilter === 'Road Obstruction'
                ? 'bg-amber-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Road Obstruction
          </button>
          <button
            onClick={() => setSelectedTypeFilter('Stopped / Disabled Vehicle')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedTypeFilter === 'Stopped / Disabled Vehicle'
                ? 'bg-slate-700 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Stopped / Disabled Vehicle
          </button>
        </div>
      </div>

      {/* Observation Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Incidents */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1.5 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Incidents</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{activeCount}</span>
        </div>

        {/* Card 2: High / Critical Severity */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">High / Critical Severity</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-400 font-mono">{highCriticalCount}</span>
        </div>

        {/* Card 3: Under Monitoring */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1.5 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Under Monitoring</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-blue-400 font-mono">{monitoringCount}</span>
        </div>

        {/* Card 4: Resolved Incidents */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1.5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Resolved Incidents</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">{resolvedCount}</span>
        </div>

      </div>

      {/* Observation Architecture Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 text-slate-300 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            Observation Source: <strong className="text-white">Pre-camera incident observation</strong> &bull; Camera Status: <strong className="text-amber-400">Camera Not Connected</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0">
          Future CCTV Vision Pipeline Compatible
        </span>
      </div>

      {/* Incidents Observation List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-mono">
          Loading traffic incident observations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIncidents.map((inc) => {
            const classification = classifyTrafficIncident(inc.severity, inc.status);
            return (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  
                  {/* Top Header: Incident Type & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">
                          {inc.id} &bull; {inc.monitoringPointId}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
                        {inc.incidentType}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-md border font-mono uppercase tracking-wider ${classification.severityBadgeClass}`}>
                        {inc.severity} Severity
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono uppercase tracking-wider ${classification.statusBadgeClass}`}>
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  {/* Real Location */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate font-semibold">{inc.locationName}</span>
                    <span className="text-slate-500 text-[11px]">({inc.location})</span>
                  </div>

                  {/* Description Box */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <p className="font-medium text-slate-200">{inc.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1 italic font-sans">
                      Impact: {classification.impactSummary}
                    </p>
                  </div>

                </div>

                {/* Bottom Actions & Metadata */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Observation timestamp: {inc.detectedAt.slice(0, 10)} 08:15 IST</span>
                    </div>
                    <div className="flex items-center gap-1 truncate justify-end text-amber-400">
                      <VideoOff className="w-3 h-3" />
                      <span>Pre-camera Observation</span>
                    </div>
                  </div>

                  <a
                    href={inc.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700/60"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                    Open Location on Google Maps
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </Card>
  );
};
