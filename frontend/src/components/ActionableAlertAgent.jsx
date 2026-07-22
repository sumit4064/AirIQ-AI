import React, { useState } from 'react';
import { AlertOctagon, CheckSquare, Shield, UserCheck, ChevronRight, Zap, Volume2 } from 'lucide-react';

export default function ActionableAlertAgent({ alertsData }) {
  if (!alertsData) return null;

  const [activeTab, setActiveTab] = useState('officials'); // 'officials' | 'citizens'
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const officialPlaybook = alertsData.official_playbook || [];
  const citizenPlaybook = alertsData.citizen_playbook || [];

  const currentPlaybook = activeTab === 'officials' ? officialPlaybook : citizenPlaybook;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 my-6">
      
      {/* Hazard Alert Banner */}
      <div
        className="p-4 rounded-xl mb-4 border flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
        style={{
          backgroundColor: `${alertsData.color || '#EF4444'}15`,
          borderColor: `${alertsData.color || '#EF4444'}50`
        }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: alertsData.color || '#EF4444' }}
          >
            <AlertOctagon className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded font-extrabold bg-slate-900/80 text-slate-100 border border-slate-700">
                {alertsData.alert_level || 'ALERT_ACTIVE'}
              </span>
              <span className="text-xs text-slate-300">Live Agent Alert Target: <strong>{alertsData.location}</strong></span>
            </div>
            <h3 className="font-display font-extrabold text-base text-slate-100 mt-0.5">
              {alertsData.alert_title} (Current AQI: {alertsData.current_aqi} | 24h Forecast: {alertsData.forecast_24h})
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Actionable Protocol Active</span>
          </span>
        </div>
      </div>

      {/* Target Selector Tabs (Officials vs Citizens) */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('officials')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'officials'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Municipal Officials & SPCBs</span>
          </button>

          <button
            onClick={() => setActiveTab('citizens')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'citizens'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Citizens & Vulnerable Groups</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden md:inline">
          Step-by-Step Playbook: What to Do & How to Do It
        </span>
      </div>

      {/* Action Steps Checklist */}
      <div className="space-y-3">
        {currentPlaybook.map((item) => {
          const stepKey = `${activeTab}-${item.step}`;
          const isDone = !!completedSteps[stepKey];

          return (
            <div
              key={item.step}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStep(stepKey)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 hover:border-cyan-400 text-transparent'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-extrabold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        STEP {item.step}
                      </span>
                      <h4 className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        WHAT TO DO: {item.what_to_do}
                      </h4>
                    </div>

                    <div className="mt-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                      <span className="text-amber-400 font-semibold flex items-center space-x-1 mb-0.5">
                        <ChevronRight className="w-3 h-3 text-amber-400 inline" />
                        <span>HOW TO DO IT:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {item.how_to_do_it}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 whitespace-nowrap">
                  {item.priority || item.target_group}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
