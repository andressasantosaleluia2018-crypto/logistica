
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint, BranchName } from '../types';

interface EvolutionChartProps {
  data: ChartDataPoint[];
}

const COLORS: Record<BranchName, string> = {
  [BranchName.CAMACARI]: '#3b82f6', // Blue 500
  [BranchName.LIMEIRA]: '#10b981', // Emerald 500
  [BranchName.GUARULHOS]: '#8b5cf6', // Violet 500
  [BranchName.POUSO_ALEGRE]: '#f59e0b', // Amber 500
  [BranchName.SUMARE]: '#ec4899', // Pink 500
};

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-[450px] relative flex flex-col">
      
      <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-sm font-bold text-slate-800 dark:text-white">Evolução Temporal</h3>
           <p className="text-xs text-slate-500 mt-0.5">Volume de ativos ativos por filial</p>
        </div>
        <div className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 flex gap-2 items-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {Object.entries(COLORS).map(([branch, color]) => (
                <linearGradient key={branch} id={`color${branch}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} className="dark:opacity-10" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(4px)',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: '#1e293b',
                fontSize: '11px',
                padding: '8px 12px'
              }}
              itemStyle={{ padding: 0 }}
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}
            />
            
            {Object.values(BranchName).map((branch) => (
              <Area 
                key={branch}
                type="monotone" 
                dataKey={branch} 
                stackId="1" 
                stroke={COLORS[branch]} 
                fill={`url(#color${branch})`} 
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
