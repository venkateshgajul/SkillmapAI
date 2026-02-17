import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-ink-800 border border-slate-700 rounded-xl p-3 shadow-glass">
        <p className="text-slate-400 text-xs font-body mb-1">{label}</p>
        <p className="font-display font-bold text-acid text-lg">{payload[0].value}%</p>
        <p className="text-slate-500 text-xs">{payload[0].payload.jobTitle}</p>
      </div>
    );
  }
  return null;
};

const ProgressChart = ({ logs }) => {
  if (!logs?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-ink-900 border border-slate-800 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-600 text-sm font-body">No progress data yet</p>
        <p className="text-slate-700 text-xs mt-1">Run your first analysis to start tracking</p>
      </div>
    );
  }

  const chartData = logs.map((log, i) => ({
    name: new Date(log.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: log.skillMatchPercentage,
    jobTitle: log.jobTitle
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#B5FF4D"
          strokeWidth={2.5}
          dot={{ fill: '#B5FF4D', r: 4, strokeWidth: 0 }}
          activeDot={{ fill: '#B5FF4D', r: 6, strokeWidth: 2, stroke: '#080B14' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
