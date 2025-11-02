import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function CustomPieChart({ data, title = "Distribution" }: PieChartProps) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  return (
    <Card className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-xs text-purple-600 font-semibold">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="bg-gradient-to-br from-white via-slate-50 to-purple-50 rounded-xl border border-slate-200 shadow-inner p-4">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <defs>
                <filter id="pieShadow">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" />
                </filter>
              </defs>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                stroke="white"
                strokeWidth={3}
                filter="url(#pieShadow)"
              >
                {dataWithColors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}