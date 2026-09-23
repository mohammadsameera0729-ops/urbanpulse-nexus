import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationItem } from '../../types';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');
        if (!token) {
          setNotifications([]);
          return;
        }

        const response = await fetch('http://localhost:5000/api/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.complaints)) {
          const items: NotificationItem[] = [];
          data.complaints.forEach((c: any) => {
            const ticketRef = c.ticketId || `CMP-${String(c._id).slice(-6).toUpperCase()}`;
            if (Array.isArray(c.activities) && c.activities.length > 0) {
              c.activities.forEach((act: any, idx: number) => {
                items.push({
                  id: `${c._id}_${idx}`,
                  title: `Ticket ${ticketRef}: Update`,
                  message: act.note || `Status updated to ${c.status}`,
                  type: 'complaint_update',
                  read: false,
                  createdAt: new Date(act.timestamp || c.createdAt).toLocaleTimeString(),
                  link: `/citizen/notifications`,
                });
              });
            }
          });
          setNotifications(items.slice(0, 5));
        }
      } catch (err) {
        setNotifications([]);
      }
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-brand-600 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start justify-between gap-3 ${
                      !item.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{item.message}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{item.createdAt}</span>
                    </div>
                    {item.link && (
                      <Link
                        to={item.link}
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                to="/citizen/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
