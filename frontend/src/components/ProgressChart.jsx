import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function ProgressChart({ type = 'radar', data }) {
  
  if (type === 'radar') {
    // Single-attempt metrics radar chart
    // 'data' expects: { fluency: X, vocabulary: Y, grammar: Z, relevance: A, fillerControl: B }
    const radarData = [
      { subject: 'Fluency', value: data.fluency || 0 },
      { subject: 'Vocabulary', value: data.vocabulary || 0 },
      { subject: 'Grammar', value: data.grammar !== null ? data.grammar : 0 },
      { subject: 'Relevance', value: data.relevance || 0 },
      { subject: 'Filler Control', value: data.fillerControl || 0 },
    ];

    return (
      <div className="w-full h-72 flex items-center justify-center bg-white dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
            <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} className="dark:stroke-slate-600" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              className="dark:fill-slate-400"
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              className="dark:fill-slate-500"
            />
            <Radar
              name="Metrics"
              dataKey="value"
              stroke="#0284c7"
              fill="#0ea5e9"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'trend') {
    // Performance trend chart over time
    // 'data' expects: [ { date: 'Jun 22', score: 85 }, { date: 'Jun 23', score: 92 } ]
    if (!data || data.length === 0) {
      return (
        <div className="w-full h-72 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-sm font-semibold">No performance data yet</p>
          <p className="text-xs mt-1">Complete your first interview to see trends!</p>
        </div>
      );
    }

    // Format dates for display
    const chartData = data.map((item) => {
      const dateObj = new Date(item.date);
      const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return {
        name: formattedDate,
        Score: item.score
      };
    }).reverse(); // Database history comes desc, we want asc chronological order for trend lines

    return (
      <div className="w-full h-72 bg-white dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 9 }}
              className="dark:fill-slate-400"
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#64748b', fontSize: 10 }}
              className="dark:fill-slate-400"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: '#1e293b', 
                borderRadius: '12px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600
              }}
            />
            <Line 
              type="monotone" 
              dataKey="Score" 
              stroke="#0ea5e9" 
              strokeWidth={3} 
              activeDot={{ r: 6 }} 
              dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
