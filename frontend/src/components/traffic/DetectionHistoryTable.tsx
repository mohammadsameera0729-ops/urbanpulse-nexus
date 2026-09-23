import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DetectionHistoryItem } from '../../types/aiDetection';
import { History, Search, Filter, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DetectionHistoryTableProps {
  historyItems: DetectionHistoryItem[];
}

export const DetectionHistoryTable: React.FC<DetectionHistoryTableProps> = ({ historyItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [objectFilter, setObjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const objectTypes = useMemo(() => {
    const set = new Set(historyItems.map((item) => item.objectType));
    return Array.from(set);
  }, [historyItems]);

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.cameraName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.objectType.toLowerCase().includes(q) ||
        item.cameraId.toLowerCase().includes(q);
      const matchesObject = objectFilter === 'all' || item.objectType === objectFilter;
      return matchesSearch && matchesObject;
    });
  }, [historyItems, searchTerm, objectFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI Detection Event Logs & Historical Telemetry
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-brand-950 text-brand-400 border border-brand-500/30">
                {filteredItems.length} Events Logged
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Audited AI object classification events with confidence metrics and timestamps.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search camera, location, object..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={objectFilter}
            onChange={(e) => {
              setObjectFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">Object: All Types</option>
            {objectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Time & Date</th>
                <th className="py-3 px-4">Camera ID & Node</th>
                <th className="py-3 px-4">Detected Object</th>
                <th className="py-3 px-4 text-right">Confidence</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No detection events match your search or filter settings.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      <span className="text-white font-bold">{item.time}</span> • {item.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 mr-2">
                        {item.cameraId}
                      </span>
                      <span className="text-white font-semibold">{item.cameraName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.objectType}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      {item.confidence.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <span>
          Showing Page <strong className="text-white font-mono">{currentPage}</strong> of <strong className="text-white font-mono">{totalPages}</strong> ({filteredItems.length} items)
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="text-xs border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="text-xs border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
