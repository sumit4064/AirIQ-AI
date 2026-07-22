import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Send, CheckCircle2, MapPin, FileText } from 'lucide-react';

export default function EnforcementPanel({ enforcementData }) {
  if (!enforcementData) return null;

  const initialTickets = enforcementData.tickets || [];
  const [tickets, setTickets] = useState(initialTickets);
  const [dispatchedCount, setDispatchedCount] = useState(0);

  const handleDispatch = (ticketId) => {
    setTickets(prev =>
      prev.map(t => t.ticket_id === ticketId ? { ...t, status: 'DISPATCHED_TO_FIELD_PATROL' } : t)
    );
    setDispatchedCount(c => c + 1);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Enforcement Intelligence & Prioritisation Agent
            </h3>
            <p className="text-xs text-slate-400">
              Correlates hotspot data with CPCB registered stacks, construction permits & satellite anomalies.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-mono font-medium">
            Est. Reduction: {enforcementData.estimated_aqi_reduction || '18-35 AQI Points'}
          </span>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tickets.map((t) => (
          <div
            key={t.ticket_id}
            className={`p-3.5 rounded-xl border transition-all ${
              t.status === 'DISPATCHED_TO_FIELD_PATROL'
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : t.priority === 'HIGH_PRIORITY_DISPATCH'
                ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-cyan-400">{t.ticket_id}</span>
                <h4 className="font-bold text-sm text-slate-200 mt-0.5">{t.target_type}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                t.priority === 'HIGH_PRIORITY_DISPATCH'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                Impact: {t.impact_score}%
              </span>
            </div>

            <div className="flex items-center space-x-1 text-xs text-slate-400 mt-2">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="truncate">{t.location}</span>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="text-amber-400 font-semibold">Evidence: </span>
              {t.evidence}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 italic">
                {t.timestamp}
              </span>
              {t.status === 'DISPATCHED_TO_FIELD_PATROL' ? (
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Squad Dispatched</span>
                </span>
              ) : (
                <button
                  onClick={() => handleDispatch(t.ticket_id)}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Dispatch Inspector</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
