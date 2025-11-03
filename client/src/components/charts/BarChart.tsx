import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    label?: string;
  }>;
  title?: string;
  color?: string;
}

export default function CustomBarChart({ data, title = "Analytics", color = "#3b82f6" }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
          </linearGradient>
          <filter id="barShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} opacity={0.8} />
        <XAxis 
          dataKey="name" 
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
        <Bar 
          dataKey="value" 
          fill="url(#barGradient)"
          radius={[6, 6, 0, 0]}
          filter="url(#barShadow)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}