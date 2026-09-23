import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

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

        {/* Card */}
        <AuthCard>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-4 space-y-6"
          >
            {/* Checkmark Animation Container */}
            <div className="relative w-20 h-20 mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </motion.div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> Email Verified
              </span>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Email Verified Successfully!
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Your email address has been authenticated. Your UrbanPulse account is now fully active with complete access to municipal tools.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full shadow-lg shadow-brand-500/25 py-3 font-bold text-sm rounded-xl"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Sign In
              </Button>
            </div>
          </motion.div>
        </AuthCard>

      </div>
    </div>
  );
};
