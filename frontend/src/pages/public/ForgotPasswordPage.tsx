import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/auth/Input';
import { ValidationMessage } from '../../components/auth/ValidationMessage';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, Send, CheckCircle2, Activity } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex flex-col justify-center items-center bg-[#0B1220] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white">
      
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

        {/* Centered Forgot Password Card */}
        <div className="p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
              Forgot Password
            </h1>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Enter your registered email to receive a password reset link.
            </p>
          </div>

          {submitted ? (
            <div className="py-4 space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <ValidationMessage
                type="success"
                message={`A reset link has been dispatched to ${email}`}
              />

              <p className="text-xs text-[#94A3B8]">
                Please check your inbox to reset your password.
              </p>

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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <ValidationMessage type="error" message={error} />}

              <Input
                label="Registered Email Address"
                type="email"
                required
                placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Send Reset Link Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 py-3 font-bold text-sm rounded-xl shadow-lg shadow-[#2563EB]/25"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Reset Link
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
          )}
        </div>

      </div>

    </div>
  );
};

