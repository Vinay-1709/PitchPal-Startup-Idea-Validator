import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MetricPieProps {
  score: number;
}

const MetricPie: React.FC<MetricPieProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (val: number) => {
    if (val >= 80) return '#10b981'; // Green
    if (val >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const activeColor = getColor(score);
  const emptyColor = '#e2e8f0'; // Default light mode color
  const emptyColorDark = '#334155'; // Dark mode slate-700

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Moved cornerRadius to Pie component as it is not a valid prop for Cell in this version */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            paddingAngle={5}
            cornerRadius={10}
          >
            <Cell key="score" fill={activeColor} />
            <Cell key="remaining" fill="currentColor" className="text-slate-200 dark:text-slate-700" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="block text-4xl font-bold text-slate-800 dark:text-white">{score}</span>
        <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score</span>
      </div>
    </div>
  );
};

export default MetricPie;