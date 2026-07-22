import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, Compass, Award, AlertCircle } from 'lucide-react';

export default function AttributionPanel({ attributionData }) {
  if (!attributionData) return null;

  const breakdown = attributionData.attribution_breakdown || [];
  const confidence = attributionData.confidence_score || 91.5;
  const upwind = attributionData.upwind_transport_direction || 'SW (210°)';
  const primary = attributionData.primary_contributor || 'Vehicular Exhaust';

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-base text-slate-100">
              Geospatial Source Attribution Engine
            </h3>
          </div>
          <div className="flex items-center space-x-1.5 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-full text-xs font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>{confidence}% Confidence</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Multi-modal spatial analysis fusing Sentinel-5P, MODIS thermal anomalies, and traffic density.
        </p>

        {/* Primary Contributor Banner */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Primary Ward Contributor</div>
              <div className="font-display font-bold text-sm text-rose-300">{primary}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400 flex items-center justify-end space-x-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Upwind Transport</span>
            </div>
            <div className="font-mono text-xs text-cyan-300 font-semibold">{upwind}</div>
          </div>
        </div>

        {/* Pie Chart & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="percentage"
                  nameKey="category"
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-medium">{item.category}</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
