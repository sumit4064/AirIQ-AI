import React from 'react';
import { Building2, TrendingDown, CheckCircle, BarChart3 } from 'lucide-react';

export default function MultiCityPanel({ comparativeData }) {
  if (!comparativeData || comparativeData.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Multi-City Comparative Intelligence Dashboard
            </h3>
            <p className="text-xs text-slate-400">
              Geospatial analytics tracking compliance, actionable protocols & intervention transferability across Indian Metros.
            </p>
          </div>
        </div>
        <span className="bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full font-mono">
          CPCB CAG Benchmark Layer
        </span>
      </div>

      {/* Comparative Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Metro City</th>
              <th className="p-3">Current AQI</th>
              <th className="p-3">24h Forecast</th>
              <th className="p-3">Satellite NO2</th>
              <th className="p-3">Primary Source</th>
              <th className="p-3">Actionable Protocol Rate</th>
              <th className="p-3">GRAP Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparativeData.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-bold text-slate-100 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>{item.city}</span>
                </td>
                <td className="p-3">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                    item.current_aqi > 200 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.current_aqi}
                  </span>
                </td>
                <td className="p-3 font-mono text-cyan-300">{item.forecast_24h} AQI</td>
                <td className="p-3 font-mono text-slate-400">{item.no2} µg/m³</td>
                <td className="p-3 text-slate-300">{item.primary_source}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: item.actionable_protocol_rate }}
                      ></div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{item.actionable_protocol_rate}</span>
                  </div>
                </td>
                <td className="p-3 font-mono font-semibold text-purple-300">
                  {item.compliance_rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
