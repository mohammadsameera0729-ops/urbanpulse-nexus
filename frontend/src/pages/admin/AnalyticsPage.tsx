import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Users, 
  Clock, 
  Building2, 
  Activity,
  Sparkles,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  X,
  Zap,
  Car,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { ADMIN_12_DEPARTMENTS } from '../../data/adminData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 11, family: 'Inter' } } },
    tooltip: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.2)' } },
    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.2)' } },
  },
};

// 1. Line Chart: Monthly Complaint Trend
const monthlyComplaintTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Logged Complaints',
      data: [1850, 2100, 2450, 2900, 3100, 2800, 2540],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Resolved Complaints',
      data: [1650, 1980, 2310, 2780, 2980, 2710, 2480],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 2. Bar Chart: Department Performance
const departmentPerformanceData = {
  labels: ['Traffic', 'Public Works', 'Water Dept', 'Waste Mgmt', 'Lighting', 'Public Safety'],
  datasets: [
    {
      label: 'Performance Rating Score (out of 100)',
      data: [96, 92, 94, 88, 95, 98],
      backgroundColor: [
        'rgba(37, 99, 235, 0.85)',
        'rgba(56, 189, 248, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(139, 92, 246, 0.85)',
        'rgba(16, 185, 129, 0.95)',
      ],
      borderRadius: 8,
    },
  ],
};

// 3. Donut Chart: Complaint Status Distribution
const complaintStatusDistributionData = {
  labels: ['Resolved', 'In Progress', 'Pending', 'Under Review'],
  datasets: [
    {
      data: [14216, 390, 214, 80],
      backgroundColor: ['#10b981', '#2563EB', '#f59e0b', '#64748b'],
      borderColor: '#111827',
      borderWidth: 3,
    },
  ],
};

// 4. Area Chart: Traffic Density Trend
const trafficDensityTrendData = {
  labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  datasets: [
    {
      label: 'City Corridor Congestion %',
      data: [12, 8, 34, 78, 45, 62, 84, 26],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

interface ChartDetailPayload {
  title: string;
  type: string;
  summary: string;
  trendAnalysis: string;
  performanceComparison: string;
  aiObservation: string;
  recommendedAction: string;
}

export const AnalyticsPage: React.FC = () => {
  const [statusCounts, setStatusCounts] = useState<{ resolved: number; inProgress: number; pending: number; underReview: number }>({
    resolved: 14216,
    inProgress: 390,
    pending: 214,
    underReview: 80,
  });

  useEffect(() => {
    const loadLiveAnalytics = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) return;

        const response = await fetch('http://localhost:5000/api/admin/complaints', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.complaints)) {
          const complaints = data.complaints;
          const resolved = complaints.filter((c: any) => c.status === 'resolved').length;
          const inProgress = complaints.filter((c: any) => c.status === 'in_progress').length;
          const pending = complaints.filter((c: any) => c.status === 'pending').length;
          const underReview = complaints.filter((c: any) => c.status === 'under_review').length;

          setStatusCounts({ resolved, inProgress, pending, underReview });
        }
      } catch (err) {
        console.error('Failed to load analytics complaints:', err);
      }
    };

    loadLiveAnalytics();
  }, []);

  const dynamicStatusData = useMemo(() => {
    return {
      labels: ['Resolved', 'In Progress', 'Pending', 'Under Review'],
      datasets: [
        {
          data: [statusCounts.resolved, statusCounts.inProgress, statusCounts.pending, statusCounts.underReview],
          backgroundColor: ['#10b981', '#2563EB', '#f59e0b', '#64748b'],
          borderColor: '#111827',
          borderWidth: 3,
        },
      ],
    };
  }, [statusCounts]);

  // Filter Bar States
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  // Side Drawer State for Chart Selection
  const [chartDrawerData, setChartDrawerData] = useState<ChartDetailPayload | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Reset Filters
  const handleResetFilters = () => {
    setDateRange('Last 30 Days');
    setSelectedDept('all');
    setSelectedCategory('all');
    setSelectedZone('all');
  };

  // Export Action
  const handleExport = (type: string) => {
    setExportNotice(`Generating & exporting ${type} for ${dateRange}...`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Open Chart Drawer Helper
  const handleOpenChartDetails = (chartKey: string) => {
    switch (chartKey) {
      case 'line-complaint-trend':
        setChartDrawerData({
          title: 'Monthly Complaint Trend Analysis',
          type: 'Line Chart Visualization',
          summary: 'Tracks total logged vs resolved municipal complaints over the past 7 calendar months.',
          trendAnalysis: 'Complaint volume peaked in May at 3,100 logged tickets and steadily declined by 18% through July due to preventive infrastructure maintenance.',
          performanceComparison: '12.4% higher SLA resolution efficiency compared to the previous quarter benchmark.',
          aiObservation: 'Pothole and road repair tickets represent 38% of overall volume, resolving 2.1 days faster than initial SLA predictions.',
          recommendedAction: 'Maintain current field staff deployment on Sector 4 Expressways to sustain low backlog levels.',
        });
        break;

      case 'bar-dept-performance':
        setChartDrawerData({
          title: 'Department Performance Rating',
          type: 'Bar Chart Visualization',
          summary: 'Ranks top municipal agencies by SLA compliance score and operational speed.',
          trendAnalysis: 'Public Safety and Traffic Operations maintained scores above 95/100 for three consecutive months.',
          performanceComparison: 'Overall municipal department average increased from 89.2 to 94.6 points.',
          aiObservation: 'Waste Management performance improved by 14% following the introduction of automated route optimization.',
          recommendedAction: 'Share Waste Management automated dispatch workflows with Public Works to improve response times.',
        });
        break;

      case 'donut-status-distribution':
        setChartDrawerData({
          title: 'Complaint Status Distribution',
          type: 'Donut Chart Visualization',
          summary: 'Breakdown of active, pending, in-progress, and resolved complaint tickets across the city.',
          trendAnalysis: '95.4% of total complaints logged are fully resolved. Only 1.4% remain in pending status.',
          performanceComparison: 'Pending ticket ratio reduced by 3.2% compared to last month.',
          aiObservation: 'No critical priority tickets have remained in pending status for more than 4 hours.',
          recommendedAction: 'Auto-escalate any pending ticket approaching 12 hours straight to department chief.',
        });
        break;

      case 'area-traffic-density':
        setChartDrawerData({
          title: '24-Hour Traffic Density Trend',
          type: 'Area Chart Visualization',
          summary: 'Monitors hourly citywide corridor congestion rates and peak traffic flow curves.',
          trendAnalysis: 'Peak traffic spikes occur at 08:30 AM (78% congestion) and 06:15 PM (84% congestion).',
          performanceComparison: 'Off-peak traffic speeds improved by 8.5 km/h compared to last month.',
          aiObservation: 'AI signal timing adjustments on Central Expressway reduced morning rush congestion duration by 18 minutes.',
          recommendedAction: 'Activate dynamic green wave signal timing on Sector 2 corridors between 05:30 PM and 07:00 PM.',
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* ====================================================
          1. HEADER (Only Generate Report & Export Analytics)
          ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Analytics Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Analyze city operations, monitor performance trends and support data-driven decision making.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('Executive Report')}
            leftIcon={<FileText className="w-4 h-4 text-[#2563EB]" />}
            className="border-slate-800 bg-[#111827] text-slate-300 hover:text-white text-xs font-bold"
          >
            Generate Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('Analytics Dataset')}
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            Export Analytics
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {exportNotice}
        </div>
      )}

      {/* ====================================================
          2. EXECUTIVE SUMMARY (EXACTLY FOUR COMPACT CARDS)
          ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Complaints */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Complaints</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">14,820</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> -8.4% vs last month
            </span>
          </div>
        </div>

        {/* Card 2: Average Resolution Time */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Average Resolution Time</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">4.2 hrs</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> -14.2% vs last month
            </span>
          </div>
        </div>

        {/* Card 3: Traffic Flow Efficiency */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Traffic Flow Efficiency</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">91.8%</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +4.1% vs last month
            </span>
          </div>
        </div>

        {/* Card 4: Department Performance Score */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Department Performance</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400 font-mono">94.6 / 100</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +3.2% vs last month
            </span>
          </div>
        </div>

      </div>

      {/* ====================================================
          3. FILTER BAR
          ==================================================== */}
      <Card className="p-4 bg-[#111827] border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          
          {/* Date Range */}
          <div className="lg:col-span-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="Last 7 Days">Date Range: Last 7 Days</option>
              <option value="Last 30 Days">Date Range: Last 30 Days</option>
              <option value="Last Quarter">Date Range: Last Quarter</option>
              <option value="Year to Date">Date Range: Year to Date</option>
            </select>
          </div>

          {/* Department */}
          <div className="lg:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Department: All Departments</option>
              {ADMIN_12_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Complaint Category */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Category: All Categories</option>
              <option value="Traffic & Signals">Traffic & Signals</option>
              <option value="Potholes & Roads">Potholes & Roads</option>
              <option value="Water & Sewage">Water & Sewage</option>
              <option value="Garbage & Waste">Garbage & Waste</option>
              <option value="Public Safety">Public Safety</option>
            </select>
          </div>

          {/* Area / Zone */}
          <div className="lg:col-span-2">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Zone: All Zones</option>
              <option value="Zone A - North">Zone A - North</option>
              <option value="Zone B - Central">Zone B - Central</option>
              <option value="Zone C - South">Zone C - South</option>
              <option value="Zone D - East">Zone D - East</option>
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
          4. ANALYTICS OVERVIEW (FOUR CLEAN SECTIONS)
          ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Section 1: Complaint Analytics */}
        <Card className="p-5 bg-[#111827] border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              Complaint Analytics
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Pending:</span>
              <strong className="text-amber-400 font-mono font-bold">{statusCounts.pending} Tickets</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">In Progress:</span>
              <strong className="text-blue-400 font-mono font-bold">{statusCounts.inProgress} Tickets</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Resolved:</span>
              <strong className="text-emerald-400 font-mono font-bold">{statusCounts.resolved} Fixed</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Monthly Trend:</span>
              <strong className="text-emerald-400 font-mono font-bold">+12.4% Fix Rate</strong>
            </div>
          </div>
        </Card>

        {/* Section 2: Traffic Analytics */}
        <Card className="p-5 bg-[#111827] border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-4 h-4 text-sky-400" />
              Traffic Analytics
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle Count:</span>
              <strong className="text-white font-mono font-bold">482,910 / day</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Congestion Level:</span>
              <strong className="text-emerald-400 font-mono font-bold">Low (18%)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Peak Traffic Hours:</span>
              <strong className="text-amber-400 font-mono font-bold">08:00 - 10:00 AM</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Avg Traffic Speed:</span>
              <strong className="text-white font-mono font-bold">48.5 km/h</strong>
            </div>
          </div>
        </Card>

        {/* Section 3: Department Performance */}
        <Card className="p-5 bg-[#111827] border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Department Performance
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Top Performing:</span>
              <strong className="text-emerald-400 font-bold truncate max-w-[120px]">Public Safety</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Resolution:</span>
              <strong className="text-white font-mono font-bold">3.8 hrs</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Staff Productivity:</span>
              <strong className="text-blue-400 font-mono font-bold">96.4% SLA Met</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Workload State:</span>
              <strong className="text-emerald-400 font-bold">Balanced</strong>
            </div>
          </div>
        </Card>

        {/* Section 4: City Operations */}
        <Card className="p-5 bg-[#111827] border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              City Operations
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Response:</span>
              <strong className="text-emerald-400 font-mono font-bold">4.2 mins</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Field Staff:</span>
              <strong className="text-white font-mono font-bold">1,160 Officers</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Citizen Rating:</span>
              <strong className="text-amber-400 font-mono font-bold">94.8% Positive</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Overall Grade:</span>
              <strong className="text-emerald-400 font-mono font-bold">Optimal (Grade A+)</strong>
            </div>
          </div>
        </Card>

      </div>

      {/* ====================================================
          5. VISUALIZATIONS (EXACTLY FOUR CHARTS ONLY)
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Line Chart - Monthly Complaint Trend */}
        <div className="lg:col-span-6 cursor-pointer" onClick={() => handleOpenChartDetails('line-complaint-trend')}>
          <Card className="p-6 bg-[#111827] border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-[#2563EB]/50 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                Monthly Complaint Trend (Logged vs Resolved)
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 hover:text-[#2563EB]">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="h-64 relative">
              <Line data={monthlyComplaintTrendData} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Chart 2: Bar Chart - Department Performance */}
        <div className="lg:col-span-6 cursor-pointer" onClick={() => handleOpenChartDetails('bar-dept-performance')}>
          <Card className="p-6 bg-[#111827] border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-[#2563EB]/50 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Department Performance (Rating Score / 100)
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 hover:text-[#2563EB]">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="h-64 relative">
              <Bar data={departmentPerformanceData} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Chart 3: Donut Chart - Complaint Status Distribution */}
        <div className="lg:col-span-5 cursor-pointer" onClick={() => handleOpenChartDetails('donut-status-distribution')}>
          <Card className="p-6 bg-[#111827] border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-[#2563EB]/50 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Complaint Status Distribution
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 hover:text-[#2563EB]">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="h-64 relative flex items-center justify-center">
              <Doughnut data={dynamicStatusData} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </Card>
        </div>

        {/* Chart 4: Area Chart - Traffic Density Trend */}
        <div className="lg:col-span-7 cursor-pointer" onClick={() => handleOpenChartDetails('area-traffic-density')}>
          <Card className="p-6 bg-[#111827] border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-[#2563EB]/50 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                24-Hour Traffic Density Trend (% Congestion)
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 hover:text-[#2563EB]">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="h-64 relative">
              <Line data={trafficDensityTrendData} options={chartOptions} />
            </div>
          </Card>
        </div>

      </div>

      {/* ====================================================
          6. TOP INSIGHTS PANEL (INSIGHT CARDS)
          ==================================================== */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Top Operational Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1 hover:border-emerald-500/40 transition-all">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Traffic Efficiency</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Traffic congestion decreased by <strong className="text-white">8%</strong> this month across central corridors.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1 hover:border-blue-500/40 transition-all">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Top Resolving Dept</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Road Maintenance resolved the highest volume of citizen complaints (<strong className="text-white">1,890</strong>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1 hover:border-emerald-500/40 transition-all">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">SLA Speed Improvement</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Average complaint resolution speed improved by <strong className="text-white">12%</strong> citywide.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1 hover:border-amber-500/40 transition-all">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Peak Travel Window</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Peak traffic occurs consistently between <strong className="text-white">8:00 AM and 10:00 AM</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-1 hover:border-emerald-500/40 transition-all">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Emergency Dispatch</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Emergency response time improved to <strong className="text-white">4.2 mins</strong> compared to last month.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================
          7. AI INSIGHTS (PREMIUM OBSERVATIONS SECTION)
          ==================================================== */}
      <Card className="p-6 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Automated Insights & Telemetry</h3>
              <p className="text-xs text-slate-400">Intelligent system observations for executive decision support</p>
            </div>
          </div>
          <span className="px-3 py-1 text-[11px] font-mono font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Realtime Analytics Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800/80 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">High Congestion Detection</h4>
              <p className="text-slate-300 leading-relaxed">
                High congestion detected in City Center during peak hours (08:00 AM - 10:00 AM). Signal timing adjustments recommended.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800/80 flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">Field Resource Allocation</h4>
              <p className="text-slate-300 leading-relaxed">
                Increase field staff allocation in Traffic Department to maintain 98%+ SLA compliance during upcoming weekend events.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800/80 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">Maintenance Efficiency Trend</h4>
              <p className="text-slate-300 leading-relaxed">
                Road Maintenance performance improved by 14% this week due to automated field team dispatching.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">SLA Compliance Target Exceeded</h4>
              <p className="text-slate-300 leading-relaxed">
                Complaint resolution rate exceeded target SLA by 6.2% across all 12 municipal agencies.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ====================================================
          8. ANALYTICS DETAILS SIDE DRAWER (WHEN CLICKING A CHART)
          ==================================================== */}
      <AnimatePresence>
        {chartDrawerData && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChartDrawerData(null)}
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
                    {chartDrawerData.type}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {chartDrawerData.title}
                  </h2>
                </div>
                <button
                  onClick={() => setChartDrawerData(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Summary */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metric Summary</span>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">{chartDrawerData.summary}</p>
                </div>

                {/* Trend Analysis */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Trend Analysis</span>
                  <p className="text-slate-300 leading-relaxed font-normal">{chartDrawerData.trendAnalysis}</p>
                </div>

                {/* Performance Comparison */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Performance Benchmark</span>
                  <p className="text-slate-300 leading-relaxed font-normal">{chartDrawerData.performanceComparison}</p>
                </div>

                {/* AI Observation */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Pattern Detection
                  </span>
                  <p className="text-slate-300 leading-relaxed font-normal">{chartDrawerData.aiObservation}</p>
                </div>

                {/* Recommended Action */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Recommended Executive Action</span>
                  <p className="text-white font-medium leading-relaxed">{chartDrawerData.recommendedAction}</p>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setChartDrawerData(null)}
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold"
                >
                  Close Analytics Drawer
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
