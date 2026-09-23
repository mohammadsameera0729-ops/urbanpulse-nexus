import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { MOCK_ACTIVITY_LOGS } from '../../data/landingData';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Layers,
  Filter,
  Maximize2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Bar Chart Data (Monthly Complaint Resolution)
const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Resolved Complaints',
      data: [1200, 1900, 2400, 2100, 2800, 3400, 3900],
      backgroundColor: 'rgba(56, 189, 248, 0.75)',
      borderRadius: 6,
    },
    {
      label: 'New Incidents Reported',
      data: [1400, 2100, 2500, 2200, 2900, 3500, 4000],
      backgroundColor: 'rgba(99, 102, 241, 0.4)',
      borderRadius: 6,
    },
  ],
};

// Line Chart Data (Traffic Density & Sensor Speed)
const lineData = {
  labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
  datasets: [
    {
      label: 'Avg Traffic Speed (km/h)',
      data: [58, 34, 48, 52, 45, 28, 36, 54],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'AI Congestion Risk Score',
      data: [12, 68, 32, 24, 42, 84, 72, 18],
      borderColor: '#f43f5e',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.4,
    },
  ],
};

// Pie Chart Data (Category Distribution)
const pieData = {
  labels: ['Road Potholes', 'Street Lighting', 'Water Leaks', 'Garbage Overflow', 'Traffic Signals'],
  datasets: [
    {
      data: [35, 22, 18, 15, 10],
      backgroundColor: [
        '#0284c7', // brand sky
        '#f59e0b', // amber
        '#06b6d4', // cyan
        '#10b981', // emerald
        '#8b5cf6', // purple
      ],
      borderWidth: 2,
      borderColor: '#0f172a',
    },
  ],
};

// Common Dark Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { size: 11, family: 'Inter, sans-serif' },
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { size: 10 } },
      grid: { color: 'rgba(51, 65, 85, 0.3)' },
    },
    y: {
      ticks: { color: '#64748b', font: { size: 10 } },
      grid: { color: 'rgba(51, 65, 85, 0.3)' },
    },
  },
};

export const AnalyticsPreviewSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Traffic' | 'Infrastructure'>('All');

  const filteredLogs = MOCK_ACTIVITY_LOGS.filter((log) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Traffic') return log.category === 'Traffic' || log.category === 'Security';
    return log.category === 'Infrastructure' || log.category === 'AI Trigger';
  });

  return (
    <section id="analytics" className="py-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-brand-400" /> Executive Analytics & Telemetry
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Real-Time City Command Analytics Preview
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Gain immediate 360-degree situational awareness with live sensor streams, predictive traffic charts, and automated SLA compliance tables.
          </p>
        </div>

        {/* Outer Dashboard Frame Mockup */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl">
          
          {/* Top Control Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-slate-200">UrbanPulse Municipal Analytics Hub</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono hidden md:inline">Live Stream Syncing...</span>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  onClick={() => setSelectedFilter('All')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedFilter === 'All' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  All Feeds
                </button>
                <button
                  onClick={() => setSelectedFilter('Traffic')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedFilter === 'Traffic' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Traffic
                </button>
                <button
                  onClick={() => setSelectedFilter('Infrastructure')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedFilter === 'Infrastructure' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Infrastructure
                </button>
              </div>
            </div>
          </div>

          {/* Grid of 3 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Bar Chart: Resolution Trends */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-400" />
                  <h3 className="text-sm font-bold text-white">Monthly SLA Complaint Resolution</h3>
                </div>
                <span className="text-[10px] font-mono bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded">+18.4% MoM</span>
              </div>
              <div className="h-60 relative">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>

            {/* 2. Line Chart: Live Traffic Flow */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Diurnal Traffic Speed & AI Risk Index</h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">60 FPS IoT Sensors</span>
              </div>
              <div className="h-60 relative">
                <Line data={lineData} options={chartOptions} />
              </div>
            </div>

          </div>

          {/* Bottom Grid: Pie Chart + Heat Map Placeholder + Live Log Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 3. Pie Chart: Category Breakdown */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">Category Distribution</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Total: 15.4k Tickets</span>
              </div>
              <div className="h-56 relative flex items-center justify-center">
                <Pie data={pieData} options={{ ...chartOptions, scales: undefined }} />
              </div>
            </div>

            {/* 4. Heat Map Visual Placeholder */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">City Incident Heat Map Matrix</h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400">High Density Sector A</span>
              </div>

              {/* Matrix Grid Visualization */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const intensity = (i * 7) % 5;
                    const bgColors = [
                      'bg-slate-800',
                      'bg-sky-900/60',
                      'bg-blue-600/60',
                      'bg-amber-500/80 animate-pulse',
                      'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
                    ];
                    return (
                      <div
                        key={i}
                        className={`h-7 rounded-md ${bgColors[intensity]} border border-slate-700/40 flex items-center justify-center text-[9px] font-mono font-bold text-white/80`}
                        title={`Zone ${i + 1} Intensity ${intensity}`}
                      >
                        Z{i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Low Risk (Green)</span>
                  <span>Critical Hotspot (Red)</span>
                </div>
              </div>
            </div>

            {/* 5. Live Recent Activity Table */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Recent Activity Stream</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-2.5 overflow-hidden">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <p className="font-semibold text-slate-200 truncate">{log.event}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {log.location} • <Clock className="w-3 h-3 text-slate-500 ml-1" /> {log.time}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono whitespace-nowrap ${
                        log.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : log.status === 'Processing'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
