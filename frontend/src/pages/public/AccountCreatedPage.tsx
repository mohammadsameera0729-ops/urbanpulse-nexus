import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight, ShieldCheck, Activity, UserCheck, Sparkles } from 'lucide-react';

export const AccountCreatedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { fullName?: string; email?: string; role?: string } | null;

  const fullName = state?.fullName || 'Valued User';
  const email = state?.email || 'user@example.com';
  const role = state?.role || 'citizen';

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 text-center">
        
        {/* Brand Header */}
        <Link to="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            UrbanPulse <span className="text-brand-600 dark:text-brand-400">Nexus</span>
          </span>
        </Link>

        {/* Auth Card */}
        <AuthCard>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-4 space-y-6"
          >
            {/* Animated Checkmark Badge */}
            <div className="relative w-20 h-20 mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/30"
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider border border-brand-200 dark:border-brand-800">
                <Sparkles className="w-3.5 h-3.5" /> Welcome Aboard
              </div>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Account Created Successfully!
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Welcome to UrbanPulse Nexus, <strong className="text-slate-800 dark:text-slate-200">{fullName}</strong>. Your profile is ready.
              </p>
            </div>

            {/* Account Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Account Name:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">{fullName}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Registered Email:</span>
                <strong className="text-brand-600 dark:text-brand-400 font-mono">{email}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Assigned Role:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {role}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full shadow-lg shadow-brand-500/25 py-3 font-bold text-sm rounded-xl"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Sign In
              </Button>
            </div>
          </motion.div>
        </AuthCard>

      </div>
    </div>
  );
};
