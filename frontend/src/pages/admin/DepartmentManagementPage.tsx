import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { API_BASE_URL } from '../../config/api';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Plus, 
  FileSpreadsheet, 
  Eye, 
  Edit, 
  Send,
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface DepartmentRecord {
  id: string;
  deptId: string;
  name: string;
  description: string;
  officeLocation: string;
  contactEmail: string;
  contactNumber: string;
  totalStaff: number;
  activeComplaints: number;
  resolvedComplaints: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: 'dpt-101',
    deptId: 'DPT-101',
    name: 'Public Health & Sanitation',
    description: 'Manages municipal waste collection, street sweeping, public sanitation, and civic health hazard mitigation across Vijayawada.',
    officeLocation: 'VMC Central Zone Office, Governorpet, Vijayawada',
    contactEmail: 'sanitation@vijayawada.gov.in',
    contactNumber: '+91 (0866) 242-1001',
    totalStaff: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    status: 'Inactive',
  },
  {
    id: 'dpt-102',
    deptId: 'DPT-102',
    name: 'Water Supply & Sewerage',
    description: 'Oversees municipal drinking water distribution, pipeline maintenance, sewerage treatment, and leak repairs.',
    officeLocation: 'VMC Water Works Division, Benz Circle, Vijayawada',
    contactEmail: 'watersupply@vijayawada.gov.in',
    contactNumber: '+91 (0866) 242-1002',
    totalStaff: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    status: 'Inactive',
  },
  {
    id: 'dpt-103',
    deptId: 'DPT-103',
    name: 'Roads & Storm Water Drainage',
    description: 'Responsible for road maintenance, asphalt repairs, storm drain desilting, and flood control channels.',
    officeLocation: 'VMC Engineering Complex, Ramavarappadu, Vijayawada',
    contactEmail: 'roads.drainage@vijayawada.gov.in',
    contactNumber: '+91 (0866) 242-1003',
    totalStaff: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    status: 'Inactive',
  },
  {
    id: 'dpt-104',
    deptId: 'DPT-104',
    name: 'Street Lighting',
    description: 'Maintains citywide LED street illumination, lighting grid infrastructure, and pole sensor units.',
    officeLocation: 'VMC Electrical Substation, Moghalrajpuram, Vijayawada',
    contactEmail: 'streetlighting@vijayawada.gov.in',
    contactNumber: '+91 (0866) 242-1004',
    totalStaff: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    status: 'Inactive',
  },
  {
    id: 'dpt-105',
    deptId: 'DPT-105',
    name: 'Parks & Urban Greenery',
    description: 'Maintains public botanical parks, green corridors, urban landscaping, and playground safety.',
    officeLocation: 'VMC Horticulture Division, Bhavanipuram, Vijayawada',
    contactEmail: 'parks@vijayawada.gov.in',
    contactNumber: '+91 (0866) 242-1005',
    totalStaff: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    status: 'Inactive',
  },
  {
    id: 'dpt-106',
    deptId: 'DPT-106',
    name: 'Public Safety & Emergency Response',
    description: 'Coordinates disaster relief preparedness, civic emergency response units, and public safety oversight.',
    officeLocation: 'VMC Disaster Management Operations Center, Vijayawada',
    contactEmail: 'emergency@vijayawada.gov.in',
    contactNumber: '+91 (0866) 242-1006',
    totalStaff: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    status: 'Inactive',
  },
];

export const DepartmentManagementPage: React.FC = () => {
  const [departmentsList, setDepartmentsList] = useState<DepartmentRecord[]>(INITIAL_DEPARTMENTS);

  useEffect(() => {
    const loadDeptData = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) return;

        const [compRes, staffRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/admin/complaints/staff`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const compData = await compRes.json();
        const staffData = await staffRes.json();

        if (compData.success && Array.isArray(compData.complaints)) {
          const complaints = compData.complaints;
          const staff = Array.isArray(staffData.staff) ? staffData.staff : [];

          setDepartmentsList(prev => prev.map(dept => {
            const deptComplaints = complaints.filter((c: any) => c.assignedDepartment === dept.name);
            const activeCount = deptComplaints.filter((c: any) => ['pending', 'in_progress', 'under_review'].includes(c.status)).length;
            const resolvedCount = deptComplaints.filter((c: any) => c.status === 'resolved').length;
            const activeStaffCount = staff.filter((s: any) => s.department === dept.name && s.isActive !== false).length;

            return {
              ...dept,
              activeComplaints: activeCount,
              resolvedComplaints: resolvedCount,
              totalStaff: activeStaffCount,
              status: activeStaffCount > 0 ? 'Active' : 'Inactive'
            };
          }));
        }
      } catch (err) {
        console.error('Failed to update department data:', err);
      }
    };

    loadDeptData();
  }, []);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Drawer States
  const [selectedDept, setSelectedDept] = useState<DepartmentRecord | null>(null);
  const [editDeptModal, setEditDeptModal] = useState<DepartmentRecord | null>(null);
  const [assignModalDept, setAssignModalDept] = useState<DepartmentRecord | null>(null);
  const [addDeptModalOpen, setAddDeptModalOpen] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Form States for Edit Modal
  const [editName, setEditName] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const [editOfficeLocation, setEditOfficeLocation] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');

  // Form States for Assign Complaint Modal
  const [assignTicketId, setAssignTicketId] = useState('CMP-8904');
  const [assignCategory, setAssignCategory] = useState('Sanitation Issue');
  const [assignPriority, setAssignPriority] = useState('High');
  const [assignStaffMember, setAssignStaffMember] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('2026-07-30');

  // Live MongoDB Staff State
  const [staffUsers, setStaffUsers] = useState<
    Array<{
      _id: string;
      fullName: string;
      email?: string;
      username?: string;
      department?: string;
    }>
  >([]);

  useEffect(() => {
    const fetchLiveStaff = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');
        if (!token) return;
        const response = await fetch(
          `${API_BASE_URL}/admin/complaints/staff`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.staff)) {
          setStaffUsers(data.staff);
          if (data.staff.length > 0) {
            setAssignStaffMember(data.staff[0].fullName);
          }
        }
      } catch (err) {
        console.error('Error fetching live staff for departments:', err);
      }
    };
    fetchLiveStaff();
  }, []);

  const availableStaff = useMemo(() => {
    if (!assignModalDept || staffUsers.length === 0) return staffUsers;
    const deptName = assignModalDept.name.toLowerCase();
    const filtered = staffUsers.filter((s) => {
      if (!s.department) return true;
      const sDept = s.department.toLowerCase();
      return (
        sDept.includes(deptName) ||
        deptName.includes(sDept)
      );
    });
    return filtered.length > 0 ? filtered : staffUsers;
  }, [staffUsers, assignModalDept]);

  // Form States for Add Department Modal
  const [addName, setAddName] = useState('');
  const [addContactEmail, setAddContactEmail] = useState('');
  const [addContactNumber, setAddContactNumber] = useState('');
  const [addOfficeLocation, setAddOfficeLocation] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filtered Data Computation
  const filteredData = useMemo(() => {
    return departmentsList.filter((d) => {
      const matchesSearch =
        d.deptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.officeLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departmentsList, searchTerm, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Dynamic Summary Metrics
  const totalDepts = departmentsList.length;
  const activeDepts = departmentsList.filter(d => d.status === 'Active').length;
  const totalStaffCount = departmentsList.reduce((acc, curr) => acc + curr.totalStaff, 0);
  const totalActiveComplaints = departmentsList.reduce((acc, curr) => acc + curr.activeComplaints, 0);

  // Export Action
  const handleExport = () => {
    setExportNotice(`Exporting ${filteredData.length} department records as CSV report...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Edit Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDeptModal) return;

    setDepartmentsList(prev =>
      prev.map(d => {
        if (d.id === editDeptModal.id) {
          return {
            ...d,
            name: editName,
            contactEmail: editContactEmail,
            contactNumber: editContactNumber,
            officeLocation: editOfficeLocation,
            status: editStatus
          };
        }
        return d;
      })
    );

    if (selectedDept && selectedDept.id === editDeptModal.id) {
      setSelectedDept(prev => prev ? {
        ...prev,
        name: editName,
        contactEmail: editContactEmail,
        contactNumber: editContactNumber,
        officeLocation: editOfficeLocation,
        status: editStatus
      } : null);
    }

    setEditDeptModal(null);
  };

  // Assign Complaint Submission
  const handleAssignComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalDept) return;

    setDepartmentsList(prev =>
      prev.map(d => {
        if (d.id === assignModalDept.id) {
          return {
            ...d,
            activeComplaints: d.activeComplaints + 1
          };
        }
        return d;
      })
    );

    setExportNotice(`Complaint #${assignTicketId} successfully assigned to ${assignStaffMember} in ${assignModalDept.name}.`);
    setTimeout(() => setExportNotice(null), 4000);
    setAssignModalDept(null);
  };

  // Add Department Submission
  const handleAddDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName) return;

    const newDept: DepartmentRecord = {
      id: `dpt-${Date.now()}`,
      deptId: `DPT-${Math.floor(100 + Math.random() * 900)}`,
      name: addName,
      description: addDescription || 'Municipal agency responsible for civic operations and service delivery.',
      officeLocation: addOfficeLocation || 'VMC Central Complex, Vijayawada',
      contactEmail: addContactEmail || `${addName.toLowerCase().replace(/\s+/g, '.')}@vijayawada.gov.in`,
      contactNumber: addContactNumber || '+91 (0866) 242-0000',
      totalStaff: 0,
      activeComplaints: 0,
      resolvedComplaints: 0,
      status: 'Inactive'
    };

    setDepartmentsList([newDept, ...departmentsList]);
    setAddDeptModalOpen(false);

    setAddName('');
    setAddContactEmail('');
    setAddContactNumber('');
    setAddOfficeLocation('');
    setAddDescription('');
  };

  // Status Badge Render Helper
  const renderStatusBadge = (status: DepartmentRecord['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Active
          </span>
        );
      case 'Inactive':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-500/10 border border-slate-500/30 text-slate-400">
            Inactive
          </span>
        );
    }
  };

  // Table Column Definitions
  const columns = [
    {
      header: 'Department ID',
      accessorKey: 'deptId' as const,
      cell: (row: DepartmentRecord) => (
        <span className="font-mono text-xs font-bold text-[#2563EB]">
          #{row.deptId}
        </span>
      ),
    },
    {
      header: 'Department Name',
      cell: (row: DepartmentRecord) => (
        <span className="text-xs font-bold text-white truncate max-w-[240px] block">
          {row.name}
        </span>
      ),
    },
    {
      header: 'Staff Count',
      cell: (row: DepartmentRecord) => (
        <span className="text-xs font-mono font-semibold text-slate-300">
          {row.totalStaff} Personnel
        </span>
      ),
    },
    {
      header: 'Active Complaints',
      cell: (row: DepartmentRecord) => (
        <span className="text-xs font-mono font-bold text-amber-400">
          {row.activeComplaints} Active
        </span>
      ),
    },
    {
      header: 'Resolved Complaints',
      cell: (row: DepartmentRecord) => (
        <span className="text-xs font-mono font-bold text-emerald-400">
          {row.resolvedComplaints} Resolved
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: DepartmentRecord) => renderStatusBadge(row.status),
    },
    {
      header: 'Actions',
      cell: (row: DepartmentRecord) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDept(row)}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Eye className="w-3 h-3 text-[#2563EB]" />}
          >
            View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignModalDept(row)}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Send className="w-3 h-3 text-emerald-400" />}
          >
            Assign Complaint
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Department Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Official Vijayawada municipal departments, active staff personnel, and live complaint counts.
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
            Export Departments
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddDeptModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            + Add Department
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {exportNotice}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Departments */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Official Departments</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalDepts}</span>
            <span className="text-[11px] font-bold text-slate-400">
              Vijayawada VMC
            </span>
          </div>
        </div>

        {/* Card 2: Active Departments */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Departments</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">{activeDepts}</span>
            <span className="text-[11px] font-bold text-emerald-400">
              Staffed & Active
            </span>
          </div>
        </div>

        {/* Card 3: Total Active Staff */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Staff Personnel</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400 font-mono">{totalStaffCount}</span>
            <span className="text-[11px] font-bold text-blue-400">
              Live Staff Count
            </span>
          </div>
        </div>

        {/* Card 4: Total Active Complaints */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Work Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">{totalActiveComplaints}</span>
            <span className="text-[11px] font-bold text-amber-400">
              Pending / In Progress
            </span>
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 bg-[#111827] border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Department Name or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Department Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Status: All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>
      </Card>

      {/* Department Table */}
      <Card className="overflow-hidden border border-slate-800 shadow-xl bg-[#111827]">
        {paginatedData.length > 0 ? (
          <Table data={paginatedData} columns={columns} keyExtractor={(r) => r.id} />
        ) : (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No departments found.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no municipal departments matching your active search criteria.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredData.length} Departments)
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

      {/* View Drawer */}
      <AnimatePresence>
        {selectedDept && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDept(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#111827] border-l border-slate-800 shadow-2xl flex flex-col justify-between z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div>
                  <span className="font-mono text-xs font-bold text-[#2563EB]">
                    #{selectedDept.deptId}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedDept.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Overview</span>
                    <p className="text-slate-300 leading-relaxed font-normal">{selectedDept.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2 text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>{selectedDept.officeLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="font-mono">{selectedDept.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="font-mono">{selectedDept.contactNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Live Operational Metrics
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Staff</span>
                      <p className="text-base font-mono font-black text-white">{selectedDept.totalStaff} Personnel</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Work Orders</span>
                      <p className="text-base font-mono font-black text-amber-400">{selectedDept.activeComplaints} Active</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Resolved Work Orders</span>
                      <p className="text-base font-mono font-black text-emerald-400">{selectedDept.resolvedComplaints} Resolved</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedDept(null)}
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold"
                >
                  Close Drawer
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Complaint Modal */}
      <AnimatePresence>
        {assignModalDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Assign Complaint Ticket</h3>
                  <p className="text-[11px] text-[#2563EB] font-mono font-semibold">{assignModalDept.name}</p>
                </div>
                <button onClick={() => setAssignModalDept(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAssignComplaintSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Complaint ID</label>
                  <input
                    type="text"
                    required
                    value={assignTicketId}
                    onChange={(e) => setAssignTicketId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Complaint Category</label>
                    <input
                      type="text"
                      value={assignCategory}
                      onChange={(e) => setAssignCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Priority</label>
                    <select
                      value={assignPriority}
                      onChange={(e) => setAssignPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Assign Department Staff</label>
                  <select
                    value={assignStaffMember}
                    onChange={(e) => setAssignStaffMember(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    {availableStaff.length === 0 ? (
                      <option value="">No active staff members found</option>
                    ) : (
                      availableStaff.map((s) => (
                        <option key={s._id} value={s.fullName}>
                          {s.fullName} ({s.department || 'General Staff'})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Expected Resolution Date</label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAssignModalDept(null)}
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
                    Assign Staff
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Department Modal */}
      <AnimatePresence>
        {addDeptModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Create Municipal Department</h3>
                <button onClick={() => setAddDeptModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddDepartmentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Public Safety & Emergency Response"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Office Location</label>
                    <input
                      type="text"
                      placeholder="VMC Complex"
                      value={addOfficeLocation}
                      onChange={(e) => setAddOfficeLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      placeholder="dept@vijayawada.gov.in"
                      value={addContactEmail}
                      onChange={(e) => setAddContactEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide overview of department responsibilities..."
                    value={addDescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddDeptModalOpen(false)}
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
                    Create Department
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

