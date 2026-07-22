import React, { useState, useEffect } from 'react';
import { Car, Navigation, Gauge, AlertTriangle, RefreshCw, Clock, Activity } from 'lucide-react';

export default function TrafficPanel({ selectedCity, lat = 28.6139, lon = 77.2090 }) {
  const [hour, setHour] = useState(new Date().getHours());
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState('');

  const fetchTraffic = (targetHour) => {
    setLoading(true);
    fetch(`/api/traffic/predict?lat=${lat}&lon=${lon}&hour=${targetHour}`)
      .then(res => res.json())
      .then(data => {
        setTrafficData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Traffic fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTraffic(hour);
  }, [selectedCity, lat, lon, hour]);

  const handleRetrain = () => {
    setRetraining(true);
    setRetrainMsg('');
    fetch('/api/traffic/retrain', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setRetraining(false);
        setRetrainMsg('✅ Traffic XGBoost Model Retrained Successfully!');
        fetchTraffic(hour);
        setTimeout(() => setRetrainMsg(''), 4000);
      })
      .catch(err => {
        setRetraining(false);
        setRetrainMsg('❌ Retraining error.');
      });
  };

  const getStatusBadgeClass = (code) => {
    switch (code) {
      case 0: return 'bg-[#D9F99D] text-slate-900 border-[#A3E635]';
      case 1: return 'bg-[#FEF08A] text-slate-900 border-yellow-300';
      case 2: return 'bg-orange-200 text-slate-900 border-orange-300';
      case 3: return 'bg-rose-200 text-slate-900 border-rose-300';
      default: return 'bg-slate-100 text-slate-900 border-slate-200';
    }
  };

  return (
    <div className="glass-panel rounded-[28px] p-6 border border-slate-200/80 bg-white shadow-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BEF264] flex items-center justify-center text-slate-900 shadow-sm font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-lg text-slate-900">
                Urban Traffic & Fleet Emissions Predictor
              </h2>
              <span className="bg-[#BEF264] text-slate-900 text-xs px-3 py-0.5 rounded-full font-extrabold border border-[#A3E635]">
                XGBoost Traffic ML
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Live location congestion index, speed estimation & vehicular PM2.5 surge analysis
            </p>
          </div>
        </div>

        {/* Retrain Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRetrain}
            disabled={retraining}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-extrabold px-4 py-2.5 rounded-2xl text-slate-900 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-700 ${retraining ? 'animate-spin' : ''}`} />
            <span>{retraining ? 'Retraining...' : 'Retrain Traffic Model'}</span>
          </button>
        </div>
      </div>

      {retrainMsg && (
        <div className="mb-4 text-xs font-bold px-4 py-2.5 rounded-2xl bg-[#D9F99D] border border-[#A3E635] text-slate-900 animate-fade-in shadow-sm">
          {retrainMsg}
        </div>
      )}

      {/* Hourly Timeline Slider */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-slate-700" />
            <span>Select Forecast Hour: <strong className="text-slate-900 font-mono">{hour.toString().padStart(2, '0')}:00 IST</strong></span>
            {hour === new Date().getHours() && (
              <span className="bg-[#7DD3FC] text-slate-900 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
                LIVE NOW
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">00:00 to 23:00</span>
        </div>
        <input
          type="range"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => setHour(parseInt(e.target.value))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-bold">
          <span>12 AM</span>
          <span>08 AM (Peak)</span>
          <span>12 PM</span>
          <span>06 PM (Peak)</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Traffic Data Grid Bento Blocks */}
      {loading ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs text-slate-500 font-medium">Computing Traffic Congestion ML Model...</p>
        </div>
      ) : trafficData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Status Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-bold">
              <span>Traffic Condition</span>
              <Gauge className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-xl border text-xs font-extrabold font-display ${getStatusBadgeClass(trafficData.traffic_code)}`}>
                {trafficData.traffic_status}
              </span>
              <div className="text-[11px] text-slate-600 mt-2 font-medium">
                {trafficData.is_peak_hour ? '⚠️ Peak Commute Hour Active' : '✅ Non-Peak Traffic Flow'}
              </div>
            </div>
          </div>

          {/* Congestion Index Card (Pastel Lime Block) */}
          <div className="bg-[#BEF264] border border-[#A3E635] rounded-2xl p-4 flex flex-col justify-between text-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-800 text-xs mb-2 font-extrabold">
              <span>Congestion Index</span>
              <Activity className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <div className="text-3xl font-extrabold font-display text-slate-900">
                {trafficData.congestion_index_pct}%
              </div>
              <div className="w-full bg-slate-900/10 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-500"
                  style={{ width: `${trafficData.congestion_index_pct}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Speed & Delay Card (Pastel Blue Block) */}
          <div className="bg-[#7DD3FC] border border-[#38BDF8] rounded-2xl p-4 flex flex-col justify-between text-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-800 text-xs mb-2 font-extrabold">
              <span>Avg Speed & Delay</span>
              <Navigation className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 flex items-baseline space-x-1">
                <span>{trafficData.estimated_speed_kmh}</span>
                <span className="text-xs text-slate-800 font-bold">km/h</span>
              </div>
              <div className="text-xs text-slate-900 font-extrabold mt-1">
                +{trafficData.estimated_delay_mins} mins commute delay
              </div>
            </div>
          </div>

          {/* Vehicular PM2.5 Impact */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-bold">
              <span>Vehicular PM2.5 Surge</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-rose-600">
                +{trafficData.pm25_impact_ugm3} µg/m³
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                From stop-and-go fleet idling
              </div>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
