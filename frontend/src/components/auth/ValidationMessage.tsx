import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface ValidationMessageProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type = 'error',
  title,
  message,
  className = '',
}) => {
  const styles = {
    error: {
      container: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
    info: {
      container: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed transition-all animate-in fade-in slide-in-from-top-2 ${current.container} ${className}`}
    >
      {current.icon}
      <div className="space-y-0.5">
        {title && <p className="font-bold text-sm">{title}</p>}
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};
