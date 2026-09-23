import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  subtitle,
  badge,
}) => {
  return (
    <Card hoverable className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900">
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
          </div>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {badge}
            </span>
          )}
        </div>

        {(change || subtitle) && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {change && (
              <span
                className={`inline-flex items-center font-semibold ${
                  changeType === 'positive'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : changeType === 'negative'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {changeType === 'positive' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : changeType === 'negative' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                ) : null}
                {change}
              </span>
            )}
            {subtitle && <span className="text-slate-400 dark:text-slate-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
