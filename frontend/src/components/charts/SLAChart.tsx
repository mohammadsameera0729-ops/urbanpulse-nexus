import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const SLAChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = {
    labels: ['Public Works', 'Transportation', 'Sanitation', 'Water Auth', 'Energy'],
    datasets: [
      {
        label: 'Resolved within SLA (%)',
        data: [94.5, 98.2, 91.0, 95.8, 89.4],
        backgroundColor: '#2563eb',
        borderRadius: 6,
      },
      {
        label: 'Overdue Tickets (%)',
        data: [5.5, 1.8, 9.0, 4.2, 10.6],
        backgroundColor: isDark ? '#ef4444' : '#f87171',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#94a3b8' : '#475569',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } },
      },
      y: {
        max: 100,
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};
