import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { getStatusBadgeStyle, openGoogleMaps } from '../../utils/formatters';
import { ComplaintStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  RefreshCw,
  CheckSquare,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

interface StaffComplaint {
  _id: string;
  id?: string;
  ticketId?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: ComplaintStatus;
  citizen?: {
    fullName?: string;
    email?: string;
    username?: string;
  };
  assignedAgent?: string;
  assignedDepartment?: string;
  remarks?: string;
  createdAt: string;
}

export const StaffDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<StaffComplaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch real complaints assigned to logged-in staff from GET /api/staff/complaints
  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem('urbanpulse_auth_token') ||
        sessionStorage.getItem('urbanpulse_auth_token');

      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/staff/complaints`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else {
        console.error('Failed to fetch staff complaints:', data?.message);
      }
    } catch (error) {
      console.error('Error fetching staff complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  // Staff Complaint Status Progression: pending -> in_progress -> under_review -> resolved
  const handleUpdateStatus = async (complaint: StaffComplaint) => {
    let nextStatus: ComplaintStatus;

    switch (complaint.status) {
      case 'pending':
      case 'submitted' as any:
        nextStatus = 'in_progress';
        break;
      case 'in_progress':
        nextStatus = 'under_review';
        break;
      case 'under_review':
        nextStatus = 'resolved';
        break;
      case 'resolved':
      default:
        return; // Already resolved
    }

    try {
      setUpdatingId(complaint._id || complaint.id || '');
      const token =
        localStorage.getItem('urbanpulse_auth_token') ||
        sessionStorage.getItem('urbanpulse_auth_token');

      if (!token) {
        alert('Authentication token missing. Please log in again.');
        return;
      }

      const complaintId = complaint._id || complaint.id;

      const response = await fetch(
        `${API_BASE_URL}/staff/complaints/${complaintId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: nextStatus,
            remarks: `Status updated to ${nextStatus.replace('_', ' ')} by staff officer.`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to update complaint status.');
        return;
      }

      // Immediately refresh assigned complaints from backend
      await fetchAssignedComplaints();
    } catch (error) {
      console.error('Error updating staff complaint status:', error);
      alert('Failed to connect to backend service.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return 'Start Work (In Progress)';
      case 'in_progress':
        return 'Submit for Review';
      case 'under_review':
        return 'Mark as Resolved';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Update Status';
    }
  };

  const activeComplaintsCount = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'rejected'
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === 'resolved'
  ).length;

  const handleOpenGoogleMaps = (e: React.MouseEvent, item: StaffComplaint) => {
    e.stopPropagation();
    openGoogleMaps(item.latitude, item.longitude, item.location);
  };

  const columns = [
    {
      header: 'Ticket ID',
      cell: (row: StaffComplaint) => (
        <span className="font-mono text-xs font-bold text-brand-400">
          #{row.ticketId || row._id?.slice(-6).toUpperCase() || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Complaint & Location',
      cell: (row: StaffComplaint) => (
        <div>
          <p className="font-bold text-white text-xs">{row.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              {row.location}
            </span>
            <button
              type="button"
              onClick={(e) => handleOpenGoogleMaps(e, row)}
              className="text-[10px] font-bold text-brand-400 hover:underline shrink-0"
              title="Open location on Google Maps"
            >
              Open in Google Maps ↗
            </button>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      cell: (row: StaffComplaint) => (
        <span className="text-xs text-slate-300 font-medium">
          {row.assignedDepartment || user?.department || 'Municipal Services'}
        </span>
      ),
    },
    {
      header: 'Priority',
      cell: (row: StaffComplaint) => (
        <span
          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
            row.priority === 'critical' || row.priority === 'high'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: StaffComplaint) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(row.status)}`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (row: StaffComplaint) => {
        if (row.status === 'resolved') {
          return (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
            </span>
          );
        }

        return (
          <Button
            variant="outline"
            size="sm"
            disabled={updatingId === (row._id || row.id)}
            onClick={() => handleUpdateStatus(row)}
            className="text-xs py-1 px-3 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={
              <RefreshCw className={`w-3 h-3 text-brand-400 ${updatingId === (row._id || row.id) ? 'animate-spin' : ''}`} />
            }
          >
            {getNextStatusLabel(row.status)}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white max-w-7xl mx-auto">
      
      {/* Welcome Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user ? user.name : 'Staff Officer'}!
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Building2 className="w-4 h-4 text-brand-400" />
              Assigned Dept:{' '}
              <strong className="text-white">
                {user?.department || 'Municipal Operations'}
              </strong>
            </span>

            <span className="text-slate-600">•</span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Shift — On Duty
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-800 bg-[#111827] text-slate-300 hover:text-white text-xs font-bold"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 text-brand-400 ${loading ? 'animate-spin' : ''}`} />}
            onClick={fetchAssignedComplaints}
          >
            Refresh Duty Log
          </Button>
        </div>
      </div>

      {/* Grid Layout: Assigned Complaints Cards & Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Assigned Complaints / Work Orders (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-[#111827] border-slate-800 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-brand-400" />
                  Assigned Municipal Complaints
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complaints assigned to you by Municipal Admin for resolution
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-brand-400 bg-brand-950 px-2.5 py-1 rounded-lg border border-brand-500/30">
                {resolvedCount} / {complaints.length} Resolved
              </span>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                  Loading assigned complaints from MongoDB...
                </div>
              ) : complaints.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <FileCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Assigned Complaints</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You currently have no active municipal complaints assigned to your duty queue.
                  </p>
                </div>
              ) : (
                complaints.map((item) => (
                  <div
                    key={item._id || item.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      item.status === 'resolved'
                        ? 'bg-slate-950/50 border-slate-800/80 opacity-75'
                        : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-brand-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            #{item.ticketId || item._id?.slice(-6).toUpperCase()}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border shrink-0 ${
                        item.priority === 'critical' || item.priority === 'high'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                          <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                          {item.location}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleOpenGoogleMaps(e, item)}
                          className="text-[10px] font-bold text-brand-400 hover:underline shrink-0"
                          title="Open location on Google Maps"
                        >
                          View Location
                        </button>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          {item.assignedDepartment || user?.department}
                        </span>
                      </div>

                      {item.status !== 'resolved' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingId === (item._id || item.id)}
                          onClick={() => handleUpdateStatus(item)}
                          className="text-[11px] py-1 px-2.5 border-slate-800 hover:bg-slate-800 text-slate-200 font-bold"
                          leftIcon={<RefreshCw className={`w-3 h-3 text-brand-400 ${updatingId === (item._id || item.id) ? 'animate-spin' : ''}`} />}
                        >
                          {getNextStatusLabel(item.status)}
                        </Button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Complaint Resolved
                        </span>
                      )}
                    </div>

                    {item.remarks && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                        <span className="text-slate-500 font-bold block text-[9px] uppercase">Remarks / Progress Note:</span>
                        {item.remarks}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info & Resolution Workflow (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#111827] border-slate-800 shadow-xl">
            <CardHeader className="border-b border-slate-800 pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-400" />
                Staff Operational Duty Info
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white">Department</h5>
                  <p className="text-slate-400 text-[11px]">{user?.department || 'Municipal Administration'}</p>
                </div>
                <span className="text-[10px] font-bold text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-500/30">
                  Assigned Unit
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white">Active Complaints</h5>
                  <p className="text-slate-400 text-[11px]">{activeComplaintsCount} Pending / In-Progress</p>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Duty Queue
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white">Resolved Complaints</h5>
                  <p className="text-slate-400 text-[11px]">{resolvedCount} Completed Tickets</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Completed
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-slate-800 shadow-xl">
            <CardHeader className="border-b border-slate-800 pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Complaint Resolution Workflow
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-white block">Pending (Assigned by Admin)</strong>
                  <span className="text-[11px] text-slate-400">Click "Start Work" to begin field resolution.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-white block">In Progress (Field Work Active)</strong>
                  <span className="text-[11px] text-slate-400">Complete repairs and submit for review.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-white block">Under Review (Inspection)</strong>
                  <span className="text-[11px] text-slate-400">Final inspection before marking resolved.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  4
                </div>
                <div>
                  <strong className="text-white block">Resolved (Completed)</strong>
                  <span className="text-[11px] text-slate-400">Complaint resolution confirmed and closed.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complaints Table Overview */}
      <Card className="bg-[#111827] border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-400" />
              Assigned Complaint Duty Log
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Live complaint duty records assigned to your staff profile
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {complaints.length} Total Assigned Records
          </span>
        </CardHeader>

        <CardContent className="pt-4 p-0">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading duty log...</div>
          ) : complaints.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No active assigned complaint records in duty log.</div>
          ) : (
            <Table
              data={complaints}
              columns={columns}
              keyExtractor={(row) => row._id || row.id || Math.random().toString()}
            />
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default StaffDashboardPage;