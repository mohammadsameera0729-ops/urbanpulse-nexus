import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Plus, 
  Clock, 
  Calendar, 
  Building2, 
  Users, 
  Car, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  X, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Send,
  Zap,
  Award,
  MapPin,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { ADMIN_12_DEPARTMENTS } from '../../data/adminData';

type ReportStatus = 'Completed' | 'Processing' | 'Scheduled';
type ReportFormat = 'PDF' | 'Excel' | 'CSV';

interface ReportRecord {
  id: string;
  reportId: string;
  name: string;
  category: string;
  generatedBy: string;
  generatedDate: string;
  dateRange: string;
  department: string;
  format: ReportFormat;
  status: ReportStatus;
  summary: string;
  highlights: string[];
}

const INITIAL_REPORTS: ReportRecord[] = [
  {
    id: 'rpt-101',
    reportId: 'RPT-8021',
    name: 'Monthly Traffic Flow & Corridor SLA Audit',
    category: 'Traffic Reports',
    generatedBy: 'Director Elena Rostova',
    generatedDate: '2026-07-28 14:30',
    dateRange: 'Last 30 Days',
    department: 'Traffic Operations & Management',
    format: 'PDF',
    status: 'Completed',
    summary: 'Comprehensive audit analyzing corridor speed telemetry, peak congestion hours, and automated green wave signal optimization.',
    highlights: [
      'Traffic congestion reduced by 8.4% on Central Expressway corridor.',
      'Peak morning travel speed averaged 48.5 km/h across primary routes.',
      'Automated signal overrides resolved 142 localized bottleneck events.'
    ]
  },
  {
    id: 'rpt-102',
    reportId: 'RPT-8022',
    name: 'Q2 Municipal Department SLA Compliance Report',
    category: 'Department Performance Reports',
    generatedBy: 'Chief Officer Marcus Vance',
    generatedDate: '2026-07-27 10:15',
    dateRange: 'Last Quarter',
    department: 'All Departments',
    format: 'Excel',
    status: 'Completed',
    summary: 'Cross-agency evaluation measuring SLA adherence rates, ticket resolution speeds, and budget resource utilization across 12 municipal departments.',
    highlights: [
      'Public Safety & Emergency achieved 98.4% SLA adherence.',
      'Average municipal complaint resolution time improved to 4.2 hours.',
      'Overall citizen satisfaction score increased to 94.8%.'
    ]
  },
  {
    id: 'rpt-103',
    reportId: 'RPT-8023',
    name: 'Citizen Complaint Trends & Escalation Analysis',
    category: 'Complaint Reports',
    generatedBy: 'Manager David Chen',
    generatedDate: '2026-07-26 16:45',
    dateRange: 'Last 30 Days',
    department: 'Public Works & Infrastructure',
    format: 'PDF',
    status: 'Completed',
    summary: 'Detailed categorization of citizen-submitted complaints, geotagged location hotspots, and resolution timeline breakdowns.',
    highlights: [
      'Road repair & pothole tickets represented 38% of total volume.',
      'Sector 4 recorded highest ticket concentration (412 complaints).',
      'Zero critical priority tickets exceeded SLA thresholds.'
    ]
  },
  {
    id: 'rpt-104',
    reportId: 'RPT-8024',
    name: 'Field Workforce Productivity & Duty Hours Log',
    category: 'Staff Performance Reports',
    generatedBy: 'Supervisor Alex Rivera',
    generatedDate: '2026-07-25 09:00',
    dateRange: 'Last 7 Days',
    department: 'Traffic Operations & Management',
    format: 'CSV',
    status: 'Completed',
    summary: 'Workforce availability tracking, active field hours, task completion metrics, and individual staff performance scores.',
    highlights: [
      '1,160 field personnel logged 18,400 active duty hours.',
      'Traffic Field Operations Team A completed 142 dispatch tasks.',
      'Average staff rating score reached 4.8 / 5.0 stars.'
    ]
  },
  {
    id: 'rpt-105',
    reportId: 'RPT-8025',
    name: 'Emergency Incident Dispatch & Response Log',
    category: 'Emergency Incident Reports',
    generatedBy: 'Chief Commander Amanda Taylor',
    generatedDate: '2026-07-24 11:20',
    dateRange: 'Last 30 Days',
    department: 'Public Safety & Emergency Management',
    format: 'PDF',
    status: 'Completed',
    summary: 'Log of critical municipal alerts, emergency dispatch response speeds, multi-agency coordination, and incident outcomes.',
    highlights: [
      'Average emergency dispatch response time improved to 4.2 minutes.',
      '100% of severe weather hazard alerts dispatched within 90 seconds.',
      'Zero multi-agency dispatch delays reported.'
    ]
  },
  {
    id: 'rpt-106',
    reportId: 'RPT-8026',
    name: 'Citizen Mobile Adoption & Feedback Digest',
    category: 'Citizen Activity Reports',
    generatedBy: 'Director Sophia Patel',
    generatedDate: '2026-07-22 15:10',
    dateRange: 'Last Quarter',
    department: 'Citizen Services & Administration',
    format: 'Excel',
    status: 'Completed',
    summary: 'Metrics tracking new citizen account registrations, daily active platform usage, upvoting trends, and direct survey feedback.',
    highlights: [
      '50,231 verified citizens registered on platform (+12.4% growth).',
      '84.2% of registered citizens logged into app during past month.',
      'Received 1,240 post-resolution 5-star citizen reviews.'
    ]
  },
  {
    id: 'rpt-107',
    reportId: 'RPT-8027',
    name: 'Weekly Automated Corridor Telemetry Audit',
    category: 'Traffic Reports',
    generatedBy: 'System Auto-Scheduler',
    generatedDate: '2026-07-29 08:00',
    dateRange: 'Weekly Recurring',
    department: 'Traffic Operations & Management',
    format: 'PDF',
    status: 'Scheduled',
    summary: 'Automated weekly compilation of smart sensor telemetry, AI camera detection rates, and corridor congestion indexes.',
    highlights: [
      'Scheduled to run automatically every Monday at 08:00 AM.',
      'Direct email distribution configured for executive leadership.'
    ]
  },
  {
    id: 'rpt-108',
    reportId: 'RPT-8028',
    name: 'Infrastructure Leak & Drainage Audit',
    category: 'Department Performance Reports',
    generatedBy: 'Eng. Sarah Jenkins',
    generatedDate: '2026-07-29 09:15',
    dateRange: 'Last 30 Days',
    department: 'Water Utility & Drainage Systems',
    format: 'CSV',
    status: 'Processing',
    summary: 'In-progress compilation of pipeline telemetry readings, water pressure drop alerts, and leak repair SLA benchmarks.',
    highlights: [
      'Currently synthesizing data from 480 smart water sensors.',
      'Estimated completion time: 5 minutes.'
    ]
  },
];

export const ReportsPage: React.FC = () => {
  const [reportsList, setReportsList] = useState<ReportRecord[]>(INITIAL_REPORTS);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  // Modals & Drawer States
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null); // View Side Drawer
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('PDF');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form States for Schedule / Generate Modal
  const [scheduleReportType, setScheduleReportType] = useState('Complaint Reports');
  const [scheduleFrequency, setScheduleFrequency] = useState('Weekly');
  const [scheduleDepartment, setScheduleDepartment] = useState('Traffic Operations & Management');
  const [scheduleRecipient, setScheduleRecipient] = useState('admin@urbanpulse.gov');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setReportTypeFilter('all');
    setDepartmentFilter('all');
    setDateRangeFilter('all');
    setZoneFilter('all');
    setFormatFilter('all');
    setCurrentPage(1);
  };

  // Filtered Data Computation
  const filteredData = useMemo(() => {
    return reportsList.filter((r) => {
      const matchesSearch =
        r.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.generatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = reportTypeFilter === 'all' || r.category === reportTypeFilter;
      const matchesDept = departmentFilter === 'all' || r.department === departmentFilter || r.department === 'All Departments';
      const matchesFormat = formatFilter === 'all' || r.format === formatFilter;

      return matchesSearch && matchesCategory && matchesDept && matchesFormat;
    });
  }, [reportsList, searchTerm, reportTypeFilter, departmentFilter, formatFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Summary Metrics
  const totalReportsCount = 248;
  const reportsGeneratedMonthCount = 34;
  const scheduledReportsCount = 12;
  const lastGeneratedTime = '2 hrs ago';

  // Quick Category Generation Handler
  const handleGenerateCategoryReport = (categoryName: string) => {
    const newRpt: ReportRecord = {
      id: `rpt-${Date.now()}`,
      reportId: `RPT-${Math.floor(8030 + Math.random() * 100)}`,
      name: `${categoryName} Executive Audit (${new Date().toLocaleDateString()})`,
      category: categoryName,
      generatedBy: 'Command Center Admin',
      generatedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dateRange: 'Last 30 Days',
      department: 'Smart City Control Center',
      format: 'PDF',
      status: 'Completed',
      summary: `Automated ${categoryName} compiled for executive municipal review.`,
      highlights: [
        'All SLA compliance parameters verified within standard tolerances.',
        'Data compiled across 12 municipal zones.',
        'Zero critical operational anomalies detected.'
      ]
    };

    setReportsList([newRpt, ...reportsList]);
    setActionNotice(`Report '${newRpt.name}' generated successfully.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Export File Handler
  const handleExportFile = (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(`Exporting selected city reports in ${selectedFormat} format...`);
    setTimeout(() => setActionNotice(null), 4000);
    setExportModalOpen(false);
  };

  // Schedule Report Handler
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newScheduled: ReportRecord = {
      id: `rpt-${Date.now()}`,
      reportId: `RPT-${Math.floor(8050 + Math.random() * 100)}`,
      name: `Scheduled ${scheduleReportType} (${scheduleFrequency})`,
      category: scheduleReportType,
      generatedBy: `Scheduled for ${scheduleRecipient}`,
      generatedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dateRange: `${scheduleFrequency} Recurring`,
      department: scheduleDepartment,
      format: 'PDF',
      status: 'Scheduled',
      summary: `Automated ${scheduleFrequency.toLowerCase()} report distribution configured for ${scheduleRecipient}.`,
      highlights: [
        `Recurring trigger: ${scheduleFrequency}`,
        `Recipient: ${scheduleRecipient}`,
        `Target Department: ${scheduleDepartment}`
      ]
    };

    setReportsList([newScheduled, ...reportsList]);
    setActionNotice(`Report schedule created successfully for ${scheduleRecipient}.`);
    setTimeout(() => setActionNotice(null), 4000);
    setScheduleModalOpen(false);
  };

  // Regenerate Report Handler
  const handleRegenerateReport = (report: ReportRecord) => {
    setActionNotice(`Regenerating report ${report.reportId} with updated telemetry...`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Status Badge Render Helper
  const renderStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case 'Scheduled':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            Scheduled
          </span>
        );
    }
  };

  // Table Column Definitions
  const columns = [
    {
      header: 'Report ID',
      accessorKey: 'reportId' as const,
      cell: (row: ReportRecord) => (
        <span className="font-mono text-xs font-bold text-[#2563EB]">
          #{row.reportId}
        </span>
      ),
    },
    {
      header: 'Report Name',
      cell: (row: ReportRecord) => (
        <span className="text-xs font-bold text-white truncate max-w-[220px] block">
          {row.name}
        </span>
      ),
    },
    {
      header: 'Category',
      cell: (row: ReportRecord) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#0F172A] border border-slate-800 text-slate-300">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Generated By',
      cell: (row: ReportRecord) => (
        <span className="text-xs font-medium text-slate-300 truncate max-w-[140px] block">
          {row.generatedBy}
        </span>
      ),
    },
    {
      header: 'Generated Date',
      cell: (row: ReportRecord) => (
        <span className="text-xs font-mono text-slate-400">{row.generatedDate}</span>
      ),
    },
    {
      header: 'Format',
      cell: (row: ReportRecord) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
          {row.format}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: ReportRecord) => renderStatusBadge(row.status),
    },
    {
      header: 'Actions',
      cell: (row: ReportRecord) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedReport(row)}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Eye className="w-3 h-3 text-[#2563EB]" />}
          >
            View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFormat(row.format);
              setExportModalOpen(true);
            }}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Download className="w-3 h-3 text-emerald-400" />}
          >
            Download
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRegenerateReport(row)}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<RefreshCw className="w-3 h-3 text-sky-400" />}
          >
            Regenerate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* ====================================================
          1. HEADER (Generate Report & Export Reports)
          ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            City Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Generate, manage and export operational reports for city administration and municipal departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            className="border-slate-800 bg-[#111827] text-slate-300 hover:text-white text-xs font-bold"
          >
            Export Reports
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setScheduleModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionNotice}
        </div>
      )}

      {/* ====================================================
          2. SUMMARY CARDS (EXACTLY FOUR COMPACT CARDS)
          ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Reports */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Reports</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalReportsCount}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12.5% vs last month
            </span>
          </div>
        </div>

        {/* Card 2: Reports Generated This Month */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Reports Generated This Month</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">{reportsGeneratedMonthCount}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8.2% vs last month
            </span>
          </div>
        </div>

        {/* Card 3: Scheduled Reports */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Scheduled Reports</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">{scheduledReportsCount} Active</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +2 vs last month
            </span>
          </div>
        </div>

        {/* Card 4: Last Generated Report */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Last Generated Report</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400 font-mono">{lastGeneratedTime}</span>
            <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[120px]">
              Traffic Audit
            </span>
          </div>
        </div>

      </div>

      {/* ====================================================
          3. REPORT CATEGORIES (CLEAN PROFESSIONAL CARDS)
          ==================================================== */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Report Categories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* 1. Complaint Reports */}
          <Card className="p-5 bg-[#111827] border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-all shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Complaint Reports</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detailed breakdown of citizen complaint trends, resolution speed, and department SLA adherence.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateCategoryReport('Complaint Reports')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="w-full border-slate-800 bg-[#0F172A] text-slate-300 hover:text-white text-xs"
            >
              Generate Report
            </Button>
          </Card>

          {/* 2. Traffic Reports */}
          <Card className="p-5 bg-[#111827] border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-all shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Traffic Reports</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Corridor congestion telemetry, vehicle counts, peak traffic hours, and speed enforcement.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateCategoryReport('Traffic Reports')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="w-full border-slate-800 bg-[#0F172A] text-slate-300 hover:text-white text-xs"
            >
              Generate Report
            </Button>
          </Card>

          {/* 3. Department Performance Reports */}
          <Card className="p-5 bg-[#111827] border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-all shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Department Performance Reports</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resource allocation efficiency, staff productivity, resolution rates, and SLA compliance.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateCategoryReport('Department Performance Reports')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="w-full border-slate-800 bg-[#0F172A] text-slate-300 hover:text-white text-xs"
            >
              Generate Report
            </Button>
          </Card>

          {/* 4. Staff Performance Reports */}
          <Card className="p-5 bg-[#111827] border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-all shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Staff Performance Reports</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Individual employee task completions, response speed, field duty hours, and rating scores.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateCategoryReport('Staff Performance Reports')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="w-full border-slate-800 bg-[#0F172A] text-slate-300 hover:text-white text-xs"
            >
              Generate Report
            </Button>
          </Card>

          {/* 5. Emergency Incident Reports */}
          <Card className="p-5 bg-[#111827] border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-all shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Emergency Incident Reports</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Critical municipal alerts, disaster response dispatching, and emergency resolution timelines.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateCategoryReport('Emergency Incident Reports')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="w-full border-slate-800 bg-[#0F172A] text-slate-300 hover:text-white text-xs"
            >
              Generate Report
            </Button>
          </Card>

          {/* 6. Citizen Activity Reports */}
          <Card className="p-5 bg-[#111827] border-slate-800 space-y-3 hover:border-[#2563EB]/50 transition-all shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Citizen Activity Reports</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizen registration growth, active app users, feedback submission rates, and satisfaction metrics.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateCategoryReport('Citizen Activity Reports')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="w-full border-slate-800 bg-[#0F172A] text-slate-300 hover:text-white text-xs"
            >
              Generate Report
            </Button>
          </Card>

        </div>
      </div>

      {/* ====================================================
          4. KEY HIGHLIGHTS SECTION (COMPACT INFO CARDS)
          ==================================================== */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Key Executive Highlights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Highest Complaint Area</span>
            <p className="text-xs text-white font-bold truncate">Sector 4 Expressway</p>
            <span className="text-[10px] text-slate-400 font-mono">412 Tickets Logged</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Best Performing Dept</span>
            <p className="text-xs text-white font-bold truncate">Public Safety & Emergency</p>
            <span className="text-[10px] text-emerald-400 font-mono">98.4% SLA Adherence</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Most Active Staff Team</span>
            <p className="text-xs text-white font-bold truncate">Traffic Ops Team A</p>
            <span className="text-[10px] text-blue-400 font-mono">142 Tasks Completed</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Avg Resolution Time</span>
            <p className="text-xs text-white font-bold truncate">3.8 Hours</p>
            <span className="text-[10px] text-emerald-400 font-mono">14% Speed Improvement</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase">Traffic Peak Hours</span>
            <p className="text-xs text-white font-bold truncate">08:00 AM & 06:15 PM</p>
            <span className="text-[10px] text-slate-400 font-mono">Dual Daily Spikes</span>
          </div>
        </div>
      </div>

      {/* ====================================================
          5. REPORT FILTERS
          ==================================================== */}
      <Card className="p-4 bg-[#111827] border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="lg:col-span-3 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Reports..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Report Type */}
          <div className="lg:col-span-2">
            <select
              value={reportTypeFilter}
              onChange={(e) => {
                setReportTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Report Type: All</option>
              <option value="Complaint Reports">Complaint Reports</option>
              <option value="Traffic Reports">Traffic Reports</option>
              <option value="Department Performance Reports">Department Performance</option>
              <option value="Staff Performance Reports">Staff Performance</option>
              <option value="Emergency Incident Reports">Emergency Incident</option>
              <option value="Citizen Activity Reports">Citizen Activity</option>
            </select>
          </div>

          {/* Department */}
          <div className="lg:col-span-2">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Department: All</option>
              {ADMIN_12_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="lg:col-span-2">
            <select
              value={dateRangeFilter}
              onChange={(e) => {
                setDateRangeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Date Range: All</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last Quarter">Last Quarter</option>
            </select>
          </div>

          {/* Report Format */}
          <div className="lg:col-span-2">
            <select
              value={formatFilter}
              onChange={(e) => {
                setFormatFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Format: All</option>
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
              <option value="CSV">CSV</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="lg:col-span-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="w-full text-[11px] py-2 px-2 border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white"
            >
              Reset
            </Button>
          </div>

        </div>
      </Card>

      {/* ====================================================
          6. RECENT REPORTS TABLE & EMPTY STATE
          ==================================================== */}
      <Card className="overflow-hidden border border-slate-800 shadow-xl bg-[#111827]">
        {paginatedData.length > 0 ? (
          <Table data={paginatedData} columns={columns} keyExtractor={(r) => r.id} />
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No reports available.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no municipal reports matching your active search keywords or filter settings.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setScheduleModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs"
            >
              Generate Report
            </Button>
          </div>
        )}
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredData.length} Reports Displayed)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="border-slate-800 text-slate-300"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="border-slate-800 text-slate-300"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ====================================================
          7. REPORT DETAILS SIDE DRAWER (VIEW ACTION)
          ==================================================== */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Slide Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#111827] border-l border-slate-800 shadow-2xl flex flex-col justify-between z-50 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div>
                  <span className="font-mono text-xs font-bold text-[#2563EB]">
                    #{selectedReport.reportId}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedReport.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Meta Overview Card */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB]">
                      {selectedReport.category}
                    </span>
                    {renderStatusBadge(selectedReport.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-300 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Generated By</span>
                      <strong className="text-white font-bold">{selectedReport.generatedBy}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Generation Date</span>
                      <strong className="text-slate-200 font-mono">{selectedReport.generatedDate}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Date Range Scope</span>
                      <strong className="text-slate-200">{selectedReport.dateRange}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Export Format</span>
                      <strong className="text-[#2563EB] font-mono font-bold">{selectedReport.format} File</strong>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Summary</span>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">{selectedReport.summary}</p>
                </div>

                {/* Key Highlights */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Key Audit Highlights</span>
                  <ul className="space-y-2 text-slate-300">
                    {selectedReport.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerateReport(selectedReport)}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-sky-400" />}
                  className="border-slate-800 text-slate-300"
                >
                  Regenerate
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedFormat(selectedReport.format);
                    setExportModalOpen(true);
                  }}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold"
                >
                  Download Report
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
          8. EXPORT OPTIONS MODAL (EXPORT REPORTS BUTTON)
          ==================================================== */}
      <AnimatePresence>
        {exportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Export City Reports</h3>
                <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExportFile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-2">Select Export Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['PDF', 'Excel', 'CSV'] as ReportFormat[]).map((fmt) => (
                      <button
                        type="button"
                        key={fmt}
                        onClick={() => setSelectedFormat(fmt)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedFormat === fmt
                            ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {fmt} Format
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-slate-300">
                  <label className="block font-medium text-slate-300">Include Data Sections</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 text-[#2563EB]" />
                    <span>Executive Summary & Metrics</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 text-[#2563EB]" />
                    <span>Department SLA & Performance Breakdown</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 text-[#2563EB]" />
                    <span>Geotagged Location Map Telemetry</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExportModalOpen(false)}
                    className="border-slate-800 text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-[#2563EB] text-white font-bold"
                  >
                    Export File
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
          9. SCHEDULE / GENERATE REPORT MODAL
          ==================================================== */}
      <AnimatePresence>
        {scheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Generate / Schedule City Report</h3>
                <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Report Type</label>
                  <select
                    value={scheduleReportType}
                    onChange={(e) => setScheduleReportType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Complaint Reports">Complaint Reports</option>
                    <option value="Traffic Reports">Traffic Reports</option>
                    <option value="Department Performance Reports">Department Performance Reports</option>
                    <option value="Staff Performance Reports">Staff Performance Reports</option>
                    <option value="Emergency Incident Reports">Emergency Incident Reports</option>
                    <option value="Citizen Activity Reports">Citizen Activity Reports</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Frequency</label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="One-Time Immediate">One-Time Immediate</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Target Department</label>
                    <select
                      value={scheduleDepartment}
                      onChange={(e) => setScheduleDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="Smart City Control Center">Smart City Control Center</option>
                      {ADMIN_12_DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email Recipient *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@urbanpulse.gov"
                    value={scheduleRecipient}
                    onChange={(e) => setScheduleRecipient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setScheduleModalOpen(false)}
                    className="border-slate-800 text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-[#2563EB] text-white font-bold"
                  >
                    Schedule Report
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
