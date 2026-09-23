import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_12_DEPARTMENTS } from '../../data/adminData';
import { CITIZEN_COMPLAINT_CATEGORIES } from '../../data/citizenData';
import { Complaint, ComplaintStatus, Priority } from '../../types';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate, openGoogleMaps } from '../../utils/formatters';
import { SmartCityMap } from '../../components/maps/SmartCityMap';
import {
  Search,
  Clock,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  ListOrdered,
  RefreshCw,
  UserCheck,
  FileSearch,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const ComplaintManagementPage: React.FC = () => {
  const [complaintsList, setComplaintsList] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);  // Load real complaints from MongoDB
  const loadComplaints = async () => {
    try {
      setLoadingComplaints(true);
      setComplaintsError(null);
      const token = localStorage.getItem('urbanpulse_auth_token') || sessionStorage.getItem('urbanpulse_auth_token');
      if (!token) {
        throw new Error('Admin login token not found. Please log in again.');
      }
      const response = await fetch(
        'http://localhost:5000/api/admin/complaints',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to load complaints'
        );
      }
      const mappedComplaints: Complaint[] = data.complaints.map(
        (item: any) => ({
          id: item._id,
          ticketId:
            item.ticketId ||
            `CMP-${String(item._id).slice(-6).toUpperCase()}`,
          title: item.title,
          description: item.description,
          category: item.category as any,
          priority: item.priority,
          status: item.status,
          location: {
            address: item.location,
            lat: typeof item.latitude === 'number' && !isNaN(item.latitude) ? item.latitude : 0,
            lng: typeof item.longitude === 'number' && !isNaN(item.longitude) ? item.longitude : 0,
            zone: 'Unknown',
          },
          latitude: typeof item.latitude === 'number' && !isNaN(item.latitude) ? item.latitude : undefined,
          longitude: typeof item.longitude === 'number' && !isNaN(item.longitude) ? item.longitude : undefined,
          submittedBy: {
            id: item.citizen?._id || item.citizen || '',
            name:
              item.citizen?.fullName ||
              item.citizen?.name ||
              'Unknown Citizen',
            email:
              item.citizen?.email ||
              '',
          },
          assignedDepartment:
            item.assignedDepartment ||
            'Unassigned',
          assignedAgent:
            item.assignedAgent ||
            'Unassigned',
          images: [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          slaDueDate:
            item.slaDueDate ||
            item.createdAt,
          upvotes: item.upvotes || 0,
          activities: item.activities || [],
        })
      );
      setComplaintsList(mappedComplaints);
    } catch (error: any) {
      console.error('Load admin complaints error:', error);
      setComplaintsError(
        error?.message ||
        'Unable to load complaints'
      );
    } finally {
      setLoadingComplaints(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadComplaints();

        const token = localStorage.getItem('urbanpulse_auth_token') || sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) {
          console.error('No authentication token found');
          return;
        }

        // Fetch real staff users
        const staffResponse = await fetch(
          'http://localhost:5000/api/admin/complaints/staff',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const staffData = await staffResponse.json();

        if (staffData.success) {
          setStaffUsers(staffData.staff);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };

    fetchData();
  }, []);
const [complaintsError, setComplaintsError] = useState<string | null>(null);

// Search & Filter States
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<string>('all');
const [categoryFilter, setCategoryFilter] = useState<string>('all');
const [priorityFilter, setPriorityFilter] = useState<string>('all');
const [departmentFilter, setDepartmentFilter] = useState<string>('all');
const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');

// Modals & Drawer States
const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null); // For View Side Drawer
const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null); // For Assign Modal
const [updateModalComplaint, setUpdateModalComplaint] = useState<Complaint | null>(null); // For Update Modal
const [newComplaintModalOpen, setNewComplaintModalOpen] = useState<boolean>(false);
const [exportNotice, setExportNotice] = useState<string | null>(null);

// Form states inside Assign Modal
const [assignDepartment, setAssignDepartment] = useState<string>('Public Health & Sanitation');
const [assignStaff, setAssignStaff] = useState<string>('');
const [staffUsers, setStaffUsers] = useState<any[]>([]);

const availableStaff = useMemo(() => {
  if (!assignDepartment) return [];
  return staffUsers.filter((s) => {
    const isStaff = s.role === 'staff' || !s.role;
    const isActive = s.isActive !== false;
    return isStaff && isActive && s.department === assignDepartment;
  });
}, [staffUsers, assignDepartment]);

useEffect(() => {
  if (assignModalComplaint) {
    const matchingStaff = staffUsers.filter((s) => {
      const isStaff = s.role === 'staff' || !s.role;
      const isActive = s.isActive !== false;
      return isStaff && isActive && s.department === assignDepartment;
    });
    const staffName = assignStaff;
    const exists = matchingStaff.some((s) => (s.fullName || s.name) === staffName);
    if (!exists) {
      if (matchingStaff.length > 0) {
        setAssignStaff(matchingStaff[0].fullName || matchingStaff[0].name);
      } else {
        setAssignStaff('');
      }
    }
  }
}, [assignDepartment, assignModalComplaint, staffUsers]);
const [assignPriority, setAssignPriority] = useState<Priority>('high');
const [assignDueDate, setAssignDueDate] = useState<string>('2026-07-30');

// Form states inside Update Modal
const [updateStatus, setUpdateStatus] = useState<ComplaintStatus>('in_progress');
const [updateRemarks, setUpdateRemarks] = useState<string>('');

// Form states inside New Complaint Modal
const [newCitizenName, setNewCitizenName] = useState<string>('');
const [newCategory, setNewCategory] = useState<string>('Pothole & Roads');
const [newDepartment, setNewDepartment] = useState<string>('Traffic Operations');
const [newPriority, setNewPriority] = useState<Priority>('high');
const [newLocation, setNewLocation] = useState<string>('');
const [newDescription, setNewDescription] = useState<string>('');

// Pagination State
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

// Reset all search and dropdown filters
const handleResetFilters = () => {
  setSearchTerm('');
  setStatusFilter('all');
  setCategoryFilter('all');
  setPriorityFilter('all');
  setDepartmentFilter('all');
  setDateRangeFilter('all');
  setCurrentPage(1);
};

// Filtered Data Computation
const filteredData = useMemo(() => {
  return complaintsList.filter((item) => {
    const matchesSearch =
      item.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'all' || item.assignedDepartment === departmentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDepartment;
  });
}, [complaintsList, searchTerm, statusFilter, categoryFilter, priorityFilter, departmentFilter]);

// Paginated Data
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filteredData.slice(start, start + itemsPerPage);
}, [filteredData, currentPage, itemsPerPage]);

// Counts for 4 Summary Cards
const totalCount = complaintsList.length;
const pendingCount = complaintsList.filter(c => c.status === 'pending').length;
const inProgressCount = complaintsList.filter(c => c.status === 'in_progress' || c.status === 'under_review').length;
const resolvedCount = complaintsList.filter(c => c.status === 'resolved').length;

// Handle Export Action
const handleExport = () => {
  setExportNotice(`Exporting ${filteredData.length} records as CSV/PDF report...`);
  setTimeout(() => setExportNotice(null), 3000);
};

// Handle Assign Staff Form Submission
const handleAssignSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!assignModalComplaint) return;

  try {
    const token =
      localStorage.getItem('urbanpulse_auth_token') ||
      sessionStorage.getItem('urbanpulse_auth_token');

    if (!token) {
      alert('Authentication token not found. Please login again.');
      return;
    }

    const complaintId = assignModalComplaint.id;

    const response = await fetch(
      `http://localhost:5000/api/admin/complaints/${complaintId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignedDepartment: assignDepartment,
          assignedAgent: assignStaff,
          priority: assignPriority,
          slaDueDate: assignDueDate || null,
          status: 'in_progress',
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Assignment failed:', result);
      alert(result.message || 'Failed to assign complaint.');
      return;
    }

    const updatedComplaint = result.complaint;

    setComplaintsList(prev =>
      prev.map(c =>
        c.id === complaintId
          ? {
            ...c,
            assignedDepartment:
              updatedComplaint.assignedDepartment || assignDepartment,
            assignedAgent:
              updatedComplaint.assignedAgent || assignStaff,
            priority:
              updatedComplaint.priority || assignPriority,
            slaDueDate:
              updatedComplaint.slaDueDate || assignDueDate,
            status:
              updatedComplaint.status || 'in_progress',
            activities:
              updatedComplaint.activities || c.activities || [],
          }
          : c
      )
    );

    if (
      selectedComplaint &&
      selectedComplaint.id === complaintId
    ) {
      setSelectedComplaint(prev =>
        prev
          ? {
            ...prev,
            assignedDepartment:
              updatedComplaint.assignedDepartment || assignDepartment,
            assignedAgent:
              updatedComplaint.assignedAgent || assignStaff,
            priority:
              updatedComplaint.priority || assignPriority,
            slaDueDate:
              updatedComplaint.slaDueDate || assignDueDate,
            status:
              updatedComplaint.status || 'in_progress',
            activities:
              updatedComplaint.activities ||
              prev.activities ||
              [],
          }
          : null
      );
    }

    setAssignModalComplaint(null);
  } catch (error) {
    console.error('Assignment request failed:', error);
    alert('Could not connect to the backend.');
  }
};
// Handle Update Status Submission
const handleUpdateSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!updateModalComplaint) return;

  try {
    const token =
      localStorage.getItem('urbanpulse_auth_token') ||
      sessionStorage.getItem('urbanpulse_auth_token');

    if (!token) {
      alert('Authentication token not found. Please login again.');
      return;
    }

    const complaintId = updateModalComplaint.id;

    const response = await fetch(
      `http://localhost:5000/api/admin/complaints/${complaintId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: updateStatus,
          remarks: updateRemarks,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Status update failed:', result);
      alert(result.message || 'Failed to update complaint.');
      return;
    }

    const updatedComplaint = result.complaint;

    setComplaintsList(prev =>
      prev.map(c =>
        c.id === complaintId
          ? {
            ...c,
            status: updatedComplaint.status || updateStatus,
            activities:
              updatedComplaint.activities || c.activities || [],
          }
          : c
      )
    );

    if (
      selectedComplaint &&
      selectedComplaint.id === complaintId
    ) {
      setSelectedComplaint(prev =>
        prev
          ? {
            ...prev,
            status: updatedComplaint.status || updateStatus,
            activities:
              updatedComplaint.activities ||
              prev.activities ||
              [],
          }
          : null
      );
    }

    setUpdateModalComplaint(null);
  } catch (error) {
    console.error('Status update request failed:', error);
    alert('Could not connect to the backend.');
  }
};

// Handle New Complaint Submission
const handleCreateComplaintSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newCitizenName || !newDescription) return;

  try {
    const token =
      localStorage.getItem('urbanpulse_auth_token') ||
      sessionStorage.getItem('urbanpulse_auth_token');

    if (!token) {
      alert('Authentication token not found. Please login again.');
      return;
    }

    const response = await fetch(
      'http://localhost:5000/api/admin/complaints',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          citizenName: newCitizenName,
          title: `${newCategory} Report at ${newLocation || 'City Center'
            }`,
          description: newDescription,
          category: newCategory,
          department: newDepartment,
          priority: newPriority,
          location: newLocation || 'City Center',
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Create complaint failed:', result);
      alert(result.message || 'Failed to create complaint.');
      return;
    }

    alert('Complaint created successfully.');

    setNewComplaintModalOpen(false);

    setNewCitizenName('');
    setNewDescription('');
    setNewLocation('');

    await loadComplaints();
  } catch (error) {
    console.error('Create complaint request failed:', error);
    alert('Could not connect to the backend.');
  }
};

// Helper for Priority Badge
const renderPriorityBadge = (priority: Priority) => {
  switch (priority) {
    case 'critical':
    case 'high':
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400">
          High
        </span>
      );
    case 'medium':
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
          Medium
        </span>
      );
    case 'low':
    default:
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Low
        </span>
      );
  }
};

// Helper for Status Badge
const renderStatusBadge = (status: ComplaintStatus) => {
  switch (status) {
    case 'pending':
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
          Pending
        </span>
      );
    case 'in_progress':
    case 'under_review':
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
          In Progress
        </span>
      );
    case 'resolved':
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Resolved
        </span>
      );
    case 'rejected':
    default:
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-800 border border-slate-700 text-slate-400">
          Assigned
        </span>
      );
  }
};

// Table Column Definitions
const columns = [
  {
    header: 'Complaint ID',
    accessorKey: 'ticketId' as const,
    cell: (row: Complaint) => (
      <span className="font-mono text-xs font-bold text-[#2563EB]">
        #{row.ticketId}
      </span>
    ),
  },
  {
    header: 'Citizen Name',
    cell: (row: Complaint) => (
      <div className="flex items-center gap-2">
        <img src={row.submittedBy.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
        <span className="text-xs font-semibold text-white truncate">{row.submittedBy.name}</span>
      </div>
    ),
  },
  {
    header: 'Category',
    cell: (row: Complaint) => (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#0F172A] border border-slate-800 text-slate-300">
        {row.category}
      </span>
    ),
  },
  {
    header: 'Location',
    cell: (row: Complaint) => {
      const locAddress = typeof row.location === 'string'
        ? row.location
        : (row.location?.address || 'Location not provided');

      const handleOpenGoogleMaps = (e: React.MouseEvent) => {
        e.stopPropagation();
        openGoogleMaps(row.latitude, row.longitude, row.location);
      };

      return (
        <div className="flex items-center justify-between gap-1.5 max-w-[190px]">
          <span className="text-xs text-slate-300 font-medium truncate" title={locAddress}>
            {locAddress}
          </span>
          <button
            type="button"
            onClick={handleOpenGoogleMaps}
            className="px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB] hover:text-blue-300 hover:bg-slate-800 rounded border border-blue-900/50 transition-colors shrink-0 flex items-center gap-0.5"
            title="Open exact location on Google Maps"
          >
            <MapPin className="w-3 h-3 text-[#2563EB]" />
            Maps ↗
          </button>
        </div>
      );
    },
  },
  {
    header: 'Priority',
    cell: (row: Complaint) => renderPriorityBadge(row.priority),
  },
  {
    header: 'Assigned Staff',
    cell: (row: Complaint) => (
      <span className="text-xs font-medium text-slate-300 truncate max-w-[130px] block">
        {row.assignedAgent || 'Unassigned'}
      </span>
    ),
  },
  {
    header: 'Status',
    cell: (row: Complaint) => renderStatusBadge(row.status),
  },
  {
    header: 'Created Date',
    cell: (row: Complaint) => (
      <span className="text-xs text-slate-400 font-mono">{formatDate(row.createdAt)}</span>
    ),
  },
  {
    header: 'Actions',
    cell: (row: Complaint) => (
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedComplaint(row)}
          className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
          leftIcon={<Eye className="w-3 h-3 text-[#2563EB]" />}
        >
          View
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setAssignModalComplaint(row);
            setAssignDepartment(row.assignedDepartment);
            setAssignStaff(row.assignedAgent && row.assignedAgent !== 'Unassigned' ? row.assignedAgent : '');
          }}
          className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
          leftIcon={<UserCheck className="w-3 h-3 text-sky-400" />}
        >
          Assign
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setUpdateModalComplaint(row);
            setUpdateStatus(row.status);
          }}
          className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
          leftIcon={<RefreshCw className="w-3 h-3 text-emerald-400" />}
        >
          Update
        </Button>
      </div>
    ),
  },
];

return (
  <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white">

    {/* ====================================================
          1. HEADER (Only + New Complaint & Export Report)
          ==================================================== */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Complaint Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Monitor, assign and manage citizen complaints across all municipal departments.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
          className="border-slate-800 bg-[#111827] text-slate-300 hover:text-white text-xs font-bold"
        >
          Export Report
        </Button>
      </div>
    </div>

    {exportNotice && (
      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" /> {exportNotice}
      </div>
    )}

    {/* ====================================================
          2. SUMMARY CARDS (EXACTLY FOUR COMPACT CARDS)
          ==================================================== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      {/* Card 1: Total Complaints */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Total Complaints</span>
          <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
            <ListOrdered className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-white font-mono">{totalCount}</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +8.4% vs last week
          </span>
        </div>
      </div>

      {/* Card 2: Pending */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Pending</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" /> -3.2% vs last week
          </span>
        </div>
      </div>

      {/* Card 3: In Progress */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">In Progress</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-blue-400 font-mono">{inProgressCount}</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12.1% vs last week
          </span>
        </div>
      </div>

      {/* Card 4: Resolved */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Resolved</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-400 font-mono">{resolvedCount}</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.5% vs last week
          </span>
        </div>
      </div>

    </div>

    {/* ====================================================
          3. SEARCH & FILTER BAR
          ==================================================== */}
    <Card className="p-4 bg-[#111827] border-slate-800 shadow-xl space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-center">

        {/* Search Input */}
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Complaint..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">Category: All</option>
            {CITIZEN_COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="lg:col-span-2">
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">Priority: All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">Status: All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Department Filter */}
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

        {/* Reset Filters Button */}
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
          4. COMPLAINT TABLE & EMPTY STATE
          ==================================================== */}
    <Card className="overflow-hidden border border-slate-800 shadow-xl bg-[#111827]">
      {paginatedData.length > 0 ? (
        <Table data={paginatedData} columns={columns} keyExtractor={(r) => r.id} />
      ) : (
        /* Empty State */
        <div className="py-16 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FileSearch className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No complaints available.</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no citizen complaints matching your selected search or filter criteria.
            </p>
          </div>
        </div>
      )}
    </Card>

    {/* Pagination Controls */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400">
        <span>
          Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredData.length} Total Complaints)
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
          5. COMPLAINT DETAILS SIDE DRAWER (VIEW ACTION)
          ==================================================== */}
    <AnimatePresence>
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedComplaint(null)}
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
                  #{selectedComplaint.ticketId}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedComplaint.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

              {/* Citizen Info Card */}
              <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Citizen Information
                </span>
                <div className="flex items-center gap-3">
                  <img src={selectedComplaint.submittedBy.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedComplaint.submittedBy.name}</h4>
                    <p className="text-slate-400">{selectedComplaint.submittedBy.email}</p>
                  </div>
                </div>
              </div>

              {/* Complaint Overview */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Category</span>
                    <p className="font-bold text-white">{selectedComplaint.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Priority</span>
                    <div>{renderPriorityBadge(selectedComplaint.priority)}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Description</span>
                  <p className="text-slate-300 leading-relaxed font-normal">{selectedComplaint.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Location Address</span>
                    <button
                      type="button"
                      onClick={() => openGoogleMaps(selectedComplaint.latitude, selectedComplaint.longitude, selectedComplaint.location)}
                      className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" /> Open in Google Maps ↗
                    </button>
                  </div>
                  <p className="text-white font-medium flex items-center gap-1.5">
                    {typeof selectedComplaint.location === 'string'
                      ? selectedComplaint.location
                      : (selectedComplaint.location?.address || 'Location not provided')}
                  </p>
                </div>
              </div>

              {/* Complaint Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Complaint Timeline
                </h4>

                <div className="space-y-3 border-l-2 border-slate-800 pl-4 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <p className="font-bold text-white">Complaint Submitted</p>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDate(selectedComplaint.createdAt)} â€¢ 09:12 AM</span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <p className="font-bold text-white">Assigned to Department ({selectedComplaint.assignedDepartment})</p>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDate(selectedComplaint.createdAt)} â€¢ 09:45 AM</span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    <p className="font-bold text-white">Staff Assigned ({selectedComplaint.assignedAgent || 'Field Team'})</p>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDate(selectedComplaint.createdAt)} â€¢ 10:15 AM</span>
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ${selectedComplaint.status === 'resolved' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                    <p className="font-bold text-white">Work Started</p>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDate(selectedComplaint.createdAt)} â€¢ 11:30 AM</span>
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ${selectedComplaint.status === 'resolved' ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                    <p className={`font-bold ${selectedComplaint.status === 'resolved' ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {selectedComplaint.status === 'resolved' ? 'Resolved' : 'Pending Resolution'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image & Map Previews */}
              <div className="space-y-3">
                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div>
                    <h4 className="font-bold text-white text-xs mb-1.5">Attached Image</h4>
                    <img src={selectedComplaint.images[0]} alt="" className="h-32 w-full object-cover rounded-xl border border-slate-800" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-white text-xs mb-1.5">Geotagged Location Map</h4>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <SmartCityMap height="140px" showTrafficSensors={false} />
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUpdateModalComplaint(selectedComplaint);
                }}
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-emerald-400" />}
                className="border-slate-800 text-slate-300"
              >
                Update Status
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedComplaint(null)}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold"
              >
                Close Drawer
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* ====================================================
          6. ASSIGN STAFF MODAL
          ==================================================== */}
    <AnimatePresence>
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Assign Staff Personnel</h3>
              <button onClick={() => setAssignModalComplaint(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Department</label>
                <select
                  value={assignDepartment}
                  onChange={(e) => setAssignDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                >
                  {ADMIN_12_DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Available Staff</label>
                <select
                  value={assignStaff}
                  onChange={(e) => setAssignStaff(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-medium"
                >
                  {availableStaff.length === 0 ? (
                    <option value="">No active staff available in {assignDepartment || 'this department'}</option>
                  ) : (
                    availableStaff.map((s: any) => (
                      <option key={s._id || s.fullName || s.name} value={s.fullName || s.name}>
                        {s.fullName || s.name} ({s.department})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Priority</label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Expected Resolution Date</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignModalComplaint(null)}
                  className="border-slate-800 text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!assignStaff || availableStaff.length === 0}
                  className="bg-[#2563EB] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Staff
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* ====================================================
          7. UPDATE STATUS MODAL
          ==================================================== */}
    <AnimatePresence>
      {updateModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Update Complaint Status</h3>
              <button onClick={() => setUpdateModalComplaint(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Optional Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Add operational notes or field inspection remarks..."
                  value={updateRemarks}
                  onChange={(e) => setUpdateRemarks(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUpdateModalComplaint(null)}
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
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* ====================================================
          8. NEW COMPLAINT MODAL
          ==================================================== */}
    <AnimatePresence>
      {newComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Municipal Complaint</h3>
              <button onClick={() => setNewComplaintModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaintSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Citizen Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newCitizenName}
                  onChange={(e) => setNewCitizenName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Pothole & Roads">Pothole & Roads</option>
                    <option value="Street Lighting">Street Lighting</option>
                    <option value="Water & Sewage">Water & Sewage</option>
                    <option value="Garbage & Waste">Garbage & Waste</option>
                    <option value="Traffic & Signals">Traffic & Signals</option>
                    <option value="Public Safety">Public Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Assigned Dept</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    {ADMIN_12_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Location Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Expressway Exit 4"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details about the issue..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewComplaintModalOpen(false)}
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
                  Create Ticket
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


