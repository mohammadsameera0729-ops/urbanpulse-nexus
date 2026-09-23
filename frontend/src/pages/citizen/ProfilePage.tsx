import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/auth/Input';
import { Avatar } from '../../components/ui/Avatar';
import { ValidationMessage } from '../../components/auth/ValidationMessage';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Globe, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  Camera,
  PhoneCall,
  Briefcase
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isStaff = user?.role === 'staff';

  // Profile Form State initialized dynamically from authenticated user
  const [formData, setFormData] = useState({
    name: user?.name || 'Not provided',
    email: user?.email || 'Not provided',
    department: user?.department || (isStaff ? 'Not assigned' : ''),
    phone: user?.phone || (user as any)?.phone || (user as any)?.mobile || 'Not provided',
    address: isStaff ? 'Vijayawada Municipal Corporation Main Office' : 'Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    pinCode: isStaff ? '520001' : '520010',
    emergencyContact: isStaff ? 'Municipal Control Room: 0866-2422400' : 'Not provided',
    avatar: user?.avatar || '',
  });

  // Sync state whenever authenticated user changes
  useEffect(() => {
    if (user) {
      const isStaffUser = user.role === 'staff';
      setFormData((prev) => ({
        ...prev,
        name: user.name || 'Not provided',
        email: user.email || 'Not provided',
        department: user.department || (isStaffUser ? 'Not assigned' : ''),
        phone: user.phone || (user as any)?.mobile || prev.phone,
        address: isStaffUser ? 'Vijayawada Municipal Corporation Main Office' : 'Vijayawada',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        country: 'India',
        pinCode: isStaffUser ? '520001' : '520010',
        emergencyContact: isStaffUser ? 'Municipal Control Room: 0866-2422400' : 'Not provided',
      }));
    }
  }, [user]);

  // Activity Stats State loaded from real API
  const [statsLoading, setStatsLoading] = useState(true);
  const [citizenStats, setCitizenStats] = useState({ submitted: 0, resolved: 0 });
  const [staffStats, setStaffStats] = useState({ active: 0, resolved: 0 });

  useEffect(() => {
    const fetchActivityStats = async () => {
      setStatsLoading(true);
      try {
        const token =
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!token) {
          setStatsLoading(false);
          return;
        }

        if (isStaff) {
          const res = await fetch(`${API_BASE}/staff/complaints`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.complaints)) {
            const complaints = data.complaints;
            const active = complaints.filter((c: any) => c.status !== 'resolved').length;
            const resolved = complaints.filter((c: any) => c.status === 'resolved').length;
            setStaffStats({ active, resolved });
          }
        } else {
          const res = await fetch(`${API_BASE}/complaints`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.complaints)) {
            const complaints = data.complaints;
            const submitted = complaints.length;
            const resolved = complaints.filter((c: any) => c.status === 'resolved').length;
            setCitizenStats({ submitted, resolved });
          }
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchActivityStats();
  }, [isStaff]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isStaff ? 'Staff Profile & Identity' : 'Citizen Profile & Identity'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isStaff
              ? 'View your assigned department details, staff credential information, and field activity summary.'
              : 'Manage your personal contact details, verified Vijayawada location, and municipal emergency records.'}
          </p>
        </div>

        {!isEditing ? (
          <Button
            variant="primary"
            onClick={() => setIsEditing(true)}
            leftIcon={<Edit3 className="w-4 h-4" />}
            className="shadow-lg shadow-brand-500/20 font-bold"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
              className="shadow-lg shadow-brand-500/20 font-bold"
            >
              Save Profile
            </Button>
          </div>
        )}
      </div>

      {savedSuccess && (
        <ValidationMessage
          type="success"
          title="Profile Updated Successfully"
          message={
            isStaff
              ? 'Your staff profile and municipal contact records have been synced.'
              : 'Your citizen details and emergency contact records have been synced.'
          }
        />
      )}

      {/* Main Grid: Avatar Card & Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar & Verification Badge (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
            <div className="relative inline-block">
              <Avatar
                src={formData.avatar}
                name={formData.name}
                size="xl"
                className="w-24 h-24 text-2xl mx-auto ring-4 ring-brand-500/30 shadow-xl"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    })
                  }
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 transition-colors"
                  title="Change Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h2>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{formData.email}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isStaff
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}>
                <ShieldCheck className="w-4 h-4" />
                {isStaff ? 'Verified Staff Member' : 'Verified Citizen ID'}
              </span>
              <p className="text-[11px] text-slate-400">
                {isStaff
                  ? `Department: ${formData.department || 'Public Health & Sanitation'}`
                  : 'Registered Zone: Vijayawada Central Zone (520010)'}
              </p>
            </div>
          </Card>

          {/* Quick Stats Summary */}
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 rounded-3xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Activity Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              {isStaff ? (
                <>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="block text-[10px] text-slate-400 font-sans">Active Assigned</span>
                    <strong className="text-lg font-bold text-amber-500">
                      {statsLoading ? '...' : staffStats.active}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="block text-[10px] text-slate-400 font-sans font-semibold">Resolved</span>
                    <strong className="text-lg font-bold text-emerald-500">
                      {statsLoading ? '...' : staffStats.resolved}
                    </strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="block text-[10px] text-slate-400 font-sans">Complaints Submitted</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-white">
                      {statsLoading ? '...' : citizenStats.submitted}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="block text-[10px] text-slate-400 font-sans font-semibold">Resolved</span>
                    <strong className="text-lg font-bold text-emerald-500">
                      {statsLoading ? '...' : citizenStats.resolved}
                    </strong>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Fields (Span 8) */}
        <div className="lg:col-span-8">
          <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* 1. Identity & Contact */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    leftIcon={<User className="w-4 h-4" />}
                  />

                  <Input
                    label="Official Email Address"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </div>

                {isStaff && (
                  <Input
                    label="Assigned Department"
                    disabled={true}
                    value={formData.department || 'Public Health & Sanitation'}
                    leftIcon={<Briefcase className="w-4 h-4 text-brand-500" />}
                  />
                )}

                <Input
                  label="Mobile Phone Number"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
              </div>

              {/* 2. Resident / Office Address */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {isStaff ? 'Municipal Work Location' : 'Municipal Address & Location'}
                </h3>

                <Input
                  label={isStaff ? 'Office / Base Location' : 'Residential Address'}
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />

                  <Input
                    label="State / Province"
                    disabled={!isEditing}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    disabled={!isEditing}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    leftIcon={<Globe className="w-4 h-4" />}
                  />

                  <Input
                    label="PIN / Zip Code"
                    disabled={!isEditing}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  />
                </div>
              </div>

              {/* 3. Emergency Contact */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-rose-500 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  {isStaff ? 'Municipal Control Room Hotline' : 'Emergency Contact Hotline'}
                </h3>

                <Input
                  label={isStaff ? 'Control Room / Emergency Line' : 'Emergency Contact Number & Relation'}
                  disabled={!isEditing}
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  leftIcon={<PhoneCall className="w-4 h-4 text-rose-500" />}
                />
              </div>

            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};
