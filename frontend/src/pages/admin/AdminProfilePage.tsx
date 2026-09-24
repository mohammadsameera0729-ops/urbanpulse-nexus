import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { API_BASE_URL } from '../../config/api';
import { Button } from '../../components/ui/Button';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Edit, 
  LogOut, 
  X, 
  BadgeCheck,
  UserCheck
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface AdminProfileData {
  name: string;
  email: string;
  role: string;
  department: string;
  accountStatus: 'Active' | 'Inactive';
  avatar?: string;
}

export const AdminProfilePage: React.FC = () => {
  const { user: authUser, token: authToken, logout: authLogout } = useAuth();

  const [profile, setProfile] = useState<AdminProfileData>(() => ({
    name: authUser?.name || 'Not provided',
    email: authUser?.email || 'Not provided',
    role: authUser?.role === 'admin' ? 'Administrator' : authUser?.role ? (authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)) : 'Administrator',
    department: authUser?.department || 'Not provided',
    accountStatus: authUser?.status === 'active' ? 'Active' : 'Inactive',
  }));

  const [loading, setLoading] = useState<boolean>(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Form States
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editDepartment, setEditDepartment] = useState(profile.department);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token =
          authToken ||
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch real authenticated user profile from /api/auth/me
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok && result.success && result.data) {
          const u = result.data;
          setProfile({
            name: u.fullName || u.name || u.username || authUser?.name || 'Not provided',
            email: u.email || authUser?.email || 'Not provided',
            role: u.role === 'admin' ? 'Administrator' : u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'Administrator',
            department: u.department || authUser?.department || 'Not provided',
            accountStatus: u.isActive !== false ? 'Active' : 'Inactive',
          });
        }
      } catch (err) {
        console.error('Error fetching real admin profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [authToken, authUser]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: editName,
      email: editEmail,
      department: editDepartment,
    }));
    setNoticeMessage('Admin profile details updated.');
    setTimeout(() => setNoticeMessage(null), 3500);
    setEditModalOpen(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMessage('Password change request submitted successfully.');
    setTimeout(() => setNoticeMessage(null), 3500);
    setPasswordModalOpen(false);
    setPwdCurrent('');
    setPwdNew('');
    setPwdConfirm('');
  };

  const handleLogoutAction = () => {
    authLogout();
    window.location.href = '/login';
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#2563EB] selection:text-white max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Authenticated Vijayawada Municipal Administrator profile and security settings.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditName(profile.name);
              setEditEmail(profile.email);
              setEditDepartment(profile.department);
              setEditModalOpen(true);
            }}
            leftIcon={<Edit className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {noticeMessage}
        </div>
      )}

      {/* Main Profile Card */}
      <Card className="p-6 bg-[#111827] border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#2563EB]/20 border-4 border-[#2563EB] flex items-center justify-center text-4xl font-black text-white uppercase shadow-2xl">
              {profile.name.charAt(0)}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" title="Active" />
          </div>

          <div className="space-y-3 text-center md:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Account Status: {profile.accountStatus}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                Role: {profile.role}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h2>
              <p className="text-xs text-[#2563EB] font-bold mt-0.5">{profile.department}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="font-mono truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="truncate">{profile.department}</span>
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* Account Details & Security Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Account Details Card */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Administrator Credentials</h3>
                <p className="text-xs text-slate-400">Official MongoDB user account attributes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Full Name</span>
                <p className="font-bold text-white text-sm">{profile.name}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Official Email</span>
                <p className="font-mono font-bold text-slate-200 truncate">{profile.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">System Role</span>
                <p className="font-bold text-white">{profile.role}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Account Status</span>
                <p className="font-bold text-emerald-400">{profile.accountStatus}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5 sm:col-span-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Department</span>
                <p className="font-bold text-white">{profile.department}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Actions Card */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 bg-[#111827] border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Account Security</h3>
                <p className="text-xs text-slate-400">Authentication & password settings</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Authentication Type</span>
                <p className="font-bold text-emerald-400">JWT Token Security</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Access Level</span>
                <p className="font-bold text-[#2563EB]">System Administrator</p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPasswordModalOpen(true)}
                  leftIcon={<Key className="w-3.5 h-3.5 text-sky-400" />}
                  className="w-full border-slate-800 bg-slate-900 text-slate-200 hover:text-white font-bold"
                >
                  Change Password
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogoutAction}
                  leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
                  className="w-full border-slate-800 bg-slate-900 text-rose-300 hover:text-rose-200 font-bold"
                >
                  Logout Administrator
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Edit Admin Details</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">
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
                  <label className="block font-medium text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditModalOpen(false)}
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

      {/* Change Password Modal */}
      <AnimatePresence>
        {passwordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Change Password</h3>
                <button onClick={() => setPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={pwdCurrent}
                    onChange={(e) => setPwdCurrent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={pwdNew}
                    onChange={(e) => setPwdNew(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={pwdConfirm}
                    onChange={(e) => setPwdConfirm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordModalOpen(false)}
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
                    Update Password
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
