import React, { useState } from 'react';
import { Leaf, ShieldCheck, Factory, Car, Wind, AlertTriangle, Lightbulb, Users, CheckCircle2, ChevronRight, Sparkles, Building2 } from 'lucide-react';

export default function AQIReductionPanel({ selectedCity, liveAQI = 185 }) {
  const [activeTab, setActiveTab] = useState('ALL');

  const getAQILevelInfo = (aqi) => {
    if (aqi > 300) return { category: 'Severe', color: 'bg-purple-100 text-purple-900 border-purple-300', icon: AlertTriangle };
    if (aqi > 200) return { category: 'Very Poor', color: 'bg-rose-100 text-rose-900 border-rose-300', icon: AlertTriangle };
    if (aqi > 150) return { category: 'Poor', color: 'bg-orange-100 text-orange-900 border-orange-300', icon: Wind };
    if (aqi > 100) return { category: 'Moderate', color: 'bg-amber-100 text-amber-900 border-amber-300', icon: Lightbulb };
    return { category: 'Good', color: 'bg-[#D9F99D] text-slate-900 border-[#A3E635]', icon: ShieldCheck };
  };

  const levelInfo = getAQILevelInfo(liveAQI);

  const individualActions = [
    {
      title: "Use Air-Purifying Indoor Plants",
      desc: "Place Snake Plants, Areca Palms, and Peace Lilies indoors to naturally filter VOCs, Benzene, and Formaldehyde.",
      icon: Leaf,
      tag: "Household",
      color: "bg-[#D9F99D] text-slate-900"
    },
    {
      title: "Adopt Carpooling & Electric Mobility",
      desc: "Reduce vehicular PM2.5 emissions by carpooling, using metro transport, or switching to electric vehicles for daily commute.",
      icon: Car,
      tag: "Transport",
      color: "bg-[#7DD3FC] text-slate-900"
    },
    {
      title: "Install HEPA H13 Air Purifiers",
      desc: "Run HEPA H13 air purifiers in living areas during peak pollution hours (06:00 - 10:00 & 18:00 - 22:00) to trap 99.97% of PM2.5 particles.",
      icon: Wind,
      tag: "Health",
      color: "bg-[#FEF08A] text-slate-900"
    },
    {
      title: "Zero Waste Burning Compliance",
      desc: "Avoid burning dry leaves, garbage, or plastics. Report open fires immediately to municipal authorities via emergency hotlines.",
      icon: ShieldCheck,
      tag: "Community",
      color: "bg-emerald-100 text-slate-900"
    }
  ];

  const municipalActions = [
    {
      title: "Anti-Smog Guns & Water Sprinkling",
      desc: "Deploy mobile anti-smog water cannons along high-traffic corridors and unpaved roads to suppress floating dust.",
      icon: Building2,
      tag: "Municipal",
      color: "bg-[#7DD3FC] text-slate-900"
    },
    {
      title: "Enforce GRAP Emission Bans",
      desc: "Strictly enforce CPCB GRAP Stage II/III rules: ban diesel generators, halt non-essential construction, and cap factory emissions.",
      icon: Factory,
      tag: "Regulation",
      color: "bg-[#BEF264] text-slate-900"
    },
    {
      title: "Mechanized Road Vacuum Sweeping",
      desc: "Operate heavy-duty mechanical vacuum road sweepers during night hours to eliminate PM10 dust re-suspension.",
      icon: Wind,
      tag: "Infrastructure",
      color: "bg-orange-100 text-slate-900"
    },
    {
      title: "Stubble Management & Agro Bio-Decomposers",
      desc: "Provide farmers with Pusa Bio-Decomposers and Happy Seeder machines to clear crop residue without open field burning.",
      icon: Leaf,
      tag: "Agriculture",
      color: "bg-[#FEF08A] text-slate-900"
    }
  ];

  const allActions = [...individualActions, ...municipalActions];

  const displayedActions = activeTab === 'INDIVIDUAL' 
    ? individualActions 
    : activeTab === 'MUNICIPAL' 
      ? municipalActions 
      : allActions;

  return (
    <div className="glass-panel rounded-[28px] p-5 sm:p-6 border border-slate-200/80 bg-white shadow-sm my-6 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-[#BEF264] flex items-center justify-center text-slate-900 shadow-sm font-bold flex-shrink-0">
            <Leaf className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Actionable AQI Reduction Protocols & Advisory
              </h2>
              <span className="bg-[#BEF264] text-slate-900 text-xs px-3 py-0.5 rounded-full font-extrabold border border-[#A3E635]">
                AI Air Protocol
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Science-backed solutions for citizens, industries & local government to cut urban air pollution in <strong className="text-slate-900 font-bold">{selectedCity}</strong>
            </p>
          </div>
        </div>

        {/* Live AQI Level Indicator */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center space-x-2 font-extrabold text-xs shadow-sm ${levelInfo.color}`}>
          <levelInfo.icon className="w-4 h-4" />
          <span>Live AQI {liveAQI}: {levelInfo.category} Advisory Active</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold text-slate-700 w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'hover:text-slate-900'}`}
        >
          All Solutions ({allActions.length})
        </button>
        <button
          onClick={() => setActiveTab('INDIVIDUAL')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'INDIVIDUAL' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'hover:text-slate-900'}`}
        >
          Citizens & Homes ({individualActions.length})
        </button>
        <button
          onClick={() => setActiveTab('MUNICIPAL')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'MUNICIPAL' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'hover:text-slate-900'}`}
        >
          City & Government ({municipalActions.length})
        </button>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedActions.map((action, idx) => {
          const IconComp = action.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
                    <IconComp className="w-5 h-5 text-slate-900" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${action.color}`}>
                    {action.tag}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center space-x-1 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>High Impact</span>
                </span>
                <span className="text-slate-400 group-hover:text-slate-900 transition-colors">Recommended &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
