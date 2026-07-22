import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Radio, Thermometer, Car, Crosshair, Search, Sparkles, LocateFixed } from 'lucide-react';

// Safe LatLng Validator
const isValidCoord = (num) => typeof num === 'number' && !isNaN(num) && isFinite(num);

// Custom Marker Creators
const createAQIIcon = (aqi, label = "") => {
  let bgColor = '#10B981';
  if (aqi > 300) bgColor = '#7C3AED';
  else if (aqi > 200) bgColor = '#EF4444';
  else if (aqi > 150) bgColor = '#F97316';
  else if (aqi > 100) bgColor = '#F59E0B';

  const textLabel = label ? `<span style="font-size: 11px; font-weight: 900;">${label}:</span> ` : '';

  return L.divIcon({
    className: 'custom-aqi-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        font-weight: 900;
        font-size: 12px;
        padding: 5px 12px;
        border-radius: 9999px;
        border: 2.5px solid white;
        box-shadow: 0 4px 16px rgba(0,0,0,0.22);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        ${textLabel}<span>AQI ${aqi}</span>
      </div>
    `,
    iconSize: [95, 28],
    iconAnchor: [47, 14]
  });
};

const createGPSLocationIcon = (aqi) => {
  return L.divIcon({
    className: 'custom-user-gps-marker',
    html: `
      <div style="
        background-color: #0F172A;
        color: #BEF264;
        font-weight: 900;
        font-size: 12px;
        padding: 7px 14px;
        border-radius: 9999px;
        border: 3px solid #BEF264;
        box-shadow: 0 6px 22px rgba(15, 23, 42, 0.4);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
      ">
        <span style="font-size: 15px;">📍</span>
        <span>MY GPS POSITION (AQI ${aqi})</span>
      </div>
    `,
    iconSize: [195, 30],
    iconAnchor: [97, 15]
  });
};

const createTempIcon = (temp) => {
  return L.divIcon({
    className: 'custom-temp-marker',
    html: `
      <div style="
        background-color: #0284C7;
        color: white;
        font-weight: 900;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 10px;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.18);
        display: flex;
        align-items: center;
        gap: 3px;
        white-space: nowrap;
      ">
        <span>🌡️ ${temp}°C</span>
      </div>
    `,
    iconSize: [65, 24],
    iconAnchor: [32, 12]
  });
};

const createTrafficIcon = (status, speed) => {
  let color = '#10B981';
  if (status.includes('HEAVY') || status.includes('GRIDLOCK')) color = '#EF4444';
  else if (status.includes('MODERATE')) color = '#F59E0B';

  return L.divIcon({
    className: 'custom-traffic-marker',
    html: `
      <div style="
        background-color: #FFFFFF;
        color: #0F172A;
        font-weight: 900;
        font-size: 11px;
        padding: 4px 9px;
        border-radius: 10px;
        border: 2px solid ${color};
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span style="color: ${color};">🚦</span>
        <span>${speed} km/h</span>
      </div>
    `,
    iconSize: [72, 24],
    iconAnchor: [36, 12]
  });
};

const createSelectedTargetIcon = () => {
  return L.divIcon({
    className: 'custom-target-marker',
    html: `
      <div style="
        background-color: #EC4899;
        color: white;
        font-weight: 900;
        font-size: 11px;
        padding: 5px 10px;
        border-radius: 9999px;
        border: 2.5px solid white;
        box-shadow: 0 4px 16px rgba(236, 72, 153, 0.5);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>📍 Inspected Grid</span>
      </div>
    `,
    iconSize: [115, 26],
    iconAnchor: [57, 13]
  });
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(center) && isValidCoord(center[0]) && isValidCoord(center[1])) {
      try {
        map.setView(center, 12, { animate: false });
      } catch (err) {
        console.warn("Leaflet setView warning handled safely:", err);
      }
    }
  }, [center, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (e && e.latlng && isValidCoord(e.latlng.lat) && isValidCoord(e.latlng.lng)) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function MapView({ cityData = [], selectedCity = 'Delhi', onLocationSelect, onOpenChatWithArea, isCurrentLocationActive, userCoords }) {
  const [showAQI, setShowAQI] = useState(true);
  const [showTemp, setShowTemp] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showRadius, setShowRadius] = useState(true);

  const [clickedCoords, setClickedCoords] = useState(null);
  const [areaDetails, setAreaDetails] = useState(null);
  const [localSearch, setLocalSearch] = useState('');

  const isGPS = isCurrentLocationActive && userCoords && isValidCoord(userCoords.lat) && isValidCoord(userCoords.lon);

  const safeCityName = selectedCity || 'Delhi';

  const matchedCity = !isGPS && Array.isArray(cityData)
    ? cityData.find(c => c && c.name && (
        c.name.toLowerCase() === safeCityName.toLowerCase() || 
        safeCityName.toLowerCase().includes(c.name.toLowerCase())
      ))
    : null;

  const currentCity = isGPS
    ? { lat: userCoords.lat, lon: userCoords.lon, name: 'My Current Location', aqi: 175, temperature: 31.5 }
    : (matchedCity || (cityData && cityData[0]) || { lat: 28.6139, lon: 77.2090, name: 'Delhi', aqi: 220, temperature: 31.5 });

  const safeLat = isValidCoord(currentCity.lat) ? currentCity.lat : 28.6139;
  const safeLon = isValidCoord(currentCity.lon) ? currentCity.lon : 77.2090;
  const center = [safeLat, safeLon];
  const liveTemp = currentCity.temperature || 31.2;
  const liveAqi = currentCity.aqi || 185;

  const subAreaPresets = [
    { name: 'Central Hub', latOffset: 0, lonOffset: 0 },
    { name: 'Industrial Stack Belt', latOffset: 0.038, lonOffset: 0.042 },
    { name: 'Expressway Junction', latOffset: -0.042, lonOffset: -0.032 },
    { name: 'Green Suburb', latOffset: -0.025, lonOffset: 0.055 },
    { name: 'Transport Terminal', latOffset: 0.048, lonOffset: -0.045 }
  ];

  const fetchAreaTelemetry = (lat, lon, areaLabel = null) => {
    if (!isValidCoord(lat) || !isValidCoord(lon)) return;

    try {
      setClickedCoords({ lat, lon });
      const calculatedAqi = Math.max(20, Math.round(liveAqi + Math.abs(lat % 0.01) * 300));

      setAreaDetails({
        areaName: areaLabel || `Grid Area (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
        aqi: calculatedAqi,
        pm2_5: Math.round(calculatedAqi * 0.45 * 10) / 10,
        pm10: Math.round(calculatedAqi * 0.85 * 10) / 10,
        no2: Math.round(calculatedAqi * 0.25 * 10) / 10,
        temp: liveTemp,
        trafficStatus: calculatedAqi > 200 ? 'HEAVY CONGESTION' : 'MODERATE TRAFFIC',
        speed: calculatedAqi > 200 ? 19.5 : 34.0,
        delay: calculatedAqi > 200 ? 16 : 5
      });
    } catch (e) {
      console.error("Area telemetry error:", e);
    }
  };

  const handleMapClick = (lat, lon) => {
    fetchAreaTelemetry(lat, lon);
  };

  const handleLocalSearchSubmit = (e) => {
    e.preventDefault();
    if (!localSearch.trim()) return;

    try {
      fetch(`/api/search?q=${encodeURIComponent(localSearch)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.matched_location) {
            const loc = data.matched_location;
            if (isValidCoord(loc.lat) && isValidCoord(loc.lon)) {
              fetchAreaTelemetry(loc.lat, loc.lon, loc.capital || localSearch);
              setLocalSearch('');
            }
          }
        })
        .catch(err => console.error("Search error:", err));
    } catch (e) {
      console.error("Search exception:", e);
    }
  };

  const nearbySensors = [
    {
      id: 'north_10km',
      name: `North Sector`,
      lat: safeLat + 0.052,
      lon: safeLon + 0.021,
      distance: '6.2 km',
      aqi: Math.round(liveAqi * 1.08),
      pm2_5: Math.round(liveAqi * 0.48),
      temp: roundVal(liveTemp - 0.8),
      trafficStatus: 'HEAVY CONGESTION',
      speed: 18.5,
      delay: 14
    },
    {
      id: 'east_10km',
      name: `East Bypass`,
      lat: safeLat + 0.028,
      lon: safeLon + 0.065,
      distance: '7.8 km',
      aqi: Math.round(liveAqi * 1.15),
      pm2_5: Math.round(liveAqi * 0.52),
      temp: roundVal(liveTemp + 0.5),
      trafficStatus: 'MODERATE TRAFFIC',
      speed: 32.0,
      delay: 6
    },
    {
      id: 'south_10km',
      name: `South Suburb`,
      lat: safeLat - 0.045,
      lon: safeLon - 0.035,
      distance: '5.9 km',
      aqi: Math.round(liveAqi * 0.82),
      pm2_5: Math.round(liveAqi * 0.38),
      temp: roundVal(liveTemp - 1.2),
      trafficStatus: 'CLEAR / LOW TRAFFIC',
      speed: 48.0,
      delay: 2
    },
    {
      id: 'west_10km',
      name: `West Expressway`,
      lat: safeLat - 0.015,
      lon: safeLon - 0.058,
      distance: '8.4 km',
      aqi: Math.round(liveAqi * 0.95),
      pm2_5: Math.round(liveAqi * 0.42),
      temp: roundVal(liveTemp + 0.2),
      trafficStatus: 'HEAVY CONGESTION',
      speed: 21.0,
      delay: 11
    }
  ];

  function roundVal(v) {
    return Math.round(v * 10) / 10;
  }

  return (
    <div className="glass-panel rounded-[28px] p-4 sm:p-6 relative overflow-hidden flex flex-col border border-slate-200/80 bg-white shadow-sm space-y-4">
      
      {/* Map Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-[#BEF264] flex items-center justify-center text-slate-950 shadow-sm font-extrabold flex-shrink-0">
            <Radio className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-950 flex flex-wrap items-center gap-2">
              <span>Geospatial Sentinel Map:</span>
              <span className="text-sky-600 font-extrabold">{isGPS ? 'My GPS Location' : currentCity.name}</span>
              {isGPS && (
                <span className="bg-[#BEF264] text-slate-950 text-xs px-3 py-1 rounded-full font-extrabold flex items-center space-x-1 shadow-sm">
                  <LocateFixed className="w-3.5 h-3.5 text-slate-950" />
                  <span>GPS ACTIVE</span>
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-extrabold mt-0.5">
              Real-Time Interactive Air Quality & Weather Radar Map
            </p>
          </div>
        </div>

        {/* Map Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
          <button
            onClick={() => setShowAQI(!showAQI)}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
              showAQI ? 'bg-[#7DD3FC] text-slate-950 border-[#38BDF8] shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            🌫️ AQI Mesh
          </button>
          <button
            onClick={() => setShowTemp(!showTemp)}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
              showTemp ? 'bg-[#BEF264] text-slate-950 border-[#A3E635] shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            🌡️ Temp
          </button>
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
              showTraffic ? 'bg-[#FEF08A] text-slate-950 border-yellow-300 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            🚦 Traffic
          </button>
          <button
            onClick={() => setShowRadius(!showRadius)}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
              showRadius ? 'bg-slate-950 text-white border-slate-900 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            ⭕ 10km Radius
          </button>
        </div>
      </div>

      {/* Sub-Area Preset Chips & Micro-Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-100/90 p-3 rounded-2xl border border-slate-200 text-xs font-extrabold">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
          <span className="text-slate-800 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1 flex-shrink-0">
            <Crosshair className="w-4 h-4 text-slate-900" />
            <span>Localities:</span>
          </span>
          {subAreaPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => fetchAreaTelemetry(safeLat + preset.latOffset, safeLon + preset.lonOffset, `Locality — ${preset.name}`)}
              className="bg-white hover:bg-slate-200 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl border border-slate-300 flex-shrink-0 transition-all cursor-pointer shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Local Area Micro Search */}
        <form onSubmit={handleLocalSearchSubmit} className="flex items-center space-x-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 w-full sm:w-60 shadow-sm">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Inspect neighborhood..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-950 placeholder-slate-400 focus:outline-none w-full font-extrabold"
          />
          <button type="submit" className="bg-[#7DD3FC] hover:bg-[#38BDF8] text-slate-950 font-extrabold text-xs px-3 py-1 rounded-lg transition-all cursor-pointer flex-shrink-0">
            Inspect
          </button>
        </form>
      </div>

      {/* Interactive Map Canvas */}
      <div className="w-full h-[400px] sm:h-[480px] md:h-[520px] rounded-2xl overflow-hidden relative border border-slate-300 shadow-inner">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={center} />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* CARTO Voyager Light Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* 10 km Radius Proximity Buffer Circle */}
          {showRadius && (
            <Circle
              center={center}
              radius={10000}
              pathOptions={{
                color: isGPS ? '#10B981' : '#0284C7',
                weight: 2.5,
                dashArray: '6, 8',
                fillColor: isGPS ? '#10B981' : '#0284C7',
                fillOpacity: 0.08
              }}
            >
              <Popup>
                <div className="p-2 text-xs text-slate-950 font-extrabold space-y-1">
                  <div>⭕ <strong>10 km Proximity Sector Buffer</strong></div>
                  <div>Centered around {isGPS ? 'your detected GPS location' : currentCity.name}</div>
                </div>
              </Popup>
            </Circle>
          )}

          {/* User's GPS Location Marker OR Central City Marker */}
          {showAQI && (
            <Marker 
              position={center} 
              icon={isGPS ? createGPSLocationIcon(liveAqi) : createAQIIcon(liveAqi, currentCity.name)}
            >
              <Popup>
                <div className="p-2 space-y-1.5 text-xs font-extrabold text-slate-950">
                  <div className="font-extrabold text-sm text-slate-950">
                    {isGPS ? '📍 My Current GPS Location' : `${currentCity.name} Central Station`}
                  </div>
                  <div className="text-emerald-700 font-extrabold text-xs">Live AQI: {liveAqi}</div>
                  <div className="text-slate-900">PM2.5: {currentCity.pm2_5 || 85} µg/m³</div>
                  <div className="text-slate-900">Temperature: {liveTemp}°C</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Temperature Badge Marker */}
          {showTemp && (
            <Marker position={[safeLat + 0.012, safeLon - 0.015]} icon={createTempIcon(liveTemp)}>
              <Popup>
                <div className="p-2 space-y-1 text-xs text-slate-950 font-extrabold">
                  <div className="font-extrabold text-sky-700">🌡️ Weather Telemetry Station</div>
                  <div className="text-slate-950">Temperature: <strong>{liveTemp}°C</strong></div>
                  <div className="text-slate-800">Humidity: 65% RH</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Traffic Status Marker */}
          {showTraffic && (
            <Marker position={[safeLat - 0.014, safeLon + 0.018]} icon={createTrafficIcon("MODERATE TRAFFIC", 28.5)}>
              <Popup>
                <div className="p-2 space-y-1 text-xs text-slate-950 font-extrabold">
                  <div className="font-extrabold text-amber-700">🚦 Arterial Traffic Node</div>
                  <div className="text-slate-950 font-extrabold">Status: MODERATE TRAFFIC</div>
                  <div className="text-slate-800">Avg Speed: 28.5 km/h</div>
                  <div className="text-amber-700">Delay: +8 mins</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* User Clicked Target Grid Marker */}
          {clickedCoords && isValidCoord(clickedCoords.lat) && isValidCoord(clickedCoords.lon) && (
            <Marker position={[clickedCoords.lat, clickedCoords.lon]} icon={createSelectedTargetIcon()}>
              <Popup>
                <div className="p-2 space-y-1 text-xs font-extrabold text-slate-950">
                  <div className="font-extrabold text-pink-600">📍 Inspected Grid Location</div>
                  <div className="text-slate-950 font-mono text-xs">{clickedCoords.lat.toFixed(4)}°N, {clickedCoords.lon.toFixed(4)}°E</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Nearby 10km Micro-Sensors */}
          {nearbySensors.map((sensor) => (
            <React.Fragment key={sensor.id}>
              
              {showRadius && (
                <Polyline
                  positions={[center, [sensor.lat, sensor.lon]]}
                  pathOptions={{ color: isGPS ? '#10B981' : '#0284C7', weight: 1.5, dashArray: '4, 4', opacity: 0.5 }}
                />
              )}

              {showAQI && (
                <Marker position={[sensor.lat, sensor.lon]} icon={createAQIIcon(sensor.aqi, sensor.name.split(' ').pop())}>
                  <Popup>
                    <div className="p-2 space-y-1 text-xs font-extrabold text-slate-950">
                      <div className="font-extrabold text-slate-950">{sensor.name}</div>
                      <div className="text-slate-600 font-mono text-xs">Proximity: {sensor.distance}</div>
                      <div className="text-emerald-700 font-extrabold">AQI: {sensor.aqi}</div>
                      <div className="text-slate-900">PM2.5: {sensor.pm2_5} µg/m³</div>
                    </div>
                  </Popup>
                </Marker>
              )}

            </React.Fragment>
          ))}

        </MapContainer>
      </div>

      {/* Hyper-Local Clicked Area Telemetry Inspector Card */}
      {clickedCoords && areaDetails && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 animate-fade-in relative shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                <h3 className="font-display font-extrabold text-slate-950 text-base">
                  {areaDetails.areaName}
                </h3>
                <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-[#D9F99D] text-slate-950 border border-[#A3E635] shadow-sm">
                  AQI {areaDetails.aqi}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 flex flex-wrap items-center gap-4 font-extrabold">
                <span>🧪 PM2.5: <strong className="text-slate-950 font-mono font-extrabold">{areaDetails.pm2_5} µg/m³</strong></span>
                <span>🌫️ PM10: <strong className="text-slate-950 font-mono font-extrabold">{areaDetails.pm10} µg/m³</strong></span>
                <span>🚗 Traffic: <strong className="text-amber-700 font-extrabold">{areaDetails.trafficStatus} ({areaDetails.speed} km/h)</strong></span>
                <span>🌡️ Temp: <strong className="text-sky-700 font-mono font-extrabold">{areaDetails.temp}°C</strong></span>
              </div>
            </div>

            {/* Action Button */}
            {onOpenChatWithArea && (
              <button
                onClick={() => onOpenChatWithArea(`What is the live AQI, PM2.5 and traffic in ${areaDetails.areaName}?`)}
                className="bg-[#7DD3FC] hover:bg-[#38BDF8] text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-sm hover:scale-105 transition-all cursor-pointer flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Ask ChatGPT About This Area</span>
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
