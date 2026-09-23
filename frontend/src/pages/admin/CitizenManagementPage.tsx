import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Users, 
  CheckCircle2, 
  Clock, 
  Activity, 
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
  UserX, 
  UserCheck, 
  ShieldAlert, 
  Calendar, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';

interface CitizenRecord {
  id: string;
  citizenId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  zone: string;
  registrationDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  accountStatus: 'active' | 'inactive' | 'blocked';
  avatar: string;
  complaintsSubmitted: number;
  complaintsResolved: number;
  complaintsPending: number;
}

const INITIAL_CITIZENS: CitizenRecord[] = [
  {
    id: 'ctz-101',
    citizenId: 'CTZ-8041',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    mobile: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Sector 4',
    zone: 'Zone B - Central',
    registrationDate: '2026-05-12',
    verificationStatus: 'verified',
    accountStatus: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    complaintsSubmitted: 8,
    complaintsResolved: 6,
    complaintsPending: 2,
  },
  {
    id: 'ctz-102',
    citizenId: 'CTZ-8042',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    mobile: '+1 (555) 345-6789',
    address: '1204 Pine Street, Sector 2',
    zone: 'Zone A - North',
    registrationDate: '2026-06-01',
    verificationStatus: 'verified',
    accountStatus: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    complaintsSubmitted: 5,
    complaintsResolved: 4,
    complaintsPending: 1,
  },
  {
    id: 'ctz-103',
    citizenId: 'CTZ-8043',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    mobile: '+1 (555) 456-7890',
    address: '58 Westside Blvd, Sector 7',
    zone: 'Zone C - South',
    registrationDate: '2026-06-18',
    verificationStatus: 'pending',
    accountStatus: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    complaintsSubmitted: 2,
    complaintsResolved: 1,
    complaintsPending: 1,
  },
  {
    id: 'ctz-104',
    citizenId: 'CTZ-8044',
    name: 'David Chen',
    email: 'david.chen@example.com',
    mobile: '+1 (555) 567-8901',
    address: '89 Innovation Way, Sector 5',
    zone: 'Zone D - East',
    registrationDate: '2026-07-02',
    verificationStatus: 'verified',
    accountStatus: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    complaintsSubmitted: 12,
    complaintsResolved: 10,
    complaintsPending: 2,
  },
  {
    id: 'ctz-105',
    citizenId: 'CTZ-8045',
    name: 'Amanda Taylor',
    email: 'amanda.taylor@example.com',
    mobile: '+1 (555) 678-9012',
    address: '304 Riverfront Ave, Sector 1',
    zone: 'Zone A - North',
    registrationDate: '2026-07-14',
    verificationStatus: 'rejected',
    accountStatus: 'blocked',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    complaintsSubmitted: 1,
    complaintsResolved: 0,
    complaintsPending: 1,
  },
  {
    id: 'ctz-106',
    citizenId: 'CTZ-8046',
    name: 'Robert Miller',
    email: 'robert.miller@example.com',
    mobile: '+1 (555) 789-0123',
    address: '412 Grand Avenue, Sector 3',
    zone: 'Zone B - Central',
    registrationDate: '2026-07-20',
    verificationStatus: 'verified',
    accountStatus: 'active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    complaintsSubmitted: 4,
    complaintsResolved: 3,
    complaintsPending: 1,
  },
  {
    id: 'ctz-107',
    citizenId: 'CTZ-8047',
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    mobile: '+1 (555) 890-1234',
    address: '15 High Street, Sector 6',
    zone: 'Zone C - South',
    registrationDate: '2026-07-25',
    verificationStatus: 'pending',
    accountStatus: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    complaintsSubmitted: 3,
    complaintsResolved: 2,
    complaintsPending: 1,
  },
];

export const CitizenManagementPage: React.FC = () => {
  const [citizensList, setCitizensList] = useState<CitizenRecord[]>([]);

  useEffect(() => {
    const loadCitizens = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) return;

        const response = await fetch('http://localhost:5000/api/admin/complaints/citizens', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.citizens)) {
          const mappedCitizens: CitizenRecord[] = data.citizens.map((u: any, idx: number) => ({
            id: u._id || `ctz-${idx}`,
            citizenId: `CTZ-${String(u._id || idx).slice(-4).toUpperCase()}`,
            name: u.fullName || u.username || 'Citizen User',
            email: u.email || '',
            mobile: u.mobile || '+1 (555) 000-0000',
            address: u.address || 'Urban District, Sector 4',
            zone: u.zone || 'Zone B - Central',
            registrationDate: u.createdAt ? String(u.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
            verificationStatus: 'verified',
            accountStatus: u.isActive ? 'active' : 'inactive',
            avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
            complaintsSubmitted: 0,
            complaintsResolved: 0,
            complaintsPending: 0,
          }));
          setCitizensList(mappedCitizens);
        }
      } catch (error) {
        console.error('Failed to load real citizens:', error);
      }
    };

    loadCitizens();
  }, []);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [regDateFilter, setRegDateFilter] = useState<string>('all');

  // Modals & Drawer States
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null); // For View Side Drawer
  const [editCitizenModal, setEditCitizenModal] = useState<CitizenRecord | null>(null); // For Edit Modal
  const [suspendCitizenModal, setSuspendCitizenModal] = useState<CitizenRecord | null>(null); // For Suspend Dialog
  const [addCitizenModalOpen, setAddCitizenModalOpen] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Form States for Edit Modal
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editZone, setEditZone] = useState('');
  const [editVerificationStatus, setEditVerificationStatus] = useState<'verified' | 'pending' | 'rejected'>('verified');
  const [editAccountStatus, setEditAccountStatus] = useState<'active' | 'inactive' | 'blocked'>('active');

  // Form States for Add Citizen Modal
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addMobile, setAddMobile] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addZone, setAddZone] = useState('Zone B - Central');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setVerificationFilter('all');
    setAccountStatusFilter('all');
    setZoneFilter('all');
    setRegDateFilter('all');
    setCurrentPage(1);
  };

  // Filtered Data Computation
  const filteredData = useMemo(() => {
    return citizensList.filter((c) => {
      const matchesSearch =
        c.citizenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVerification = verificationFilter === 'all' || c.verificationStatus === verificationFilter;
      const matchesAccountStatus = accountStatusFilter === 'all' || c.accountStatus === accountStatusFilter;
      const matchesZone = zoneFilter === 'all' || c.zone === zoneFilter;

      return matchesSearch && matchesVerification && matchesAccountStatus && matchesZone;
    });
  }, [citizensList, searchTerm, verificationFilter, accountStatusFilter, zoneFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Summary Metrics
  const totalCount = citizensList.length;
  const verifiedCount = citizensList.filter(c => c.verificationStatus === 'verified').length;
  const pendingCount = citizensList.filter(c => c.verificationStatus === 'pending' || c.accountStatus === 'inactive').length;
  const activeTodayCount = citizensList.filter(c => c.accountStatus === 'active').length;

  // Export Action
  const handleExport = () => {
    setExportNotice(`Exporting ${filteredData.length} citizen records as CSV/PDF report...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Edit Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCitizenModal) return;

    setCitizensList(prev =>
      prev.map(c => {
        if (c.id === editCitizenModal.id) {
          return {
            ...c,
            name: editName,
            email: editEmail,
            mobile: editMobile,
            address: editAddress,
            zone: editZone,
            verificationStatus: editVerificationStatus,
            accountStatus: editAccountStatus
          };
        }
        return c;
      })
    );

    if (selectedCitizen && selectedCitizen.id === editCitizenModal.id) {
      setSelectedCitizen(prev => prev ? {
        ...prev,
        name: editName,
        email: editEmail,
        mobile: editMobile,
        address: editAddress,
        zone: editZone,
        verificationStatus: editVerificationStatus,
        accountStatus: editAccountStatus
      } : null);
    }

    setEditCitizenModal(null);
  };

  // Toggle Suspend / Reactivate
  const handleConfirmSuspend = () => {
    if (!suspendCitizenModal) return;

    const nextStatus = suspendCitizenModal.accountStatus === 'blocked' ? 'active' : 'blocked';
    
    setCitizensList(prev =>
      prev.map(c => (c.id === suspendCitizenModal.id ? { ...c, accountStatus: nextStatus } : c))
    );

    if (selectedCitizen && selectedCitizen.id === suspendCitizenModal.id) {
      setSelectedCitizen(prev => prev ? { ...prev, accountStatus: nextStatus } : null);
    }

    setSuspendCitizenModal(null);
  };

  // Add Citizen Submission
  const handleAddCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail) return;

    const newRecord: CitizenRecord = {
      id: `ctz-${Date.now()}`,
      citizenId: `CTZ-${Math.floor(8000 + Math.random() * 1000)}`,
      name: addName,
      email: addEmail,
      mobile: addMobile || '+1 (555) 000-0000',
      address: addAddress || 'Sector 4, Central District',
      zone: addZone,
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'verified',
      accountStatus: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      complaintsSubmitted: 0,
      complaintsResolved: 0,
      complaintsPending: 0
    };

    setCitizensList([newRecord, ...citizensList]);
    setAddCitizenModalOpen(false);

    // Reset Form
    setAddName('');
    setAddEmail('');
    setAddMobile('');
    setAddAddress('');
  };

  // Verification Status Badge Render Helper
  const renderVerificationBadge = (status: CitizenRecord['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            Pending
          </span>
        );
      case 'rejected':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
            Rejected
          </span>
        );
    }
  };

  // Account Status Badge Render Helper
  const renderAccountBadge = (status: CitizenRecord['accountStatus']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            Inactive
          </span>
        );
      case 'blocked':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400">
            Blocked
          </span>
        );
    }
  };

  // Table Column Definitions
  const columns = [
    {
      header: 'Citizen ID',
      accessorKey: 'citizenId' as const,
      cell: (row: CitizenRecord) => (
        <span className="font-mono text-xs font-bold text-[#2563EB]">
          #{row.citizenId}
        </span>
      ),
    },
    {
      header: 'Full Name',
      cell: (row: CitizenRecord) => (
        <div className="flex items-center gap-2.5">
          <img src={row.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700" />
          <span className="text-xs font-bold text-white truncate">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      cell: (row: CitizenRecord) => (
        <span className="text-xs font-mono text-slate-300">{row.email}</span>
      ),
    },
    {
      header: 'Mobile Number',
      cell: (row: CitizenRecord) => (
        <span className="text-xs font-mono text-slate-400">{row.mobile}</span>
      ),
    },
    {
      header: 'Area / Zone',
      cell: (row: CitizenRecord) => (
        <span className="text-xs font-medium text-slate-300 truncate max-w-[130px] block">
          {row.zone}
        </span>
      ),
    },
    {
      header: 'Registration Date',
      cell: (row: CitizenRecord) => (
        <span className="text-xs font-mono text-slate-400">{row.registrationDate}</span>
      ),
    },
    {
      header: 'Verification Status',
      cell: (row: CitizenRecord) => renderVerificationBadge(row.verificationStatus),
    },
    {
      header: 'Account Status',
      cell: (row: CitizenRecord) => renderAccountBadge(row.accountStatus),
    },
    {
      header: 'Actions',
      cell: (row: CitizenRecord) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCitizen(row)}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Eye className="w-3 h-3 text-[#2563EB]" />}
          >
            View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditCitizenModal(row);
              setEditName(row.name);
              setEditEmail(row.email);
              setEditMobile(row.mobile);
              setEditAddress(row.address);
              setEditZone(row.zone);
              setEditVerificationStatus(row.verificationStatus);
              setEditAccountStatus(row.accountStatus);
            }}
            className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
            leftIcon={<Edit className="w-3 h-3 text-sky-400" />}
          >
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSuspendCitizenModal(row)}
            className={`text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 ${
              row.accountStatus === 'blocked' ? 'text-emerald-400' : 'text-rose-400'
            }`}
            leftIcon={
              row.accountStatus === 'blocked' ? (
                <UserCheck className="w-3 h-3 text-emerald-400" />
              ) : (
                <UserX className="w-3 h-3 text-rose-400" />
              )
            }
          >
            {row.accountStatus === 'blocked' ? 'Reactivate' : 'Suspend'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* ====================================================
          1. HEADER (Only + Add Citizen & Export Citizens)
          ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Citizen Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage registered citizens, monitor account activity and maintain citizen records.
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
            Export Citizens
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddCitizenModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            + Add Citizen
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
        
        {/* Card 1: Total Citizens */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Citizens</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalCount.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12.4% vs last month
            </span>
          </div>
        </div>

        {/* Card 2: Verified Citizens */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Verified Citizens</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">{verifiedCount.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +15.2% vs last month
            </span>
          </div>
        </div>

        {/* Card 3: Pending Verification */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-amber-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pending Verification</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">{pendingCount.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> -4.1% vs last month
            </span>
          </div>
        </div>

        {/* Card 4: Active Today */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Today</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400 font-mono">{activeTodayCount.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8.7% vs last month
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
              placeholder="Search Citizen..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Verification Status */}
          <div className="lg:col-span-2">
            <select
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Verification: All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Account Status */}
          <div className="lg:col-span-2">
            <select
              value={accountStatusFilter}
              onChange={(e) => {
                setAccountStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Account: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Area / Zone */}
          <div className="lg:col-span-2">
            <select
              value={zoneFilter}
              onChange={(e) => {
                setZoneFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Zone: All</option>
              <option value="Zone A - North">Zone A - North</option>
              <option value="Zone B - Central">Zone B - Central</option>
              <option value="Zone C - South">Zone C - South</option>
              <option value="Zone D - East">Zone D - East</option>
            </select>
          </div>

          {/* Registration Date */}
          <div className="lg:col-span-2">
            <select
              value={regDateFilter}
              onChange={(e) => {
                setRegDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Reg Date: All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
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
          4. CITIZEN TABLE & EMPTY STATE
          ==================================================== */}
      <Card className="overflow-hidden border border-slate-800 shadow-xl bg-[#111827]">
        {paginatedData.length > 0 ? (
          <Table data={paginatedData} columns={columns} keyExtractor={(r) => r.id} />
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No registered citizens found.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no citizen profiles matching your active search terms or filter selection.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddCitizenModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs"
            >
              Add Citizen
            </Button>
          </div>
        )}
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredData.length} Citizens Displayed)
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
          5. CITIZEN DETAILS SIDE DRAWER (VIEW ACTION)
          ==================================================== */}
      <AnimatePresence>
        {selectedCitizen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCitizen(null)}
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
                    #{selectedCitizen.citizenId}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedCitizen.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCitizen(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Profile Overview Card */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex items-center gap-4">
                  <img src={selectedCitizen.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-[#2563EB]" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">{selectedCitizen.name}</h4>
                    <p className="text-slate-400 font-mono">{selectedCitizen.email}</p>
                    <div className="flex items-center gap-2 pt-1">
                      {renderVerificationBadge(selectedCitizen.verificationStatus)}
                      {renderAccountBadge(selectedCitizen.accountStatus)}
                    </div>
                  </div>
                </div>

                {/* Personal & Location Details */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Contact & Address Record
                  </span>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="font-mono">{selectedCitizen.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>{selectedCitizen.address} ({selectedCitizen.zone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>Registered on {selectedCitizen.registrationDate}</span>
                    </div>
                  </div>
                </div>

                {/* Complaint Metrics Cards */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Complaint Submission Summary
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Submitted</span>
                      <p className="text-lg font-mono font-black text-[#2563EB]">{selectedCitizen.complaintsSubmitted}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Resolved</span>
                      <p className="text-lg font-mono font-black text-emerald-400">{selectedCitizen.complaintsResolved}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Pending</span>
                      <p className="text-lg font-mono font-black text-amber-400">{selectedCitizen.complaintsPending}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Recent Activity Timeline
                  </h4>

                  <div className="space-y-3 border-l-2 border-slate-800 pl-4 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <p className="font-bold text-white">Account Created & Verified</p>
                      <span className="text-[11px] text-slate-400 font-mono">{selectedCitizen.registrationDate} • 08:30 AM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      <p className="font-bold text-white">Profile Information Updated</p>
                      <span className="text-[11px] text-slate-400 font-mono">2026-06-01 • 10:15 AM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <p className="font-bold text-white">Complaint Submitted (#CMP-8901 Pothole Repair)</p>
                      <span className="text-[11px] text-slate-400 font-mono">2026-07-10 • 02:45 PM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <p className="font-bold text-white">Complaint Resolved by Field Staff</p>
                      <span className="text-[11px] text-slate-400 font-mono">2026-07-12 • 11:20 AM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <p className="font-bold text-white">Feedback Submitted (5 Stars)</p>
                      <span className="text-[11px] text-slate-400 font-mono">2026-07-12 • 04:00 PM</span>
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
                    setEditCitizenModal(selectedCitizen);
                    setEditName(selectedCitizen.name);
                    setEditEmail(selectedCitizen.email);
                    setEditMobile(selectedCitizen.mobile);
                    setEditAddress(selectedCitizen.address);
                    setEditZone(selectedCitizen.zone);
                    setEditVerificationStatus(selectedCitizen.verificationStatus);
                    setEditAccountStatus(selectedCitizen.accountStatus);
                  }}
                  leftIcon={<Edit className="w-3.5 h-3.5 text-sky-400" />}
                  className="border-slate-800 text-slate-300"
                >
                  Edit Profile
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedCitizen(null)}
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
          6. EDIT CITIZEN MODAL
          ==================================================== */}
      <AnimatePresence>
        {editCitizenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Edit Citizen Profile</h3>
                <button onClick={() => setEditCitizenModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Area / Zone</label>
                    <select
                      value={editZone}
                      onChange={(e) => setEditZone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="Zone A - North">Zone A - North</option>
                      <option value="Zone B - Central">Zone B - Central</option>
                      <option value="Zone C - South">Zone C - South</option>
                      <option value="Zone D - East">Zone D - East</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Verification Status</label>
                    <select
                      value={editVerificationStatus}
                      onChange={(e) => setEditVerificationStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Account Status</label>
                  <select
                    value={editAccountStatus}
                    onChange={(e) => setEditAccountStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditCitizenModal(null)}
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
          7. ACCOUNT ACTIONS (SUSPEND CONFIRMATION DIALOG)
          ==================================================== */}
      <AnimatePresence>
        {suspendCitizenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-white">
                  {suspendCitizenModal.accountStatus === 'blocked' ? 'Reactivate Citizen Account' : 'Suspend Citizen Account'}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to {suspendCitizenModal.accountStatus === 'blocked' ? 'reactivate' : 'suspend'} the account for <strong className="text-white">{suspendCitizenModal.name}</strong> (#{suspendCitizenModal.citizenId})? The citizen record will remain preserved in the municipal system.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuspendCitizenModal(null)}
                  className="border-slate-800 text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={suspendCitizenModal.accountStatus === 'blocked' ? 'primary' : 'danger'}
                  size="sm"
                  onClick={handleConfirmSuspend}
                  className="font-bold"
                >
                  {suspendCitizenModal.accountStatus === 'blocked' ? 'Reactivate Account' : 'Suspend Account'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
          8. ADD CITIZEN MODAL
          ==================================================== */}
      <AnimatePresence>
        {addCitizenModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Add Citizen Profile</h3>
                <button onClick={() => setAddCitizenModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCitizenSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@example.com"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    value={addMobile}
                    onChange={(e) => setAddMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="742 Evergreen Terrace, Sector 4"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Area / Zone</label>
                  <select
                    value={addZone}
                    onChange={(e) => setAddZone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Zone A - North">Zone A - North</option>
                    <option value="Zone B - Central">Zone B - Central</option>
                    <option value="Zone C - South">Zone C - South</option>
                    <option value="Zone D - East">Zone D - East</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddCitizenModalOpen(false)}
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
                    Create Citizen Record
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
