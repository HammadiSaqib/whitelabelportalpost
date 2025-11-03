import React from 'react';
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
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

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

interface ChartData {
  month: string;
  totalRevenue?: number;
  mainSiteRevenue?: number;
  whiteLabelRevenue?: number;
  organization?: number;
}

interface ProfessionalChartProps {
  data: ChartData[];
  title: string;
  type?: 'line' | 'bar';
  selectedMetrics: {
    totalRevenue: boolean;
    mainSiteRevenue: boolean;
    whiteLabelRevenue: boolean;
    organization: boolean;
  };
  primaryColor?: string;
  secondaryColor?: string;
}

const ProfessionalChart: React.FC<ProfessionalChartProps> = ({
  data,
  title,
  type = 'line',
  selectedMetrics,
  primaryColor = '#3b82f6',
  secondaryColor = '#64748b'
}) => {
  const labels = data.map(item => item.month);

  const datasets = [];

  if (selectedMetrics.totalRevenue) {
    datasets.push({
      label: 'Total Revenue',
      data: data.map(item => item.totalRevenue || 0),
      borderColor: primaryColor,
      backgroundColor: `${primaryColor}20`,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: primaryColor,
      pointBorderWidth: 3,
      fill: type === 'line',
      tension: 0.4,
    });
  }

  if (selectedMetrics.mainSiteRevenue) {
    datasets.push({
      label: 'Main Site Revenue',
      data: data.map(item => item.mainSiteRevenue || 0),
      borderColor: '#10b981',
      backgroundColor: '#10b98120',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#10b981',
      pointBorderWidth: 3,
      fill: type === 'line',
      tension: 0.4,
    });
  }

  if (selectedMetrics.whiteLabelRevenue) {
    datasets.push({
      label: 'White Label Revenue',
      data: data.map(item => item.whiteLabelRevenue || 0),
      borderColor: '#8b5cf6',
      backgroundColor: '#8b5cf620',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#8b5cf6',
      pointBorderWidth: 3,
      fill: type === 'line',
      tension: 0.4,
    });
  }

  if (selectedMetrics.organization) {
    datasets.push({
      label: 'Organizations',
      data: data.map(item => item.organization || 0),
      borderColor: '#f59e0b',
      backgroundColor: '#f59e0b20',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#f59e0b',
      pointBorderWidth: 3,
      fill: type === 'line',
      tension: 0.4,
      borderDash: [5, 5],
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
          color: secondaryColor,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: secondaryColor,
        padding: {
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: secondaryColor,
        bodyColor: secondaryColor,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Revenue')) {
              return `${label}: $${value.toLocaleString()}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: '#f3f4f6',
          lineWidth: 1,
        },
        ticks: {
          color: secondaryColor,
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#f3f4f6',
          lineWidth: 1,
        },
        ticks: {
          color: secondaryColor,
          font: {
            size: 11,
          },
          callback: function(value) {
            if (typeof value === 'number') {
              return '$' + value.toLocaleString();
            }
            return value;
          },
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 4,
      },
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 shadow-inner">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-3 opacity-40 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: secondaryColor }}>No data available</p>
          <p className="text-xs mt-1 opacity-60" style={{ color: secondaryColor }}>Select metrics to view analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold" style={{ color: secondaryColor }}>{title}</h4>
            <p className="text-sm mt-1 opacity-70" style={{ color: secondaryColor }}>Professional analytics visualization</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live Data</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          {type === 'line' ? (
            <Line data={chartData} options={options} />
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChart;