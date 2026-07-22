import React, { useState } from 'react';
import { ShieldAlert, Globe, Search, MapPin, Bot, Car, ChevronDown, X, Check, Map, LocateFixed, User, Sparkles, Navigation, Flame, Compass } from 'lucide-react';

const getCapitalName = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (item.capital && typeof item.capital === 'string') {
    return item.capital.split(" / ")[0];
  }
  return item.state || '';
};

export default function Header({ 
  selectedCity, 
  setSelectedCity, 
  states = [], 
  onSearchSubmit, 
  onOpenChat,
  isCurrentLocationActive,
  onUseCurrentLocation 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('Overview');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  const safeSelectedCity = selectedCity || 'Delhi';

  const quickCities = ['Delhi', 'Mumbai', 'Bengaluru', 'Jaipur', 'Kolkata', 'Chennai', 'Hyderabad'];

  const getAQIBadgeStyle = (aqi = 150) => {
    if (aqi > 300) return { bg: 'bg-purple-100 text-purple-900 border-purple-300', label: 'Severe' };
    if (aqi > 200) return { bg: 'bg-rose-100 text-rose-900 border-rose-300', label: 'Poor' };
    if (aqi > 150) return { bg: 'bg-orange-100 text-orange-900 border-orange-300', label: 'Unhealthy' };
    if (aqi > 100) return { bg: 'bg-amber-100 text-amber-900 border-amber-300', label: 'Moderate' };
    return { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', label: 'Good' };
  };

  const filteredStates = (states || []).filter(s => {
    if (!s) return false;
    const stateName = s.state || '';
    const capName = getCapitalName(s);

    const textMatch = stateName.toLowerCase().includes(modalFilter.toLowerCase()) || 
                      capName.toLowerCase().includes(modalFilter.toLowerCase());
    if (!textMatch) return false;

    if (categoryFilter === 'METROS') {
      return ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Jaipur'].some(m => capName.includes(m) || stateName.includes(m));
    }
    if (categoryFilter === 'UT') {
      return ['Andaman', 'Chandigarh', 'Daman', 'Delhi', 'Jammu', 'Ladakh', 'Lakshadweep', 'Puducherry'].some(ut => stateName.includes(ut));
    }
    if (categoryFilter === 'STATES') {
      return !['Andaman', 'Chandigarh', 'Daman', 'Delhi', 'Jammu', 'Ladakh', 'Lakshadweep', 'Puducherry'].some(ut => stateName.includes(ut));
    }
    return true;
  });

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 mb-4 sm:mb-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-[28px] p-3.5 sm:p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand & Nav Tabs */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-lime-400" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-950 flex items-center space-x-2">
                <span>AirIQ</span>
                <span className="bg-[#BEF264] text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                  V3.0 AI
                </span>
              </h1>
              <p className="text-xs text-slate-600 font-extrabold">Urban AQI & Telemetry Platform</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop / Tablet) */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl text-xs font-extrabold text-slate-700 ml-4">
            {['Overview', 'Reports', 'Live Stream'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-white text-slate-950 shadow-sm font-extrabold' 
                    : 'hover:text-slate-950'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Enhanced Location UI Selector & Search Bar */}
        <div className="flex flex-wrap items-center space-x-2 w-full lg:w-auto">
          
          {/* GPS Quick Location Button */}
          <button
            onClick={onUseCurrentLocation}
            title="Detect My GPS Location"
            className={`p-2.5 sm:p-3 rounded-2xl border flex items-center space-x-1.5 transition-all cursor-pointer ${
              isCurrentLocationActive
                ? 'bg-[#BEF264] text-slate-950 border-[#A3E635] font-extrabold shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 font-extrabold'
            }`}
          >
            <LocateFixed className="w-4 h-4 text-slate-950 flex-shrink-0" />
            <span className="hidden sm:inline text-xs font-extrabold">GPS</span>
          </button>

          {/* Redesigned Location Hub Trigger Pill Button */}
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-2xl border border-slate-200/90 flex items-center space-x-2.5 transition-all cursor-pointer flex-1 sm:flex-initial shadow-sm hover:scale-[1.02]"
          >
            <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Active Location</div>
              <div className="text-xs font-extrabold text-slate-950 max-w-[130px] sm:max-w-[150px] truncate">
                {safeSelectedCity}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 ml-1" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-2xl px-3 py-2 w-full sm:w-52 mt-2 sm:mt-0 shadow-sm">
            <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search city or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-950 placeholder-slate-400 focus:outline-none w-full font-extrabold"
            />
          </form>
        </div>

        {/* Right: ChatGPT Action Button & Profile Block */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-extrabold">
          
          <button
            onClick={onOpenChat}
            className="bg-[#7DD3FC] hover:bg-[#38BDF8] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-sm transition-all cursor-pointer hover:scale-105"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>ChatGPT RAG</span>
          </button>

          {/* User Profile Block */}
          <div className="flex items-center space-x-2.5 bg-gradient-to-r from-[#BEF264] to-[#D9F99D] text-slate-950 px-3.5 py-2 rounded-2xl border border-[#A3E635]/50 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center font-extrabold text-xs">
              AI
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xs text-slate-950 leading-tight">AirIQ System</div>
              <div className="text-xs text-slate-800 font-extrabold">Super Admin</div>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Floating Bottom Quick Dock */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[9980] bg-slate-950/90 backdrop-blur-md text-white p-2.5 rounded-full border border-slate-800 shadow-2xl flex items-center justify-around font-extrabold">
        <button
          onClick={onUseCurrentLocation}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold transition-all ${
            isCurrentLocationActive ? 'bg-[#BEF264] text-slate-950' : 'text-slate-200'
          }`}
        >
          <LocateFixed className="w-4 h-4" />
          <span>GPS</span>
        </button>

        <button
          onClick={() => setIsCityModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-extrabold text-slate-200"
        >
          <MapPin className="w-4 h-4 text-sky-400" />
          <span className="max-w-[95px] truncate">{safeSelectedCity}</span>
        </button>

        <button
          onClick={onOpenChat}
          className="flex items-center space-x-1.5 bg-[#7DD3FC] text-slate-950 px-4 py-2 rounded-full text-xs font-extrabold shadow-md"
        >
          <Bot className="w-4 h-4 text-slate-950" />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Ultra-Premium Light Bento Location Explorer Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">

          <div className="bg-white border border-slate-200 rounded-3xl sm:rounded-[32px] w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header Hero Card */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#BEF264] text-slate-950 flex items-center justify-center font-extrabold shadow-md flex-shrink-0">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-white text-lg sm:text-xl flex items-center space-x-2">
                    <span>Geospatial Location Explorer</span>
                    <span className="bg-sky-400 text-slate-950 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                      36 States & UTs
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 font-extrabold mt-0.5">
                    Select any regional capital, metropolitan hub, or auto-detect your live GPS coordinates
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCityModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 self-end sm:self-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Bento Action Row: GPS Auto-Detect Hero + Instant Search */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* GPS Auto-Detect Button */}
              <button
                onClick={() => {
                  onUseCurrentLocation();
                  setIsCityModalOpen(false);
                }}
                className="w-full md:w-auto bg-[#BEF264] hover:bg-[#A3E635] text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] flex-shrink-0"
              >
                <LocateFixed className="w-5 h-5 text-slate-950 animate-pulse" />
                <span>📍 Auto-Detect & Use My Current GPS Location</span>
              </button>

              {/* Instant Search Filter */}
              <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-2xl px-4 py-2.5 w-full md:w-80 shadow-sm">
                <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Filter state, capital, or region..."
                  value={modalFilter}
                  onChange={(e) => setModalFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-950 placeholder-slate-400 focus:outline-none w-full font-extrabold"
                />
                {modalFilter && (
                  <button onClick={() => setModalFilter('')} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Popular Metros Bar */}
            <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs font-extrabold">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] flex-shrink-0 font-extrabold flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Quick Metros:</span>
              </span>
              {quickCities.map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => {
                    setSelectedCity(cityName);
                    setIsCityModalOpen(false);
                  }}
                  className={`px-3 py-1 rounded-xl border flex-shrink-0 transition-all cursor-pointer font-extrabold ${
                    safeSelectedCity.toLowerCase() === cityName.toLowerCase()
                      ? 'bg-[#7DD3FC] text-slate-950 border-[#38BDF8] shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  📍 {cityName}
                </button>
              ))}
            </div>

            {/* Category Tab Filters */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-2xl text-xs font-extrabold">
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${categoryFilter === 'ALL' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700'}`}
                >
                  ✨ All ({(states || []).length})
                </button>
                <button
                  onClick={() => setCategoryFilter('METROS')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${categoryFilter === 'METROS' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700'}`}
                >
                  🏙️ Metros
                </button>
                <button
                  onClick={() => setCategoryFilter('STATES')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${categoryFilter === 'STATES' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700'}`}
                >
                  🏛️ States (28)
                </button>
                <button
                  onClick={() => setCategoryFilter('UT')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${categoryFilter === 'UT' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700'}`}
                >
                  🏝️ UTs (8)
                </button>
              </div>

              <span className="text-xs text-slate-500 font-extrabold hidden sm:inline">
                Showing {filteredStates.length} Locations
              </span>
            </div>

            {/* High-Impact Location Bento Cards Grid */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-slate-50/50">
              {filteredStates.map((item) => {
                const capName = getCapitalName(item);
                const stateName = item.state || capName;
                const isSelected = !isCurrentLocationActive && (safeSelectedCity.toLowerCase() === capName.toLowerCase() || safeSelectedCity.toLowerCase() === stateName.toLowerCase());
                
                const aqiVal = item.aqi || item.baseline_aqi || 140;
                const badgeStyle = getAQIBadgeStyle(aqiVal);

                return (
                  <button
                    key={stateName}
                    onClick={() => {
                      setSelectedCity(capName || stateName);
                      setIsCityModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group hover:scale-[1.02] shadow-sm ${
                      isSelected
                        ? 'bg-white border-[#38BDF8] ring-2 ring-[#38BDF8]/60 text-slate-950 font-extrabold shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-sm text-slate-950 flex items-center space-x-1.5">
                        <span>{capName}</span>
                        {isSelected && <Check className="w-4 h-4 text-sky-600 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-slate-600 font-extrabold">
                        {stateName}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-extrabold border ${badgeStyle.bg}`}>
                        AQI {aqiVal} • {badgeStyle.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-extrabold">
                        🌡️ {item.temperature || 31}°C
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
