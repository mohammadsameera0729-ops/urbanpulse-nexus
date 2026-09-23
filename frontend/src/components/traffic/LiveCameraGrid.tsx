import React, { useState, useMemo } from 'react';
import { TrafficCamera } from '../../types/traffic';
import { CameraCard } from './CameraCard';
import { Search, Filter, Grid, List, RefreshCw, Radio } from 'lucide-react';
import { Button } from '../ui/Button';

interface LiveCameraGridProps {
  cameras: TrafficCamera[];
  onSelectCamera: (camera: TrafficCamera) => void;
}

export const LiveCameraGrid: React.FC<LiveCameraGridProps> = ({ cameras, onSelectCamera }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'critical'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract unique zones and camera types
  const zones = useMemo(() => {
    const set = new Set(cameras.map((c) => c.zone));
    return Array.from(set);
  }, [cameras]);

  const cameraTypes = useMemo(() => {
    const set = new Set(cameras.map((c) => c.cameraType));
    return Array.from(set);
  }, [cameras]);

  // Filtered cameras logic
  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      // Search check
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        camera.name.toLowerCase().includes(query) ||
        camera.id.toLowerCase().includes(query) ||
        camera.location.toLowerCase().includes(query);

      // Filter checks
      const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
      const matchesLevel = levelFilter === 'all' || camera.trafficLevel === levelFilter;
      const matchesZone = zoneFilter === 'all' || camera.zone === zoneFilter;
      const matchesType = typeFilter === 'all' || camera.cameraType === typeFilter;

      return matchesSearch && matchesStatus && matchesLevel && matchesZone && matchesType;
    });
  }, [cameras, searchTerm, statusFilter, levelFilter, zoneFilter, typeFilter]);

  const handleRefreshGrid = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setLevelFilter('all');
    setZoneFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls Panel */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Live Camera Telemetry Network</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {filteredCameras.length} / {cameras.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Search & filter high-definition AI optical telemetry nodes across city sectors.
              </p>
            </div>
          </div>

          {/* Top Actions: Search Bar & View Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search camera name, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshGrid}
              className="text-xs font-semibold border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            Filters:
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Status: All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          {/* Traffic Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Traffic Level: All</option>
            <option value="low">Low Traffic</option>
            <option value="moderate">Moderate Traffic</option>
            <option value="high">High Traffic</option>
            <option value="critical">Critical Congestion</option>
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Zone: All Zones</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          {/* Camera Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Camera Type: All Types</option>
            {cameraTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Reset Filters Button if any active */}
          {(searchTerm || statusFilter !== 'all' || levelFilter !== 'all' || zoneFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-brand-400 hover:text-brand-300 font-semibold underline text-xs ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid or Table Display */}
      {filteredCameras.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <p className="text-base font-bold text-white">No Traffic Cameras Found</p>
          <p className="text-xs text-slate-400">
            No cameras match your current search query or active filter settings.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-2">
            Clear Filters & Search
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCameras.map((camera) => (
            <CameraCard key={camera.id} camera={camera} onClick={onSelectCamera} />
          ))}
        </div>
      ) : (
        /* Professional Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Camera ID</th>
                  <th className="py-3 px-4">Name & Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4 text-right">Vehicles / hr</th>
                  <th className="py-3 px-4 text-right">Avg Speed</th>
                  <th className="py-3 px-4">Density</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                {filteredCameras.map((cam) => (
                  <tr
                    key={cam.id}
                    onClick={() => onSelectCamera(cam)}
                    className="hover:bg-slate-850 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      {cam.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{cam.name}</p>
                      <p className="text-[11px] text-slate-400">{cam.location}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cam.status === 'online'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cam.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        {cam.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-300">
                        {cam.trafficLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {cam.vehicleCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {cam.avgSpeed} km/h
                    </td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                        <span>{cam.trafficDensity}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cam.trafficDensity}%` }}
                          className="h-full bg-brand-500 rounded-full"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="outline" size="sm" className="text-[11px]">
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
