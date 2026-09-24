import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { getStatusBadgeStyle, formatDate } from '../../utils/formatters';
import { 
  FilePlus, 
  ListOrdered, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ArrowRight, 
  Bell, 
  PhoneCall, 
  TrendingUp, 
  PieChart as PieIcon, 
  Activity, 
  Eye, 
  Sparkles,
  ShieldAlert,
  Layers,
  Calendar,
  X
} from 'lucide-react';
import { SmartCityMap } from '../../components/maps/SmartCityMap';
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
import { Line, Bar, Pie } from 'react-chartjs-2';

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

interface CitizenComplaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'under_review' | 'resolved' | 'rejected';
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  assignedDepartment: string;
  assignedAgent: string;
  createdAt: string;
}

// Chart JS Datasets
const monthlyTrendData = {
  labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Submitted Complaints',
      data: [12, 19, 15, 22, 28, 18],
      backgroundColor: 'rgba(56, 189, 248, 0.7)',
      borderRadius: 6,
    },
    {
      label: 'Resolved SLA Tickets',
      data: [10, 17, 14, 20, 26, 11],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderRadius: 6,
    },
  ],
};

const categoryPieData = {
  labels: ['Road Damage', 'Garbage', 'Water Supply', 'Street Lights', 'Traffic'],
  datasets: [
    {
      data: [35, 20, 18, 15, 12],
      backgroundColor: ['#0284c7', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'],
      borderWidth: 2,
      borderColor: '#0f172a',
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { size: 11 } },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: 1,
    },
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.2)' } },
    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.2)' } },
  },
};

export const CitizenDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessDeniedAlert, setAccessDeniedAlert] = useState<boolean>(
    location.state?.accessDenied || false
  );

  const [complaints, setComplaints] = useState<CitizenComplaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitizenComplaints = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) {
          setError('Authentication token missing. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/complaints`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error('Failed to fetch citizen complaints:', data?.message);
          setError(data?.message || 'Failed to load complaints');
          setLoading(false);
          return;
        }

        const rawComplaints = data.complaints || [];

        const mappedComplaints: CitizenComplaint[] = rawComplaints.map((item: any) => ({
          id: item._id || item.id,
          ticketId:
            item.ticketId ||
            `UPN-${String(item._id || item.id).slice(-6).toUpperCase()}`,
          title: item.title || 'Untitled Complaint',
          description: item.description || '',
          category: item.category || 'General',
          priority: item.priority || 'medium',
          status: item.status || 'pending',
          location: {
            address: typeof item.location === 'string' ? item.location : (item.location?.address || 'Location not provided'),
            lat: item.location?.lat ?? 0,
            lng: item.location?.lng ?? 0,
          },
          assignedDepartment: item.assignedDepartment || 'Unassigned',
          assignedAgent: item.assignedAgent || 'Unassigned',
          createdAt: item.createdAt || new Date().toISOString(),
        }));

        setComplaints(mappedComplaints);
      } catch (err: any) {
        console.error('Error fetching citizen complaints:', err);
        setError(err?.message || 'Network error loading complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchCitizenComplaints();
  }, []);

  const totalComplaints = complaints.length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;

  const columns = [
    {
      header: 'Complaint ID',
      accessorKey: 'ticketId' as const,
      cell: (row: CitizenComplaint) => (
        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
          #{row.ticketId}
        </span>
      ),
    },
    {
      header: 'Category & Details',
      cell: (row: CitizenComplaint) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{row.title}</p>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            {row.location.address}
          </span>
        </div>
      ),
    },
    {
      header: 'Department',
      cell: (row: CitizenComplaint) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {row.assignedDepartment}
        </span>
      ),
    },
    {
      header: 'Priority',
      cell: (row: CitizenComplaint) => (
        <span
          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
            row.priority === 'critical'
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              : row.priority === 'high'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: CitizenComplaint) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(row.status)}`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (row: CitizenComplaint) => (
        <span className="text-xs text-slate-500 font-mono">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: CitizenComplaint) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/citizen/complaints/${row.id}`)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Access Denied Alert Banner */}
      {accessDeniedAlert && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-rose-200">Access Denied</h4>
              <p className="text-xs text-rose-300">You do not have administrator permissions to access that page.</p>
            </div>
          </div>
          <button 
            onClick={() => setAccessDeniedAlert(false)}
            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user ? user.name : 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor your civic requests, view live status telemetry, and stay updated.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link to="/citizen/report-complaint">
            <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25 px-6 font-bold" leftIcon={<FilePlus className="w-4 h-4" />}>
              Report New Complaint
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Complaints */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">{totalComplaints}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white flex items-center justify-center shadow-md">
                <ListOrdered className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% vs last month
              </span>
              <span className="text-slate-400">All Time</span>
            </div>
          </Card>
        </motion.div>

        {/* Pending */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Verification</p>
                <p className="text-3xl font-black text-amber-500 mt-1 font-mono">{pending}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-amber-500 font-bold">Awaiting Crew Intake</span>
              <span className="text-slate-400">SLA Active</span>
            </div>
          </Card>
        </motion.div>

        {/* In Progress */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
                <p className="text-3xl font-black text-sky-500 mt-1 font-mono">{inProgress}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-sky-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Crews Dispatched
              </span>
              <span className="text-slate-400">Active SLA</span>
            </div>
          </Card>
        </motion.div>

        {/* Resolved */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
                <p className="text-3xl font-black text-emerald-500 mt-1 font-mono">{resolved}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-500 font-bold">98.5% SLA Rate</span>
              <span className="text-slate-400">Verified</span>
            </div>
          </Card>
        </motion.div>

      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Citizen Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/citizen/report-complaint">
            <Card hoverable className="p-4 flex items-center gap-4 bg-gradient-to-r from-brand-50 to-sky-50 dark:from-brand-950/40 dark:to-sky-950/30 border border-brand-200/80 dark:border-brand-800">
              <div className="p-3 rounded-xl bg-brand-600 text-white shadow-md">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Report Complaint</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Submit new issue with GPS</p>
              </div>
            </Card>
          </Link>

          <Link to="/citizen/my-complaints">
            <Card hoverable className="p-4 flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-md">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Track Complaint</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Check live SLA status</p>
              </div>
            </Card>
          </Link>

          <Link to="/citizen/notifications">
            <Card hoverable className="p-4 flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="p-3 rounded-xl bg-sky-600 text-white shadow-md">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">View Notifications</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Read 4 unread alerts</p>
              </div>
            </Card>
          </Link>

          <Link to="/help">
            <Card hoverable className="p-4 flex items-center gap-4 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/40 dark:to-amber-950/30 border border-rose-200/80 dark:border-rose-800">
              <div className="p-3 rounded-xl bg-rose-600 text-white shadow-md">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Contacts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Helplines & 911 Desk</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Complaints Table + Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Complaints Table (Span 8) */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold">Recent Complaints Log</CardTitle>
              <Link to="/citizen/my-complaints">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All Complaints
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Table
                data={complaints.slice(0, 5)}
                columns={columns}
                keyExtractor={(r) => r.id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Timeline (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Live Incident Status Timeline
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 pt-1 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              
              {/* Step 1: Complaint Submitted */}
              <div className="relative pl-8 space-y-1">
                <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900">
                  1
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Complaint Submitted</h4>
                <p className="text-[11px] text-slate-500">Ticket #UPN-2026-1001 logged with GPS coordinates.</p>
                <span className="text-[10px] font-mono text-slate-400">10 mins ago</span>
              </div>

              {/* Step 2: Assigned */}
              <div className="relative pl-8 space-y-1">
                <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900">
                  2
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Assigned to Department</h4>
                <p className="text-[11px] text-slate-500">Public Works & Roads assigned Officer Michael Vance.</p>
                <span className="text-[10px] font-mono text-slate-400">8 mins ago</span>
              </div>

              {/* Step 3: Under Review */}
              <div className="relative pl-8 space-y-1">
                <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900">
                  3
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Under Inspection & Dispatch</h4>
                <p className="text-[11px] text-slate-500">Crew 4 asphalt truck en route to location.</p>
                <span className="text-[10px] font-mono text-slate-400">5 mins ago</span>
              </div>

              {/* Step 4: Resolved */}
              <div className="relative pl-8 space-y-1">
                <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900">
                  4
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Issue Resolved & Closed</h4>
                <p className="text-[11px] text-slate-500">AI optical check verified repair completion.</p>
                <span className="text-[10px] font-mono text-emerald-500 font-semibold">Just now</span>
              </div>

            </div>
          </Card>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Complaint Trend (Span 8) */}
        <div className="lg:col-span-8">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Complaint Trend & SLA Fixes</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Last 6 Months</span>
            </div>
            <div className="h-64 relative">
              <Bar data={monthlyTrendData} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Categories Pie Chart (Span 4) */}
        <div className="lg:col-span-4">
          <Card className="p-5 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-sky-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Complaint Categories</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Distribution</span>
            </div>
            <div className="h-60 relative flex items-center justify-center">
              <Pie data={categoryPieData} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
