import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { getStatusBadgeStyle } from '../../utils/formatters';
import {
  ListOrdered,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  MapPin,
  ArrowRight,
  Radio,
  BarChart3,
  Eye
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
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ComplaintStatus } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminDashboardComplaint {
  _id?: string;
  id?: string;
  ticketId?: string;
  citizen?: {
    _id?: string;
    fullName?: string;
    email?: string;
    username?: string;
    name?: string;
    avatar?: string;
  };
  submittedBy?: {
    name?: string;
    avatar?: string;
  };
  category: string;
  assignedDepartment: string;
  priority: string;
  status: string;
  assignedAgent?: string;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(51, 65, 85, 0.2)' } },
    y: { ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 1 }, grid: { color: 'rgba(51, 65, 85, 0.2)' } },
  },
};

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<AdminDashboardComplaint[]>([]);
  const [stats, setStats] = useState<{ citizensCount?: number; staffCount?: number } | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/admin/complaints`, {
          headers,
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        }

        const statsResponse = await fetch(`${API_BASE_URL}/admin/complaints/stats`, {
          headers,
        });

        const statsData = await statsResponse.json();

        if (statsData.success && statsData.stats) {
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error('Failed to load admin dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  // Compute real dynamic chart data based on MongoDB complaints status
  const pendingCount = complaints.filter(c => c.status === 'pending' || c.status === 'submitted').length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length;
  const underReviewCount = complaints.filter(c => c.status === 'under_review').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const rejectedCount = complaints.filter(c => c.status === 'rejected').length;

  const realChartData = {
    labels: ['Pending', 'In Progress', 'Under Review', 'Resolved', 'Rejected'],
    datasets: [
      {
        label: 'Complaint Records',
        data: [pendingCount, inProgressCount, underReviewCount, resolvedCount, rejectedCount],
        backgroundColor: [
          'rgba(245, 158, 11, 0.75)',
          'rgba(59, 130, 246, 0.75)',
          'rgba(168, 85, 247, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(239, 68, 68, 0.75)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const columns = [
    {
      header: 'Ticket ID',
      accessorKey: 'ticketId' as const,
      cell: (row: AdminDashboardComplaint) => (
        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
          #{row.ticketId || row._id?.slice(-6).toUpperCase() || row.id || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Citizen',
      cell: (row: AdminDashboardComplaint) => {
        const citizenName =
          row.citizen?.fullName ||
          row.citizen?.name ||
          row.submittedBy?.name ||
          'Citizen';
        const citizenAvatar =
          row.citizen?.avatar ||
          row.submittedBy?.avatar ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100';

        return (
          <div className="flex items-center gap-2">
            <img src={citizenAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{citizenName}</span>
          </div>
        );
      },
    },
    {
      header: 'Category',
      cell: (row: AdminDashboardComplaint) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Department',
      cell: (row: AdminDashboardComplaint) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {row.assignedDepartment}
        </span>
      ),
    },
    {
      header: 'Priority',
      cell: (row: AdminDashboardComplaint) => (
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
      cell: (row: AdminDashboardComplaint) => {
        const validStatus: ComplaintStatus = (row.status && ['pending', 'in_progress', 'under_review', 'resolved', 'rejected'].includes(row.status))
          ? (row.status as ComplaintStatus)
          : 'pending';

        return (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(validStatus)}`}>
            {row.status.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      header: 'Officer',
      cell: (row: AdminDashboardComplaint) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {row.assignedAgent || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: () => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/complaints')}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Municipal Operations Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Municipal Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time monitoring of municipal complaints, department assignments, and Vijayawada reference infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link to="/admin/complaints">
            <Button variant="primary" size="md" className="shadow-lg shadow-brand-500/25 font-bold" leftIcon={<ListOrdered className="w-4 h-4" />}>
              Complaint Management
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

        {/* Total Complaints */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Complaints</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">{complaints.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                <ListOrdered className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
              Total System Complaints
            </div>
          </Card>
        </motion.div>

        {/* Resolved */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
                <p className="text-2xl font-black text-emerald-500 mt-0.5 font-mono">{resolvedCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
              Successfully Resolved
            </div>
          </Card>
        </motion.div>

        {/* Pending Action */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Action</p>
                <p className="text-2xl font-black text-amber-500 mt-0.5 font-mono">{pendingCount + inProgressCount + underReviewCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
              Awaiting Resolution
            </div>
          </Card>
        </motion.div>

        {/* Municipal Departments */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Departments</p>
                <p className="text-2xl font-black text-sky-500 mt-0.5 font-mono">6</p>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
              Municipal Sectors
            </div>
          </Card>
        </motion.div>

        {/* Registered Citizens / Users */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Users</p>
                <p className="text-2xl font-black text-purple-500 mt-0.5 font-mono">{stats?.citizensCount ?? 0}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
              User Accounts
            </div>
          </Card>
        </motion.div>

        {/* Traffic Reference Points */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Traffic Reference</p>
                <p className="text-2xl font-black text-indigo-500 mt-0.5 font-mono">6 Points</p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
              Traffic Reference Points
            </div>
          </Card>
        </motion.div>

      </div>

      {/* Traffic Reference Overview Card */}
      <Card className="p-6 bg-slate-900 text-white border border-slate-800 shadow-xl rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-600/30 text-brand-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Traffic Reference Overview</h3>
              <p className="text-xs text-slate-400">Vijayawada traffic reference monitoring locations and infrastructure info.</p>
            </div>
          </div>

          <Link to="/admin/traffic">
            <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-800">
              Open Traffic Monitoring
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 font-mono">
            <span className="block text-[10px] text-slate-400 uppercase font-sans font-semibold">Monitoring Points</span>
            <strong className="text-lg font-bold text-white">6 Reference Points</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 font-mono">
            <span className="block text-[10px] text-slate-400 uppercase font-sans font-semibold">Public Live Feeds</span>
            <strong className="text-lg font-bold text-amber-400">Not Available</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 font-mono">
            <span className="block text-[10px] text-slate-400 uppercase font-sans font-semibold">Location Standard</span>
            <strong className="text-lg font-bold text-emerald-400">Vijayawada GIS</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 font-mono">
            <span className="block text-[10px] text-slate-400 uppercase font-sans font-semibold">Verified Source</span>
            <strong className="text-lg font-bold text-brand-400">VMC CDMA & Police Ref</strong>
          </div>
        </div>
      </Card>

      {/* Main Grid: Complaints Management Preview Table & Real Complaints Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Complaints Data Table Preview (Span 8) */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between border border-slate-200 dark:border-slate-800 rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold">Recent Complaints Log</CardTitle>
              <Link to="/admin/complaints">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All Complaints
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Table
                data={complaints.slice(0, 6)}
                columns={columns}
                keyExtractor={(r) => r._id || r.id || r.ticketId || Math.random().toString()}
              />
            </CardContent>
          </Card>
        </div>

        {/* Real Complaint Status Chart (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Complaint Status Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-400">MongoDB Data</span>
            </div>

            <div className="h-64 relative">
              <Bar data={realChartData} options={chartOptions} />
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
