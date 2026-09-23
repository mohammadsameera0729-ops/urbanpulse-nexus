import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  const getLabel = () => {
    if (!password) return { text: 'Empty', color: 'text-slate-400', barColor: 'bg-slate-200 dark:bg-slate-700' };
    if (score <= 1) return { text: 'Weak', color: 'text-rose-500', barColor: 'bg-rose-500' };
    if (score === 2 || score === 3) return { text: 'Medium', color: 'text-amber-500', barColor: 'bg-amber-500' };
    return { text: 'Strong', color: 'text-emerald-500', barColor: 'bg-emerald-500' };
  };

  const labelInfo = getLabel();

  return (
    <div className="space-y-2 pt-1">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-slate-500 dark:text-slate-400">Password Strength</span>
          <span className={labelInfo.color}>{labelInfo.text}</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-full rounded-full transition-all duration-300 ${
                score >= level ? labelInfo.barColor : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Checklist Badges */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pt-1">
        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasMinLength ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>8+ Characters</span>
        </div>

        <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasUpper ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>1 Uppercase Letter</span>
        </div>

        <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasNumber ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>1 Number</span>
        </div>

        <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasSpecial ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>1 Special Character</span>
        </div>
      </div>
    </div>
  );
};
