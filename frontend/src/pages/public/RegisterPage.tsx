import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/auth/Input';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { ValidationMessage } from '../../components/auth/ValidationMessage';
import { Button } from '../../components/ui/Button';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Activity
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, authError } = useAuth();

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        username: email.trim().toLowerCase().split('@')[0],
        role: 'citizen',
        department: '',
      });

      setLoading(false);

      if (success) {
        navigate('/login');
      } else {
        setErrorMessage(authError || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Unable to connect to server.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center items-center bg-[#0B1220] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-[#2563EB]/25">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              UrbanPulse <span className="text-[#2563EB]">Nexus</span>
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-6">
          
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
              Register Account
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Create your citizen account.
            </p>
          </div>

          {errorMessage && (
            <ValidationMessage type="error" message={errorMessage} />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <Input
              label="Full Name"
              required
              placeholder="e.g. Arjun Rao"
              leftIcon={<User className="w-4 h-4" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Primary Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 py-3 font-bold text-sm rounded-xl shadow-lg shadow-[#2563EB]/25 mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Citizen Account
            </Button>

            {/* Back to Login Button */}
            <Link to="/login">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full mt-2 py-2.5 text-xs font-bold text-[#94A3B8] border-slate-800 hover:bg-slate-900 rounded-xl"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Login
              </Button>
            </Link>

          </form>

        </div>

        {/* Bottom Login Link */}
        <p className="text-center text-xs text-[#94A3B8]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#2563EB] hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};
