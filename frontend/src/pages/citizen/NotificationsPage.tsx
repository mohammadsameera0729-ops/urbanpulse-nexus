import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from '../../types';
import { API_BASE_URL } from '../../config/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  FileText, 
  Info, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'system' | 'emergency' | 'complaint_update'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCitizenNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) {
          throw new Error('Citizen authentication token missing');
        }

        const response = await fetch(`${API_BASE_URL}/complaints`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load notifications');
        }

        const derivedNotifications: NotificationItem[] = [];

        (data.complaints || []).forEach((c: any) => {
          const ticketRef = c.ticketId || `CMP-${String(c._id).slice(-6).toUpperCase()}`;

          if (Array.isArray(c.activities) && c.activities.length > 0) {
            c.activities.forEach((act: any, idx: number) => {
              const actTime = act.timestamp || c.createdAt;
              const formattedTime = new Date(actTime).toLocaleString();
              let notifType: NotificationItem['type'] = 'complaint_update';
              if (c.priority === 'critical' || c.priority === 'high') {
                notifType = 'emergency';
              }

              let actTitle = `Ticket ${ticketRef}: Complaint Activity`;
              if (act.statusChange) {
                actTitle = `Ticket ${ticketRef}: Status -> ${act.statusChange.toUpperCase().replace('_', ' ')}`;
              } else if (act.role === 'staff') {
                actTitle = `Ticket ${ticketRef}: Staff Remark Update`;
              } else if (act.role === 'admin') {
                actTitle = `Ticket ${ticketRef}: Department Assignment`;
              } else if (act.role === 'citizen') {
                actTitle = `Ticket ${ticketRef}: Complaint Submitted`;
              }

              derivedNotifications.push({
                id: `${c._id}_act_${idx}`,
                title: actTitle,
                message: `${act.note || `Activity logged for ${c.title}`} (Updated by: ${act.author || 'System'})`,
                type: notifType,
                read: false,
                createdAt: new Date(actTime).toISOString(),
                timestamp: formattedTime,
              });
            });
          } else {
            const formattedTime = new Date(c.createdAt).toLocaleString();
            derivedNotifications.push({
              id: `${c._id}_created`,
              title: `Ticket ${ticketRef}: Complaint Registered`,
              message: `Your complaint "${c.title}" was logged in status "${(c.status || 'pending').toUpperCase()}".`,
              type: c.priority === 'critical' ? 'emergency' : 'complaint_update',
              read: false,
              createdAt: new Date(c.createdAt).toISOString(),
              timestamp: formattedTime,
            });
          }
        });

        // Sort newest notifications first
        derivedNotifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(derivedNotifications);
      } catch (err: any) {
        console.error('Error fetching citizen notifications:', err);
        setError(err.message || 'Failed to fetch notification updates');
      } finally {
        setLoading(false);
      }
    };

    fetchCitizenNotifications();
  }, []);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'unread') return !item.read;
      if (activeTab === 'read') return item.read;
      if (activeTab === 'system') return item.type === 'system';
      if (activeTab === 'emergency') return item.type === 'emergency';
      if (activeTab === 'complaint_update') return item.type === 'complaint_update';

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'complaint_update':
        return <FileText className="w-5 h-5 text-brand-500" />;
      case 'system':
      default:
        return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Citizen Notifications Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-600 text-white animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay informed on ticket SLA updates, emergency warnings, and municipal service announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-emerald-500" />}
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Control Card: Tabs & Search */}
      <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'complaint_update', label: 'Complaint Fixes' },
              { key: 'emergency', label: 'Emergency' },
              { key: 'system', label: 'System' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {error ? (
          <Card className="p-6 text-center text-red-500 bg-red-500/10 border-red-500/20">
            <p className="text-sm font-semibold">{error}</p>
          </Card>
        ) : loading ? (
          <Card className="p-12 text-center space-y-3">
            <Bell className="w-8 h-8 text-brand-500 mx-auto animate-bounce opacity-70" />
            <p className="text-xs text-slate-400">Loading citizen notification activity stream...</p>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center space-y-3">
            <Bell className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Notifications Found</h3>
            <p className="text-xs text-slate-500">Your inbox is up to date.</p>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    !notif.read
                      ? 'bg-brand-50/40 dark:bg-brand-950/30 border-brand-300 dark:border-brand-800/80 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        {getIconForType(notif.type)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm ${!notif.read ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {notif.timestamp}
                          </span>
                          <span className="uppercase font-bold text-brand-600 dark:text-brand-400">
                            {notif.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Right */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleRead(notif.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={notif.read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        <CheckCheck className={`w-4 h-4 ${notif.read ? 'text-emerald-500' : 'text-slate-400'}`} />
                      </button>

                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
};
