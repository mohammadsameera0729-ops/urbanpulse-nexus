import React from 'react';
import { Card } from '../ui/Card';

export interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <Card
      className={`w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl relative overflow-hidden ${className}`}
    >
      {/* Top subtle gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600" />
      {children}
    </Card>
  );
};
