import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  checked,
  id,
  className = '',
  onChange,
  ...props
}) => {
  const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1">
      <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:bg-brand-600 peer-checked:border-brand-600 peer-focus:ring-2 peer-focus:ring-brand-500/20 transition-all duration-150 flex items-center justify-center group-hover:border-brand-500">
            <Check className={`w-3 h-3 text-white transition-transform ${checked ? 'scale-100' : 'scale-0'}`} />
          </div>
        </div>
        {label && <span className="text-xs text-slate-600 dark:text-slate-300">{label}</span>}
      </label>
      {error && <p className="text-xs text-rose-500 font-medium pl-6">{error}</p>}
    </div>
  );
};
