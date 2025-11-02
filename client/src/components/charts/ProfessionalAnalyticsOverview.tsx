import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  month: string;
  totalRevenue?: number;
  mainSiteRevenue?: number;
  whiteLabelRevenue?: number;
  organization?: number;
}

interface SelectedMetrics {
  totalRevenue: boolean;
  mainSiteRevenue: boolean;
  whiteLabelRevenue: boolean;
  organization: boolean;
}

interface ProfessionalAnalyticsOverviewProps {
  data: AnalyticsData[];
  title?: string;
  selectedMetrics: SelectedMetrics;
  primaryColor?: string;
  secondaryColor?: string;
}

const ProfessionalAnalyticsOverview: React.FC<ProfessionalAnalyticsOverviewProps> = ({
  data,
  title = "Analytics Overview",
  selectedMetrics,
  primaryColor = '#3b82f6',
  secondaryColor = '#64748b'
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Professional color palette
  const colorPalette = {
    totalRevenue: {
      primary: '#3b82f6',
      gradient: 'rgba(59, 130, 246, 0.1)',
      border: '#3b82f6',
      point: '#ffffff'
    },
    mainSiteRevenue: {
      primary: '#10b981',
      gradient: 'rgba(16, 185, 129, 0.1)',
      border: '#10b981',
      point: '#ffffff'
    },
    whiteLabelRevenue: {
      primary: '#8b5cf6',
      gradient: 'rgba(139, 92, 246, 0.1)',
      border: '#8b5cf6',
      point: '#ffffff'
    },
    organization: {
      primary: '#f59e0b',
      gradient: 'rgba(245, 158, 11, 0.1)',
      border: '#f59e0b',
      point: '#ffffff'
    }
  };

  // Create gradient backgrounds
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;

      // Create gradients for each dataset
      Object.keys(colorPalette).forEach((key) => {
        const colors = colorPalette[key as keyof typeof colorPalette];
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, colors.gradient);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
        
        // Store gradient for use in datasets
        (chart as any)[`gradient_${key}`] = gradient;
      });
      
      chart.update('none');
    }
  }, [data]);

  // Prepare datasets based on selected metrics
  const datasets = [];

  if (selectedMetrics.totalRevenue && data.some(d => d.totalRevenue !== undefined)) {
    datasets.push({
      label: 'Total Revenue',
      data: data.map(d => d.totalRevenue || 0),
      borderColor: colorPalette.totalRevenue.primary,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        return chart.gradient_totalRevenue || colorPalette.totalRevenue.gradient;
      },
      borderWidth: 3,
      pointBackgroundColor: colorPalette.totalRevenue.point,
      pointBorderColor: colorPalette.totalRevenue.primary,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBorderWidth: 4,
      fill: true,
      tension: 0.4,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowBlur: 10,
      shadowColor: 'rgba(59, 130, 246, 0.3)'
    });
  }

  if (selectedMetrics.mainSiteRevenue && data.some(d => d.mainSiteRevenue !== undefined)) {
    datasets.push({
      label: 'Main Site Revenue',
      data: data.map(d => d.mainSiteRevenue || 0),
      borderColor: colorPalette.mainSiteRevenue.primary,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        return chart.gradient_mainSiteRevenue || colorPalette.mainSiteRevenue.gradient;
      },
      borderWidth: 3,
      pointBackgroundColor: colorPalette.mainSiteRevenue.point,
      pointBorderColor: colorPalette.mainSiteRevenue.primary,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBorderWidth: 4,
      fill: true,
      tension: 0.4
    });
  }

  if (selectedMetrics.whiteLabelRevenue && data.some(d => d.whiteLabelRevenue !== undefined)) {
    datasets.push({
      label: 'White Label Revenue',
      data: data.map(d => d.whiteLabelRevenue || 0),
      borderColor: colorPalette.whiteLabelRevenue.primary,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        return chart.gradient_whiteLabelRevenue || colorPalette.whiteLabelRevenue.gradient;
      },
      borderWidth: 3,
      pointBackgroundColor: colorPalette.whiteLabelRevenue.point,
      pointBorderColor: colorPalette.whiteLabelRevenue.primary,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBorderWidth: 4,
      fill: true,
      tension: 0.4
    });
  }

  if (selectedMetrics.organization && data.some(d => d.organization !== undefined)) {
    datasets.push({
      label: 'Organizations',
      data: data.map(d => d.organization || 0),
      borderColor: colorPalette.organization.primary,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        return chart.gradient_organization || colorPalette.organization.gradient;
      },
      borderWidth: 3,
      borderDash: [8, 4],
      pointBackgroundColor: colorPalette.organization.point,
      pointBorderColor: colorPalette.organization.primary,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBorderWidth: 4,
      fill: true,
      tension: 0.4,
      yAxisID: 'y1'
    });
  }

  const chartData = {
    labels: data.map(d => d.month),
    datasets
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false // We'll create a custom legend
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        },
        callbacks: {
          title: (context) => {
            return `${context[0].label}`;
          },
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label.includes('Revenue')) {
              return `${label}: $${value.toLocaleString()}`;
            } else {
              return `${label}: ${value}`;
            }
          }
        },
        filter: (tooltipItem) => {
          return tooltipItem.parsed.y !== null;
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(148, 163, 184, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 8
        },
        border: {
          display: true,
          color: '#cbd5e1',
          width: 2
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          display: true,
          color: 'rgba(148, 163, 184, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 8,
          callback: function(value) {
            if (typeof value === 'number') {
              return '$' + value.toLocaleString();
            }
            return value;
          }
        },
        border: {
          display: true,
          color: '#cbd5e1',
          width: 2
        }
      },
      y1: {
        type: 'linear' as const,
        display: selectedMetrics.organization,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#f59e0b',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 8
        },
        border: {
          display: true,
          color: '#f59e0b',
          width: 2
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
        hoverBorderWidth: 4
      },
      line: {
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <p className="text-sm mt-1 opacity-80" style={{ color: secondaryColor }}>
                Professional analytics visualization
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-xs text-emerald-600 font-semibold">Live Data</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl border border-slate-200 shadow-inner">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
                <BarChart3 className="h-12 w-12 mx-auto mb-3 relative z-10" style={{ color: primaryColor }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: secondaryColor }}>No data available</p>
              <p className="text-xs mt-1 opacity-70" style={{ color: secondaryColor }}>
                Select metrics to view professional analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <p className="text-sm mt-1 opacity-80" style={{ color: secondaryColor }}>
                Professional Chart.js Analytics Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <Activity className="h-3 w-3 mr-1 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Live</span>
            </Badge>
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-inner p-4">
          <div className="h-80">
            <Line ref={chartRef} data={chartData} options={options} />
          </div>
        </div>

        {/* Custom Professional Legend */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200 shadow-sm">
          {datasets.map((dataset, index) => {
            const colorKey = Object.keys(colorPalette)[index] as keyof typeof colorPalette;
            const colors = colorPalette[colorKey];
            
            return (
              <div 
                key={dataset.label}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-2 rounded-full shadow-sm"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderStyle: dataset.borderDash ? 'dashed' : 'solid',
                      borderWidth: dataset.borderDash ? '1px' : '0px',
                      borderColor: colors.primary
                    }}
                  ></div>
                  <div 
                    className="w-3 h-3 rounded-full border-2 bg-white shadow-sm"
                    style={{ borderColor: colors.primary }}
                  ></div>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  {dataset.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalAnalyticsOverview;