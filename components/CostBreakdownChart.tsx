import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CostItem } from '../types';

interface CostBreakdownChartProps {
  data: CostItem[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e'];

const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#1e293b', fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend to handle long text and overflow properly */}
      <div className="mt-4 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <span 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <div className="flex justify-between w-full">
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate mr-2" title={item.category}>
                  {item.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                   ₹{(item.amount / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownChart;