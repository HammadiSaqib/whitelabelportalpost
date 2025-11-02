import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    growth: number;
  }>;
  title?: string;
}

export default function RevenueChart({ data, title = "Revenue Trend" }: RevenueChartProps) {
  return (
    <Card className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-xs text-blue-600 font-semibold">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-inner p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <defs>
                <filter id="revenueShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} opacity={0.8} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                tickLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              />
              <YAxis 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                tickLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              />
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
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5, filter: "url(#revenueShadow)" }}
                activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 3, fill: "white" }}
                filter="url(#revenueShadow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}