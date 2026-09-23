import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  FileSpreadsheet, 
  RefreshCw, 
  Calendar, 
  Search, 
  Clock, 
  Activity, 
  Zap, 
  TrendingUp, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  FileCheck,
  CalendarDays
} from 'lucide-react';

interface GeneratedReportSummary {
  name: string;
  generatedDate: string;
  timePeriod: string;
  status: string;
}

interface ReportHistoryItem {
  id: string;
  name: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  generatedBy: string;
  dateTime: string;
  status: 'Completed' | 'Processing' | 'Archived';
  fileSizePDF: string;
  fileSizeExcel: string;
}

const INITIAL_REPORT_HISTORY: ReportHistoryItem[] = [
  {
    id: 'RPT-2026-001',
    name: 'Daily Citywide Traffic Flow & Speed Performance Audit',
    type: 'Daily',
    generatedBy: 'Admin Sarah Vance',
    dateTime: 'Jul 27, 2026 09:15 AM',
    status: 'Completed',
    fileSizePDF: '2.4 MB',
    fileSizeExcel: '1.1 MB',
  },
  {
    id: 'RPT-2026-002',
    name: 'Weekly Corridor Congestion & Signal Timing Summary',
    type: 'Weekly',
    generatedBy: 'System Auto-Scheduler',
    dateTime: 'Jul 26, 2026 11:59 PM',
    status: 'Completed',
    fileSizePDF: '5.8 MB',
    fileSizeExcel: '2.9 MB',
  },
  {
    id: 'RPT-2026-003',
    name: 'Monthly Municipal Arterial Gridlock & Volume Audit',
    type: 'Monthly',
    generatedBy: 'Director M. Thorne',
    dateTime: 'Jul 01, 2026 08:00 AM',
    status: 'Completed',
    fileSizePDF: '12.4 MB',
    fileSizeExcel: '6.2 MB',
  },
  {
    id: 'RPT-2026-004',
    name: 'Daily Peak Hour Throughput & Bottleneck Log',
    type: 'Daily',
    generatedBy: 'Operator D. Ross',
    dateTime: 'Jul 26, 2026 05:30 PM',
    status: 'Completed',
    fileSizePDF: '3.1 MB',
    fileSizeExcel: '1.4 MB',
  },
  {
    id: 'RPT-2026-005',
    name: 'Weekly Emergency Corridor Access & Delay Audit',
    type: 'Weekly',
    generatedBy: 'Dispatcher K. Miller',
    dateTime: 'Jul 20, 2026 07:45 AM',
    status: 'Completed',
    fileSizePDF: '4.6 MB',
    fileSizeExcel: '2.1 MB',
  },
  {
    id: 'RPT-2026-006',
    name: 'Monthly Transit & Commercial Vehicle Flow Analysis',
    type: 'Monthly',
    generatedBy: 'System Auto-Scheduler',
    dateTime: 'Jun 30, 2026 11:59 PM',
    status: 'Archived',
    fileSizePDF: '14.2 MB',
    fileSizeExcel: '7.8 MB',
  },
];

export const TrafficReportsHub: React.FC = () => {
  // Section 1 Generator State
  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [dateRange, setDateRange] = useState('2026-07-20 - 2026-07-27');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<GeneratedReportSummary | null>({
    name: 'Daily Operational City Traffic Audit',
    generatedDate: 'July 27, 2026 at 10:45 AM',
    timePeriod: 'Jul 20, 2026 - Jul 27, 2026',
    status: 'Ready for Download'
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Section 3 History State
  const [historyList, setHistoryList] = useState<ReportHistoryItem[]>(INITIAL_REPORT_HISTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newSummary: GeneratedReportSummary = {
        name: `${reportType} Municipal Traffic Performance Report`,
        generatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timePeriod: dateRange,
        status: 'Ready for Download'
      };
      setGeneratedSummary(newSummary);

      // Add to history
      const newHistoryItem: ReportHistoryItem = {
        id: `RPT-2026-00${historyList.length + 1}`,
        name: newSummary.name,
        type: reportType,
        generatedBy: 'Admin (Active Session)',
        dateTime: newSummary.generatedDate,
        status: 'Completed',
        fileSizePDF: '3.4 MB',
        fileSizeExcel: '1.8 MB'
      };
      setHistoryList([newHistoryItem, ...historyList]);
      triggerToast(`Successfully generated ${newSummary.name}!`);
    }, 1000);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Section 3 Filter & Pagination
  const filteredHistory = useMemo(() => {
    return historyList.filter((rpt) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = rpt.name.toLowerCase().includes(q) || rpt.generatedBy.toLowerCase().includes(q);
      const matchesType = historyTypeFilter === 'all' || rpt.type === historyTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [historyList, searchTerm, historyTypeFilter]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage]);

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Action Confirmed</span>
        </div>
      )}

      {/* ====================================================
          SECTION 1: TRAFFIC REPORT GENERATOR
          ==================================================== */}
      <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                SECTION 1: Traffic Report Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Generate operational traffic reports, review summary data, and export PDF/Excel files.
              </p>
            </div>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          
          {/* Report Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Report Type
            </label>
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              {(['Daily', 'Weekly', 'Monthly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setReportType(t)}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    reportType === t
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Date Range Selector
            </label>
            <div className="relative">
              <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex-1 font-bold shadow-lg shadow-brand-500/20 text-xs"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => triggerToast(`Exported ${generatedSummary?.name || 'Report'} as PDF`)}
              className="border-slate-800 text-brand-400 hover:bg-slate-800 font-bold text-xs"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export as PDF
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => triggerToast(`Exported ${generatedSummary?.name || 'Report'} as Excel`)}
              className="border-slate-800 text-emerald-400 hover:bg-slate-800 font-bold text-xs"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Export as Excel
            </Button>
          </div>
        </div>

        {/* Small Generated Report Summary Card */}
        {generatedSummary && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> Generated Report Summary
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {generatedSummary.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Report Name</span>
                <strong className="text-white text-xs block truncate mt-0.5">{generatedSummary.name}</strong>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Generated Date</span>
                <strong className="text-slate-300 text-xs font-mono block truncate mt-0.5">{generatedSummary.generatedDate}</strong>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Time Period</span>
                <strong className="text-brand-400 text-xs font-mono block truncate mt-0.5">{generatedSummary.timePeriod}</strong>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Report Status</span>
                <strong className="text-emerald-400 text-xs font-mono block truncate mt-0.5">{generatedSummary.status}</strong>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ====================================================
          SECTION 2: TRAFFIC PERFORMANCE SUMMARY
          ==================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            SECTION 2: Traffic Performance Summary
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Core Operational KPIs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Average Traffic Flow */}
          <Card className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Average Traffic Flow
              </span>
              <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-black text-white font-mono tracking-tight">
                284,520 / day
              </h4>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                +3.4% vs last week
              </span>
            </div>
          </Card>

          {/* Average Vehicle Speed */}
          <Card className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Average Vehicle Speed
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-black text-white font-mono tracking-tight">
                42.5 km/h
              </h4>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono">
                +2.8 km/h flow wave
              </span>
            </div>
          </Card>

          {/* Peak Traffic Hour */}
          <Card className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Peak Traffic Hour
              </span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-black text-white font-mono tracking-tight">
                08:30 - 09:30 AM
              </h4>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 font-mono">
                Morning Rush Peak
              </span>
            </div>
          </Card>

          {/* Congestion Rate */}
          <Card className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Congestion Rate
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-black text-white font-mono tracking-tight">
                14.2%
              </h4>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                -1.5% Gridlock Index
              </span>
            </div>
          </Card>

        </div>
      </div>

      {/* ====================================================
          SECTION 3: REPORT HISTORY
          ==================================================== */}
      <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                SECTION 3: Report History
              </h3>
              <p className="text-xs text-slate-400">
                Archive of previously generated municipal traffic reports available for export and audit.
              </p>
            </div>
          </div>

          {/* Search & Type Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search report name or author..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <select
              value={historyTypeFilter}
              onChange={(e) => { setHistoryTypeFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="all">Type: All</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Compact Reports Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="p-3.5">Report Name</th>
                <th className="p-3.5">Report Type</th>
                <th className="p-3.5">Generated By</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                    No historical reports match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white leading-snug">{item.name}</div>
                      <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        item.type === 'Daily' ? 'bg-brand-950 text-brand-400 border-brand-500/30' :
                        item.type === 'Weekly' ? 'bg-sky-950 text-sky-400 border-sky-500/30' :
                        'bg-purple-950 text-purple-400 border-purple-500/30'
                      }`}>
                        {item.type}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">
                      {item.generatedBy}
                    </td>

                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {item.dateTime}
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        item.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerToast(`Downloaded ${item.name} (PDF)`)}
                        className="text-[10px] py-1 px-2 border-slate-800 text-brand-400 hover:bg-slate-800"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerToast(`Downloaded ${item.name} (Excel)`)}
                        className="text-[10px] py-1 px-2 border-slate-800 text-emerald-400 hover:bg-slate-800"
                      >
                        <FileSpreadsheet className="w-3 h-3 mr-1" />
                        Excel
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-slate-400 font-mono">
            Showing Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredHistory.length} Total Reports)
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="border-slate-800 text-slate-300 disabled:opacity-40 text-xs px-2.5"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="border-slate-800 text-slate-300 disabled:opacity-40 text-xs px-2.5"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
};

