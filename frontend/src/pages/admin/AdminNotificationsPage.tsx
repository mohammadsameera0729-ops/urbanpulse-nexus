import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bell, 
  CheckCheck, 
  Archive, 
  Search, 
  Filter, 
  AlertTriangle, 
  Radio, 
  FileText, 
  ShieldAlert, 
  Clock, 
  Info,
  Settings,
  X,
  Eye,
  CheckCircle2,
  Users,
  Car,
  Building2,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  BellOff,
  Zap
} from 'lucide-react';

type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
type NotificationStatus = 'Unread' | 'Read' | 'Archived';
type NotificationCategory = 
  | 'Complaint Submitted'
  | 'Complaint Assigned'
  | 'Complaint Resolved'
  | 'Staff Status Updated'
  | 'Traffic Congestion Alert'
  | 'Traffic Accident Alert'
  | 'Emergency Alert'
  | 'Department Update'
  | 'System Announcement'
  | 'Citizen Feedback Received';

interface NotificationRecord {
  id: string;
  title: string;
  category: NotificationCategory;
  description: string;
  timestamp: string;
  priority: PriorityLevel;
  status: NotificationStatus;
  relatedModule: string;
  recommendedAction: string;
}

const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-101',
    title: 'Critical Traffic Congestion Detected on Central Expressway',
    category: 'Traffic Congestion Alert',
    description: 'AI vision sensors reported congestion levels surpassing 84% near Exit 4 corridor. Automated signal timing overridden.',
    timestamp: '10 mins ago',
    priority: 'Critical',
    status: 'Unread',
    relatedModule: 'AI Traffic Monitoring',
    recommendedAction: 'Dispatch Traffic Operations Team A to adjust manual bypass lane controls.',
  },
  {
    id: 'notif-102',
    title: 'Emergency Medical Dispatch Request Sector 2',
    category: 'Emergency Alert',
    description: 'Multi-vehicle collision reported at Intersection 12. Civil defense & ambulance units dispatched.',
    timestamp: '25 mins ago',
    priority: 'Critical',
    status: 'Unread',
    relatedModule: 'Smart City Command & Emergency',
    recommendedAction: 'Coordinate priority green wave signals for arriving emergency vehicles.',
  },
  {
    id: 'notif-103',
    title: 'New High Priority Complaint Logged (#CMP-8904)',
    category: 'Complaint Submitted',
    description: 'Citizen Sarah Jenkins reported main water pipeline leak on Sector 4 Boulevard causing road flooding.',
    timestamp: '45 mins ago',
    priority: 'High',
    status: 'Unread',
    relatedModule: 'Complaint Management',
    recommendedAction: 'Assign ticket directly to Water Utility & Drainage field response unit.',
  },
  {
    id: 'notif-104',
    title: 'Complaint Ticket Assigned to Engineer Alex Rivera',
    category: 'Complaint Assigned',
    description: 'Ticket #CMP-8901 (Traffic Signal Failure) assigned to Alex Rivera with expected resolution SLA of 2 hours.',
    timestamp: '1 hour ago',
    priority: 'Medium',
    status: 'Unread',
    relatedModule: 'Staff Operations',
    recommendedAction: 'Monitor field progress telemetry via Staff Management dashboard.',
  },
  {
    id: 'notif-105',
    title: 'Pothole Repair Ticket Successfully Resolved (#CMP-8890)',
    category: 'Complaint Resolved',
    description: 'Public Works crew completed asphalt resurfacing on Pine Street. Citizen notified with photo verification.',
    timestamp: '2 hours ago',
    priority: 'Low',
    status: 'Read',
    relatedModule: 'Complaint Management',
    recommendedAction: 'Archive ticket record upon final citizen SLA rating confirmation.',
  },
  {
    id: 'notif-106',
    title: 'Staff Availability Status Updated: Alex Rivera On Field',
    category: 'Staff Status Updated',
    description: 'Engineer Alex Rivera logged status change to On Field Duty (Assigned to Traffic Diversion).',
    timestamp: '3 hours ago',
    priority: 'Low',
    status: 'Read',
    relatedModule: 'Staff Management',
    recommendedAction: 'No action required. Telemetry status auto-updated.',
  },
  {
    id: 'notif-107',
    title: 'Minor Vehicle Collison Corridor Speed Alert',
    category: 'Traffic Accident Alert',
    description: 'Speeds dropped below 15 km/h on Westside Highway due to stalled delivery vehicle.',
    timestamp: '4 hours ago',
    priority: 'High',
    status: 'Read',
    relatedModule: 'AI Traffic Monitoring',
    recommendedAction: 'Deploy tow unit to clear rightmost lane.',
  },
  {
    id: 'notif-108',
    title: 'Q2 Department SLA Adherence Target Achieved',
    category: 'Department Update',
    description: 'Public Safety & Emergency Management achieved 98.4% monthly SLA compliance benchmark.',
    timestamp: '5 hours ago',
    priority: 'Medium',
    status: 'Read',
    relatedModule: 'Department Management',
    recommendedAction: 'Include achievement in upcoming quarterly executive city council report.',
  },
  {
    id: 'notif-109',
    title: 'Scheduled System Maintenance Announcement',
    category: 'System Announcement',
    description: 'Smart City database index rebalancing scheduled for Sunday 02:00 AM - 03:00 AM. Zero downtime expected.',
    timestamp: '6 hours ago',
    priority: 'Low',
    status: 'Read',
    relatedModule: 'System Administration',
    recommendedAction: 'Notify department dispatchers of scheduled telemetry maintenance window.',
  },
  {
    id: 'notif-110',
    title: 'Positive Citizen Feedback Submitted (5 Stars)',
    category: 'Citizen Feedback Received',
    description: 'Citizen Elena Rostova rated Water Utility response time 5 stars for fast pipe leak repair.',
    timestamp: '8 hours ago',
    priority: 'Low',
    status: 'Read',
    relatedModule: 'Citizen Management',
    recommendedAction: 'Log rating points to Water Department monthly SLA leaderboard.',
  },
];

export const AdminNotificationsPage: React.FC = () => {
  const [notificationsList, setNotificationsList] = useState<NotificationRecord[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const loadLiveNotifications = async () => {
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
          const liveNotifs: NotificationRecord[] = [];

          data.complaints.forEach((c: any) => {
            const ticketStr = c.ticketId || `UPN-${String(c._id).slice(-6).toUpperCase()}`;
            const citizenName = c.citizen?.fullName || c.citizen?.name || 'Citizen';

            liveNotifs.push({
              id: `notif-c-${c._id}`,
              title: `New Municipal Complaint Submitted #${ticketStr}`,
              category: 'Complaint Submitted',
              description: `Citizen "${citizenName}" logged a new "${c.category}" report at ${c.location}.`,
              timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Recently',
              priority: c.priority === 'critical' || c.priority === 'high' ? 'High' : 'Medium',
              status: 'Unread',
              relatedModule: 'Complaint Management',
              recommendedAction: 'Review ticket details and assign field staff.',
            });

            if (Array.isArray(c.activities)) {
              c.activities.forEach((act: any, actIdx: number) => {
                liveNotifs.push({
                  id: `notif-act-${c._id}-${actIdx}`,
                  title: `Complaint Update #${ticketStr}: ${act.author || 'System'}`,
                  category: act.statusChange ? 'Complaint Resolved' : 'Complaint Assigned',
                  description: act.note || 'Complaint activity updated.',
                  timestamp: act.timestamp ? new Date(act.timestamp).toLocaleString() : 'Recently',
                  priority: c.priority === 'critical' ? 'Critical' : 'Medium',
                  status: 'Read',
                  relatedModule: 'Complaint Management',
                  recommendedAction: 'Monitor department progress on SLA resolution.',
                });
              });
            }
          });

          if (liveNotifs.length > 0) {
            setNotificationsList(liveNotifs);
          }
        }
      } catch (err) {
        console.error('Failed to load live complaint notifications:', err);
      }
    };

    loadLiveNotifications();
  }, []);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');

  // Modals & Drawer States
  const [selectedNotif, setSelectedNotif] = useState<NotificationRecord | null>(null); // View Details Drawer
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Settings Modal States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
    setDateRangeFilter('all');
    setCurrentPage(1);
  };

  // Filtered Computation
  const filteredData = useMemo(() => {
    return notificationsList.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.relatedModule.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || n.status === statusFilter;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [notificationsList, searchTerm, categoryFilter, priorityFilter, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Metric Counts
  const totalCount = notificationsList.length;
  const unreadCount = notificationsList.filter(n => n.status === 'Unread').length;
  const highPriorityCount = notificationsList.filter(n => n.priority === 'Critical' || n.priority === 'High').length;
  const todayCount = 38;

  // Mark All Read Handler
  const handleMarkAllRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, status: 'Read' })));
    setActionNotice('All active notifications marked as read.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Toggle Single Read
  const handleToggleRead = (id: string) => {
    setNotificationsList(prev =>
      prev.map(n => (n.id === id ? { ...n, status: n.status === 'Unread' ? 'Read' : 'Unread' } : n))
    );
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif(prev => prev ? { ...prev, status: prev.status === 'Unread' ? 'Read' : 'Unread' } : null);
    }
  };

  // Archive Handler
  const handleArchive = (id: string) => {
    setNotificationsList(prev =>
      prev.map(n => (n.id === id ? { ...n, status: 'Archived' } : n))
    );
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif(null);
    }
    setActionNotice('Notification archived successfully.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice('Notification settings saved successfully.');
    setTimeout(() => setActionNotice(null), 3000);
    setSettingsModalOpen(false);
  };

  // Category Icon Helper
  const renderCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'Emergency Alert':
      case 'Traffic Accident Alert':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Traffic Congestion Alert':
        return <Car className="w-4 h-4 text-[#2563EB]" />;
      case 'Complaint Submitted':
      case 'Complaint Assigned':
      case 'Complaint Resolved':
        return <FileText className="w-4 h-4 text-[#2563EB]" />;
      case 'Staff Status Updated':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'Department Update':
        return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'Citizen Feedback Received':
        return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case 'System Announcement':
      default:
        return <Info className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  // Priority Badge Render Helper
  const renderPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* ====================================================
          1. HEADER (Mark All as Read & Notification Settings)
          ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Notifications Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor system alerts, complaint updates and important operational notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsModalOpen(true)}
            leftIcon={<Settings className="w-4 h-4 text-slate-300" />}
            className="border-slate-800 bg-[#111827] text-slate-300 hover:text-white text-xs font-bold"
          >
            Notification Settings
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            Mark All as Read
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
        
        {/* Card 1: Total Notifications */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-[#2563EB]/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Notifications</span>
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalCount}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +18 today
            </span>
          </div>
        </div>

        {/* Card 2: Unread Notifications */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Unread Notifications</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Info className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400 font-mono">{unreadCount}</span>
            <span className="text-[11px] font-bold text-blue-400 flex items-center gap-0.5">
              +5 since last hour
            </span>
          </div>
        </div>

        {/* Card 3: High Priority Alerts */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-rose-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">High Priority Alerts</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400 font-mono">{highPriorityCount}</span>
            <span className="text-[11px] font-bold text-rose-400 flex items-center gap-0.5">
              2 critical pending
            </span>
          </div>
        </div>

        {/* Card 4: Today's Notifications */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Today's Notifications</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">{todayCount}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12% vs yesterday
            </span>
          </div>
        </div>

      </div>

      {/* ====================================================
          3. FILTER BAR
          ==================================================== */}
      <Card className="p-4 bg-[#111827] border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="lg:col-span-3 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Notifications..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Notification Type */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Type: All</option>
              <option value="Complaint Submitted">Complaint Submitted</option>
              <option value="Complaint Assigned">Complaint Assigned</option>
              <option value="Complaint Resolved">Complaint Resolved</option>
              <option value="Staff Status Updated">Staff Status Updated</option>
              <option value="Traffic Congestion Alert">Traffic Congestion Alert</option>
              <option value="Traffic Accident Alert">Traffic Accident Alert</option>
              <option value="Emergency Alert">Emergency Alert</option>
              <option value="Department Update">Department Update</option>
              <option value="System Announcement">System Announcement</option>
              <option value="Citizen Feedback Received">Citizen Feedback Received</option>
            </select>
          </div>

          {/* Priority */}
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
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status */}
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
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="lg:col-span-1">
            <select
              value={dateRangeFilter}
              onChange={(e) => {
                setDateRangeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
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
          4. NOTIFICATION LIST & EMPTY STATE
          ==================================================== */}
      <div className="space-y-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`p-4 rounded-2xl border transition-all duration-200 hover:border-[#2563EB]/40 ${
                  notif.status === 'Unread'
                    ? 'bg-[#111827] border-[#2563EB]/40 shadow-lg'
                    : notif.status === 'Archived'
                    ? 'bg-[#0B1220]/50 border-slate-800/60 opacity-60'
                    : 'bg-[#111827] border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {renderCategoryIcon(notif.category)}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm ${notif.status === 'Unread' ? 'font-bold text-white' : 'font-semibold text-slate-300'} truncate`}>
                          {notif.title}
                        </h4>
                        {notif.status === 'Unread' && (
                          <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 animate-ping" />
                        )}
                        {renderPriorityBadge(notif.priority)}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-normal">
                        {notif.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {notif.timestamp}
                        </span>
                        <span>•</span>
                        <span className="text-[#2563EB] font-semibold">{notif.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notification Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNotif(notif)}
                      className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
                      leftIcon={<Eye className="w-3 h-3 text-[#2563EB]" />}
                    >
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRead(notif.id)}
                      className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-300"
                      leftIcon={<CheckCheck className={`w-3 h-3 ${notif.status === 'Read' ? 'text-emerald-400' : 'text-slate-400'}`} />}
                    >
                      {notif.status === 'Unread' ? 'Mark Read' : 'Unread'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchive(notif.id)}
                      className="text-[11px] py-1 px-2 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
                      leftIcon={<Archive className="w-3 h-3" />}
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          /* Empty State */
          <Card className="p-12 text-center bg-[#111827] border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <BellOff className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No notifications available.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no operational system alerts matching your current filter settings.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleResetFilters}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs"
            >
              Refresh Notifications
            </Button>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredData.length} Notifications)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border-slate-800 text-slate-300"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="border-slate-800 text-slate-300"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ====================================================
          5. NOTIFICATION DETAILS SIDE DRAWER (VIEW DETAILS)
          ==================================================== */}
      <AnimatePresence>
        {selectedNotif && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotif(null)}
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
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    {renderCategoryIcon(selectedNotif.category)}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#2563EB]">
                      {selectedNotif.category}
                    </span>
                    <h2 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                      {selectedNotif.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Status & Priority Badge Header */}
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Priority Rating</span>
                    <div>{renderPriorityBadge(selectedNotif.priority)}</div>
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Notification Status</span>
                    <p className="font-mono font-bold text-white">{selectedNotif.status}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</span>
                    <p className="text-white font-mono">{selectedNotif.timestamp} • Live System Stream</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notification Description</span>
                    <p className="text-slate-200 text-sm font-medium leading-relaxed">{selectedNotif.description}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Related Municipal Module</span>
                    <p className="text-white font-bold text-sm">{selectedNotif.relatedModule}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Recommended Operational Action</span>
                    <p className="text-slate-300 leading-relaxed font-normal">{selectedNotif.recommendedAction}</p>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArchive(selectedNotif.id)}
                  leftIcon={<Archive className="w-3.5 h-3.5" />}
                  className="border-slate-800 text-slate-300"
                >
                  Archive Notification
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleToggleRead(selectedNotif.id)}
                  leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold"
                >
                  {selectedNotif.status === 'Unread' ? 'Mark as Read' : 'Keep Unread'}
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
          6. NOTIFICATION SETTINGS MODAL
          ==================================================== */}
      <AnimatePresence>
        {settingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Notification Preferences</h3>
                <button onClick={() => setSettingsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Email Alerts</p>
                      <span className="text-[10px] text-slate-400">Receive instant dispatch summaries via official email</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Push Notifications</p>
                      <span className="text-[10px] text-slate-400">Receive live browser alerts for traffic & SLA events</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotifs}
                      onChange={(e) => setPushNotifs(e.target.checked)}
                      className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Critical Incident SMS Alerts</p>
                      <span className="text-[10px] text-slate-400">Emergency SMS dispatches for critical priority incidents</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Daily Summary Digest</p>
                      <span className="text-[10px] text-slate-400">Receive end-of-day operational report summary</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dailyDigest}
                      onChange={(e) => setDailyDigest(e.target.checked)}
                      className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSettingsModalOpen(false)}
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
                    Save Settings
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
