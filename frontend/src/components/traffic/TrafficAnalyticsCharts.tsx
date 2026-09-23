import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { 
  HourlyTrafficData, 
  PeakHourStat 
} from '../../types/traffic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { BarChart3, LineChart, TrendingUp, Clock, Gauge } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrafficAnalyticsChartsProps {
  hourlyData: HourlyTrafficData[];
  peakStats: PeakHourStat[];
}

export const TrafficAnalyticsCharts: React.FC<TrafficAnalyticsChartsProps> = ({
  hourlyData,
  peakStats,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'flow' | 'density' | 'speed' | 'peak' | 'hourly'>('flow');

  const hoursLabels = hourlyData.map((d) => d.time);

  // 1. Vehicles Per Hour Dataset
  const flowChartData = {
    labels: hoursLabels,
    datasets: [
      {
        label: 'Vehicles / Hour (City-wide Total)',
        data: hourlyData.map((d) => d.vehicles),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  // 2. Traffic Density Trend Dataset
  const densityChartData = {
    labels: hoursLabels,
    datasets: [
      {
        label: 'Traffic Density (%)',
        data: hourlyData.map((d) => d.density),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  // 3. Average Speed Trend Dataset
  const speedChartData = {
    labels: hoursLabels,
    datasets: [
      {
        label: 'Average Corridor Speed (km/h)',
        data: hourlyData.map((d) => d.avgSpeed),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  // 4. Peak Hour Analysis Dataset (Bar)
  const peakChartData = {
    labels: peakStats.map((p) => p.period),
    datasets: [
      {
        label: 'Cumulative Volume (Vehicles)',
        data: peakStats.map((p) => p.volume),
        backgroundColor: ['rgba(244, 63, 94, 0.8)', 'rgba(56, 189, 248, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        borderRadius: 8,
      },
    ],
  };

  // 5. Hourly Vehicle Count (Bar)
  const hourlyCountData = {
    labels: hoursLabels,
    datasets: [
      {
        label: 'Hourly Vehicle Volume Breakdown',
        data: hourlyData.map((d) => d.vehicles),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        hoverBackgroundColor: '#38bdf8',
        borderRadius: 4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', font: { size: 11, family: 'Inter' } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
      },
      y: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
      },
    },
  };

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      {/* Top Header & Chart Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <LineChart className="w-5 h-5 text-brand-400" />
            City Traffic Analytics & Diurnal Flow Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            24-hour visual analytics across volume, density, corridor speed, and peak hours.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveChartTab('flow')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeChartTab === 'flow'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vehicles / Hr
          </button>
          <button
            onClick={() => setActiveChartTab('density')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeChartTab === 'density'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Density Trend
          </button>
          <button
            onClick={() => setActiveChartTab('speed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeChartTab === 'speed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Speed Trend
          </button>
          <button
            onClick={() => setActiveChartTab('peak')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeChartTab === 'peak'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Peak Analysis
          </button>
          <button
            onClick={() => setActiveChartTab('hourly')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeChartTab === 'hourly'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hourly Count
          </button>
        </div>
      </div>

      {/* Chart Canvas Display */}
      <div className="h-80 w-full relative">
        {activeChartTab === 'flow' && <Line data={flowChartData} options={lineChartOptions} />}
        {activeChartTab === 'density' && <Line data={densityChartData} options={lineChartOptions} />}
        {activeChartTab === 'speed' && <Line data={speedChartData} options={lineChartOptions} />}
        {activeChartTab === 'peak' && <Bar data={peakChartData} options={lineChartOptions} />}
        {activeChartTab === 'hourly' && <Bar data={hourlyCountData} options={lineChartOptions} />}
      </div>
    </Card>
  );
};
