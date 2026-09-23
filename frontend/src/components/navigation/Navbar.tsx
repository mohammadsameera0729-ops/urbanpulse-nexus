import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  Activity, 
  Calendar, 
  Plus, 
  FileText, 
  Radio, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { UserMenu } from './UserMenu';
import { SearchBar } from '../ui/SearchBar';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, showSearch = true }) => {
  const { theme, toggleTheme } = useTheme();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left branding & sidebar trigger */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-600 dark:from-white dark:via-slate-100 dark:to-brand-400 bg-clip-text text-transparent">
                UrbanPulse <span className="text-brand-600 dark:text-brand-400">Nexus</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                Smart City Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Center Search Bar */}
        {showSearch && (
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search tickets, citizens, departments, sensors..."
            />
          </div>
        )}

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Current Date Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold font-mono">
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
            <span>{currentDateStr}</span>
          </div>

          {/* Quick Actions Button (For Admin & Staff) */}
          {(role === 'admin' || role === 'staff') && (
            <div className="relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Actions</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {showQuickActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 text-xs font-semibold z-50">
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/citizen/report-complaint');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-500" /> Log New Ticket
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/admin/reports');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> Export SLA Audit
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/admin/notifications');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Radio className="w-3.5 h-3.5 text-rose-500" /> Dispatch Alert
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          {role !== 'guest' && <NotificationDropdown />}

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
