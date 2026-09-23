import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ComplaintCategoryChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = {
    labels: [
      'Potholes & Roads',
      'Traffic & Signals',
      'Garbage & Waste',
      'Street Lighting',
      'Water & Sewage',
      'Others',
    ],
    datasets: [
      {
        data: [38, 24, 18, 12, 5, 3],
        backgroundColor: [
          '#3b82f6', // Brand Blue
          '#f59e0b', // Amber
          '#10b981', // Emerald
          '#8b5cf6', // Purple
          '#06b6d4', // Cyan
          '#94a3b8', // Slate
        ],
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: isDark ? '#94a3b8' : '#475569',
          font: { family: 'Inter', size: 11 },
          padding: 12,
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};
