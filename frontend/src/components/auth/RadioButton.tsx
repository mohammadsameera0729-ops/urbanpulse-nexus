import React from 'react';

export interface RadioButtonOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
}

export interface RadioButtonProps {
  name: string;
  options: RadioButtonOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  label,
  error,
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{label}</label>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <div
              key={option.value}
              onClick={() => !option.disabled && onChange(option.value)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                option.disabled
                  ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : isSelected
                  ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {option.badge && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {option.badge}
                </span>
              )}

              <div className="flex items-center gap-2.5 mb-1">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  disabled={option.disabled}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                {option.icon && <div className={isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>{option.icon}</div>}
                
                <span className={`text-xs font-bold ${isSelected ? 'text-brand-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {option.label}
                </span>
              </div>

              {option.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-tight">
                  {option.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>}
    </div>
  );
};
