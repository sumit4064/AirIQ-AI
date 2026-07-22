import React from 'react';
import { Wind, Thermometer, Droplets, Eye, ShieldAlert, CloudRain, Navigation, Activity } from 'lucide-react';

export default function LiveMetricsBar({ liveData }) {
  if (!liveData) return null;

  const aqi = liveData.aqi || 185;

  const getAQIBadge = (val) => {
    if (val <= 50) return { label: 'Good', bg: 'bg-[#D9F99D] text-slate-900 font-extrabold' };
    if (val <= 100) return { label: 'Satisfactory', bg: 'bg-lime-200 text-slate-900 font-extrabold' };
    if (val <= 200) return { label: 'Moderate', bg: 'bg-[#FEF08A] text-slate-900 font-extrabold' };
    if (val <= 300) return { label: 'Poor', bg: 'bg-orange-200 text-slate-900 font-extrabold' };
    if (val <= 400) return { label: 'Very Poor', bg: 'bg-rose-200 text-slate-900 font-extrabold' };
    return { label: 'Severe', bg: 'bg-purple-200 text-slate-900 font-extrabold' };
  };

  const badge = getAQIBadge(aqi);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      
      {/* Real-Time AQI Block */}
      <div className="glass-panel rounded-[24px] p-5 col-span-2 sm:col-span-2 flex items-center justify-between border border-slate-200/80 shadow-sm relative overflow-hidden bg-white">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Real-Time AQI</span>
          <div className="flex items-baseline space-x-2.5 mt-1">
            <span className="font-display font-extrabold text-4xl text-slate-900 tracking-tight">{aqi}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-extrabold ${badge.bg}`}>
              {badge.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">CPCB Air Standard</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
          <ShieldAlert className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      {/* Temperature Block (Pastel Blue) */}
      <div className="glass-panel rounded-[24px] p-4 bg-[#7DD3FC] text-slate-900 border-none shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-800">
          <Thermometer className="w-4 h-4 text-slate-900" />
          <span>Temperature</span>
        </div>
        <div className="font-display font-extrabold text-2xl text-slate-900 mt-1">
          {liveData.temperature || 31.5}°C
        </div>
        <div className="w-full bg-slate-900/10 h-2 rounded-full mt-2 overflow-hidden">
          <div className="bg-slate-900 h-full rounded-full" style={{ width: '68%' }}></div>
        </div>
      </div>

      {/* PM2.5 Block */}
      <div className="glass-panel rounded-[24px] p-4 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span className="text-xs text-slate-500 font-bold">PM2.5</span>
        <div className="font-display font-extrabold text-2xl text-slate-900 mt-1">
          {liveData.pm2_5} <span className="text-xs text-slate-500 font-normal">µg/m³</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
          <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, (liveData.pm2_5 / 250) * 100)}%` }}></div>
        </div>
      </div>

      {/* PM10 Block */}
      <div className="glass-panel rounded-[24px] p-4 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span className="text-xs text-slate-500 font-bold">PM10</span>
        <div className="font-display font-extrabold text-2xl text-slate-900 mt-1">
          {liveData.pm10} <span className="text-xs text-slate-500 font-normal">µg/m³</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (liveData.pm10 / 350) * 100)}%` }}></div>
        </div>
      </div>

      {/* NO2 Block (Pastel Yellow) */}
      <div className="glass-panel rounded-[24px] p-4 bg-[#FEF08A] text-slate-900 border-none shadow-sm flex flex-col justify-between">
        <span className="text-xs font-extrabold text-slate-800">NO2 Level</span>
        <div className="font-display font-extrabold text-2xl text-slate-900 mt-1">
          {liveData.no2} <span className="text-xs text-slate-700 font-normal">µg/m³</span>
        </div>
        <span className="text-[10px] text-slate-700 font-semibold">Sentinel-5P</span>
      </div>

      {/* Wind Speed Block */}
      <div className="glass-panel rounded-[24px] p-4 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-500 font-bold">
          <Wind className="w-3.5 h-3.5 text-slate-700" />
          <span>Wind</span>
        </div>
        <div className="font-display font-extrabold text-xl text-slate-900 mt-1">
          {liveData.wind_speed} <span className="text-xs text-slate-500 font-normal">km/h</span>
        </div>
        <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5 font-medium">
          <Navigation className="w-2.5 h-2.5 text-slate-700 transform" style={{ transform: `rotate(${liveData.wind_dir}deg)` }} />
          <span>{liveData.wind_dir}° Vector</span>
        </div>
      </div>

      {/* Satellite AOD Block */}
      <div className="glass-panel rounded-[24px] p-4 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-500 font-bold">
          <Eye className="w-3.5 h-3.5 text-slate-700" />
          <span>Satellite</span>
        </div>
        <div className="font-display font-extrabold text-xl text-slate-900 mt-1">
          {liveData.aod}
        </div>
        <span className="text-[10px] text-slate-500 font-medium">MODIS Depth</span>
      </div>

    </div>
  );
}
