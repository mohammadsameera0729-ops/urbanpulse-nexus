import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/auth/Input';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Checkbox } from '../../components/auth/Checkbox';
import { ValidationMessage } from '../../components/auth/ValidationMessage';
import { Button } from '../../components/ui/Button';
import { Role } from '../../types';
import { 
  Activity, 
  Mail, 
  Lock, 
  ArrowRight, 
  Home,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  BadgeCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, authError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password, selectedRole, rememberMe);
      setLoading(false);

      if (success) {
        if (selectedRole === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (selectedRole === 'staff') {
          navigate('/staff/dashboard', { replace: true });
        } else {
          navigate('/citizen/dashboard', { replace: true });
        }
      } else {
        setErrorMessage(authError || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Unable to connect to server.');
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#0B1220] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white">
      
      {/* ====================================================
          LEFT PANEL: Title, Highlights & Live Statistics
          ==================================================== */}
      <div className="lg:col-span-6 hidden lg:flex flex-col justify-between p-12 lg:p-16 relative bg-[#0F172A] border-r border-slate-800">
        
        {/* Header Logo & Title */}
        <div className="relative z-10 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-[#2563EB]/25">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white">
                UrbanPulse <span className="text-[#2563EB]">Nexus</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase">
                AI Smart City Operations Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Platform Highlights & Platform Overview */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-md font-sans">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-widest block">
              PLATFORM OVERVIEW
            </span>
            <h2 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
              UrbanPulse Nexus
            </h2>
            <p className="text-sm font-semibold text-[#2563EB]">
              AI Smart City Operations Platform
            </p>
          </div>

          {/* Exactly Four Compact Platform Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#111827] p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>AI Traffic Monitoring</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#111827] p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Smart City GIS</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#111827] p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Civic Complaint Management</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#111827] p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Role-Based Operations</span>
            </div>
          </div>

          {/* Factual Platform Overview Card */}
          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-3 shadow-lg">
            <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-widest block">
              PLATFORM OVERVIEW
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 font-medium">Traffic Monitoring</span>
                <span className="font-bold text-white">12 Vijayawada monitoring points</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 font-medium">Smart City GIS</span>
                <span className="font-bold text-white">Vijayawada location-based mapping</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 font-medium">Municipal Departments</span>
                <span className="font-bold text-white">6 departments</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 font-medium">Demo Camera</span>
                <span className="font-bold text-white">Local browser webcam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 text-xs text-[#94A3B8] flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span>© {new Date().getFullYear()} UrbanPulse Nexus</span>
          <span>Role-Based Secure Login</span>
        </div>
      </div>

      {/* ====================================================
          RIGHT PANEL: Centered Login Card
          ==================================================== */}
      <div className="lg:col-span-6 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile Header Logo */}
          <div className="text-center space-y-2 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#2563EB]/25">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
            </Link>
          </div>

          {/* Centered Login Card */}
          <div className="p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Access your UrbanPulse municipal dashboard or portal.
              </p>
            </div>

            {errorMessage && (
              <ValidationMessage type="error" message={errorMessage} />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Selection (Above Email field) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Login As
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('citizen')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      selectedRole === 'citizen'
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('staff')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      selectedRole === 'staff'
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      selectedRole === 'admin'
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Email Address / Official Email */}
              <Input
                label={selectedRole === 'citizen' ? 'Email Address' : 'Official Email'}
                type="email"
                required
                placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <div>
                <PasswordInput
                  label="Password"
                  required
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex items-center justify-between pt-2">
                  <Checkbox
                    label="Remember Me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />

                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 py-3 font-bold text-sm rounded-xl shadow-lg shadow-[#2563EB]/25"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {selectedRole === 'admin' ? 'Admin Login' : selectedRole === 'staff' ? 'Staff Login' : 'Citizen Login'}
              </Button>


              {/* Back to Home Button */}
              <Link to="/">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full mt-2 py-2.5 text-xs font-bold text-[#94A3B8] border-slate-800 hover:bg-slate-900 rounded-xl"
                  leftIcon={<Home className="w-4 h-4" />}
                >
                  Back to Home
                </Button>
              </Link>
            </form>
          </div>

          {/* Register Link Below Card */}
          <p className="text-center text-xs text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#2563EB] hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};


