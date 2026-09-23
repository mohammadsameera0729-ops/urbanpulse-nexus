import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user && role === 'guest') {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-3.5 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm"
        >
          Register
        </Link>
      </div>
    );
  }

  const profileRoute =
    role === 'admin'
      ? '/admin/profile'
      : role === 'staff'
      ? '/staff/profile'
      : '/citizen/profile';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      >
        <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" statusDot />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{user?.name || 'Guest'}</p>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
            {role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 overflow-hidden">
            {/* Header info */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>

            {/* Links */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <Link
                to={profileRoute}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile & Account
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
