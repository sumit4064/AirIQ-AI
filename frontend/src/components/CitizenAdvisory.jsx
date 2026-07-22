import React, { useState } from 'react';
import { Volume2, Languages, Users, HeartPulse, GraduationCap, Building } from 'lucide-react';

export default function CitizenAdvisory({ advisoryData }) {
  if (!advisoryData) return null;

  const [selectedLang, setSelectedLang] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);

  const translations = advisoryData.advisories_by_language || {};
  const currentAdvisory = translations[selectedLang] || translations['en'];
  const mapping = advisoryData.vulnerable_mapping || { schools_affected: 14, hospitals_alerted: 6, outdoor_workforce_est: 12500, elderly_population_est: 48000 };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const textToSpeak = `${currentAdvisory.headline}. ${currentAdvisory.general_advisory} ${currentAdvisory.vulnerable_actions}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Map BCP-47 language tags for Web Speech API
    const langTags = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      te: 'te-IN'
    };

    utterance.lang = langTags[selectedLang] || 'en-IN';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Citizen Health Risk Advisory System
            </h3>
            <p className="text-xs text-slate-400">
              Ward-level vulnerability mapping & multi-lingual regional advisories.
            </p>
          </div>
        </div>

        {/* Multi-Language Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap">
          <Languages className="w-4 h-4 text-cyan-400 ml-1.5 hidden sm:inline" />
          {Object.keys(translations).map((langKey) => (
            <button
              key={langKey}
              onClick={() => setSelectedLang(langKey)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                selectedLang === langKey
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {langKey}
            </button>
          ))}
        </div>
      </div>

      {/* Vulnerable Population Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Schools Affected</span>
          </div>
          <div className="font-mono font-extrabold text-lg text-amber-300 mt-1">
            {mapping.schools_affected}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Building className="w-3.5 h-3.5 text-rose-400" />
            <span>Hospitals Alerted</span>
          </div>
          <div className="font-mono font-extrabold text-lg text-rose-300 mt-1">
            {mapping.hospitals_alerted}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Outdoor Workforce</span>
          </div>
          <div className="font-mono font-extrabold text-lg text-cyan-300 mt-1">
            {mapping.outdoor_workforce_est.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <HeartPulse className="w-3.5 h-3.5 text-purple-400" />
            <span>Elderly Vulnerable</span>
          </div>
          <div className="font-mono font-extrabold text-lg text-purple-300 mt-1">
            {mapping.elderly_population_est.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Localized Language Advisory Box */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-cyan-400 font-mono">
            {currentAdvisory.lang_name} Audio Broadcast Advisory
          </span>
          <button
            onClick={handleSpeak}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold text-xs transition-all ${
              isPlaying
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'Stop Audio' : 'Listen Regional Voice'}</span>
          </button>
        </div>

        <h4 className="font-display font-bold text-sm text-slate-100 mb-1">
          {currentAdvisory.headline}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-2">
          {currentAdvisory.general_advisory}
        </p>
        <p className="text-xs text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
          <strong>Action Advisory: </strong>{currentAdvisory.vulnerable_actions}
        </p>
      </div>

    </div>
  );
}
