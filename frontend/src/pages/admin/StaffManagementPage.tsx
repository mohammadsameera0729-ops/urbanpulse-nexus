import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { API_BASE_URL } from '../../config/api';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Plus, 
  FileSpreadsheet, 
  Eye, 
  Briefcase,
  Building2,
  HardHat,
  AlertCircle
} from 'lucide-react';

interface StaffRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Active' | 'Inactive';
  currentAssignment: string;
  assignedComplaintId?: string;
  avatar: string;
}

const VIJAYAWADA_DEPARTMENTS = [
  'Public Health & Sanitation',
  'Water Supply & Sewerage',
  'Roads & Storm Water Drainage',
  'Street Lighting',
  'Parks & Urban Greenery',
  'Public Safety & Emergency Response',
];

export const StaffManagementPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStaffAndComplaints = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) {
          setLoading(false);
          return;
        }

        const [usersRes, compRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/admin/complaints`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersData = await usersRes.json();
        const compData = await compRes.json();

        if (usersData.success && Array.isArray(usersData.users)) {
          const staffUsers = usersData.users.filter((u: any) => u.role === 'staff');
          const complaints = (compData.success && Array.isArray(compData.complaints)) ? compData.complaints : [];

          const mapped: StaffRecord[] = staffUsers.map((u: any, idx: number) => {
            const activeAssigned = complaints.find((c: any) => {
              const isAssigned = c.assignedAgent === u.fullName || c.assignedAgent === u.username || c.assignedAgent === u.email;
              const isActiveStatus = ['pending', 'in_progress', 'under_review'].includes(c.status);
              return isAssigned && isActiveStatus;
            });

            let deptName = u.department || 'Municipal Operations';
            if (deptName === 'Town Planning & Encroachment') {
              deptName = 'Public Safety & Emergency Response';
            }

            return {
              id: u._id || `staff-${idx}`,
              name: u.fullName || u.username || 'Staff User',
              role: u.role || 'staff',
              department: deptName,
              email: u.email || 'N/A',
              status: u.isActive !== false ? 'Active' : 'Inactive',
              currentAssignment: activeAssigned ? activeAssigned.title : 'No active assignment',
              assignedComplaintId: activeAssigned ? activeAssigned._id : undefined,
              avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
            };
          });

          setStaffList(mapped);
        }
      } catch (err) {
        console.error('Failed to load staff data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStaffAndComplaints();
  }, []);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Drawer States
  const [selectedStaff, setSelectedStaff] = useState<StaffRecord | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filtered Data Computation
  const filteredData = useMemo(() => {
    return staffList.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.currentAssignment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffList, searchTerm, departmentFilter, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Summary Metrics Derived from Live Data
  const totalStaffCount = staffList.length;
  const activeStaffCount = staffList.filter(s => s.status === 'Active').length;
  const assignedOnDutyCount = staffList.filter(s => s.currentAssignment !== 'No active assignment').length;
  const unassignedCount = staffList.filter(s => s.currentAssignment === 'No active assignment').length;

  // Export Action
  const handleExport = () => {
    setExportNotice(`Exporting ${filteredData.length} staff records...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Render Status Badge
  const renderStatusBadge = (status: StaffRecord['status']) => {
    if (status === 'Active') {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Active
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-500/10 border border-slate-500/30 text-slate-400">
        Inactive
      </span>
    );
  };

  // Staff Table Columns (7 Columns as required)
  const columns = [
    {
      header: 'Name',
      cell: (row: StaffRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-xs font-bold text-white uppercase">
            {row.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">{row.name}</h4>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row: StaffRecord) => (
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Department',
      cell: (row: StaffRecord) => (
        <span className="text-xs text-slate-300 font-medium truncate max-w-[180px] block">
          {row.department}
        </span>
      ),
    },
    {
      header: 'Email',
      cell: (row: StaffRecord) => (
        <span className="text-xs font-mono text-slate-400 truncate max-w-[200px] block">
          {row.email}
        </span>
      ),
    },
    {
      header: 'Account Status',
      cell: (row: StaffRecord) => renderStatusBadge(row.status),
    },
    {
      header: 'Current Complaint Assignment',
      cell: (row: StaffRecord) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border truncate max-w-[220px] block ${
          row.currentAssignment !== 'No active assignment'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          {row.currentAssignment}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: StaffRecord) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedStaff(row)}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Eye className="w-3 h-3 text-[#2563EB]" />}
          >
            View
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
            Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Vijayawada municipal staff accounts, department assignments, and active complaint work orders.
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
            Export Staff
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
        
        {/* Card 1: Total Staff */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Staff Personnel</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalStaffCount}</span>
            <span className="text-[11px] font-bold text-slate-400">
              MongoDB Staff Users
            </span>
          </div>
        </div>

        {/* Card 2: Active Accounts */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Accounts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">{activeStaffCount}</span>
            <span className="text-[11px] font-bold text-emerald-400">
              Active Status
            </span>
          </div>
        </div>

        {/* Card 3: Assigned On Duty */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Complaint Duty</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">{assignedOnDutyCount}</span>
            <span className="text-[11px] font-bold text-amber-400">
              Active Work Orders
            </span>
          </div>
        </div>

        {/* Card 4: Standby */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-slate-700/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Standby / Unassigned</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-300 font-mono">{unassignedCount}</span>
            <span className="text-[11px] font-bold text-slate-500">
              No Active Work Order
            </span>
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 bg-[#111827] border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Staff Name, Email, or Department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-4">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Department: All</option>
              {VIJAYAWADA_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
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

          {/* Reset Filters */}
          <div className="md:col-span-1">
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

      {/* Staff Table */}
      <Card className="overflow-hidden border border-slate-800 shadow-xl bg-[#111827]">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            Loading staff data...
          </div>
        ) : paginatedData.length > 0 ? (
          <Table data={paginatedData} columns={columns} keyExtractor={(r) => r.id} />
        ) : (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No staff members found.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no staff personnel matching your active search or filter options.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredData.length} Staff Displayed)
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

      {/* View Staff Drawer */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStaff(null)}
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
                  <h2 className="text-lg font-bold text-white">
                    {selectedStaff.name}
                  </h2>
                  <span className="text-xs text-[#2563EB] font-mono font-semibold">
                    {selectedStaff.email}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-lg font-bold text-white uppercase">
                    {selectedStaff.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">{selectedStaff.name}</h4>
                    <p className="text-[#2563EB] font-semibold uppercase tracking-wider">{selectedStaff.role}</p>
                    {renderStatusBadge(selectedStaff.status)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Staff Details & Department
                  </span>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>{selectedStaff.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="font-mono">{selectedStaff.email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Complaint Assignment
                  </span>
                  <p className="text-sm font-bold text-white flex items-center gap-2 mt-1">
                    <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
                    {selectedStaff.currentAssignment}
                  </p>
                </div>

              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedStaff(null)}
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold"
                >
                  Close Drawer
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
