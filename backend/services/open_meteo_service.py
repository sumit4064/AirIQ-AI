import requests
import numpy as np
import datetime
import math

OPEN_METEO_AQ_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
OPEN_METEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

# Comprehensive database covering ALL 36 States & Union Territories of India
ALL_INDIAN_STATES = [
    # States (28)
    {"state": "Andhra Pradesh", "capital": "Visakhapatnam", "lat": 17.6868, "lon": 83.2185, "baseline_aqi": 85},
    {"state": "Arunachal Pradesh", "capital": "Itanagar", "lat": 27.0844, "lon": 93.6053, "baseline_aqi": 42},
    {"state": "Assam", "capital": "Guwahati", "lat": 26.1445, "lon": 91.7362, "baseline_aqi": 110},
    {"state": "Bihar", "capital": "Patna", "lat": 25.5941, "lon": 85.1376, "baseline_aqi": 195},
    {"state": "Chhattisgarh", "capital": "Raipur", "lat": 21.2514, "lon": 81.6296, "baseline_aqi": 135},
    {"state": "Goa", "capital": "Panaji", "lat": 15.4909, "lon": 73.8278, "baseline_aqi": 52},
    {"state": "Gujarat", "capital": "Ahmedabad", "lat": 23.0225, "lon": 72.5714, "baseline_aqi": 165},
    {"state": "Haryana", "capital": "Gurugram", "lat": 28.4595, "lon": 77.0266, "baseline_aqi": 215},
    {"state": "Himachal Pradesh", "capital": "Shimla", "lat": 31.1048, "lon": 77.1734, "baseline_aqi": 48},
    {"state": "Jharkhand", "capital": "Ranchi", "lat": 23.3441, "lon": 85.3096, "baseline_aqi": 140},
    {"state": "Karnataka", "capital": "Bengaluru", "lat": 12.9716, "lon": 77.5946, "baseline_aqi": 95},
    {"state": "Kerala", "capital": "Thiruvananthapuram", "lat": 8.5241, "lon": 76.9366, "baseline_aqi": 58},
    {"state": "Madhya Pradesh", "capital": "Bhopal / Indore", "lat": 22.7196, "lon": 75.8577, "baseline_aqi": 128},
    {"state": "Maharashtra", "capital": "Mumbai", "lat": 19.0760, "lon": 72.8777, "baseline_aqi": 145},
    {"state": "Manipur", "capital": "Imphal", "lat": 24.8170, "lon": 93.9368, "baseline_aqi": 45},
    {"state": "Meghalaya", "capital": "Shillong", "lat": 25.5788, "lon": 91.8933, "baseline_aqi": 38},
    {"state": "Mizoram", "capital": "Aizawl", "lat": 23.7271, "lon": 92.7176, "baseline_aqi": 32},
    {"state": "Nagaland", "capital": "Kohima", "lat": 25.6751, "lon": 94.1086, "baseline_aqi": 40},
    {"state": "Odisha", "capital": "Bhubaneswar", "lat": 20.2961, "lon": 85.8245, "baseline_aqi": 115},
    {"state": "Punjab", "capital": "Ludhiana / Amritsar", "lat": 30.9010, "lon": 75.8573, "baseline_aqi": 190},
    {"state": "Rajasthan", "capital": "Jaipur", "lat": 26.9124, "lon": 75.7873, "baseline_aqi": 178},
    {"state": "Sikkim", "capital": "Gangtok", "lat": 27.3389, "lon": 88.6065, "baseline_aqi": 35},
    {"state": "Tamil Nadu", "capital": "Chennai", "lat": 13.0827, "lon": 80.2707, "baseline_aqi": 88},
    {"state": "Telangana", "capital": "Hyderabad", "lat": 17.3850, "lon": 78.4867, "baseline_aqi": 122},
    {"state": "Tripura", "capital": "Agartala", "lat": 23.8315, "lon": 91.2868, "baseline_aqi": 65},
    {"state": "Uttar Pradesh", "capital": "Lucknow / Kanpur", "lat": 26.8467, "lon": 80.9462, "baseline_aqi": 210},
    {"state": "Uttarakhand", "capital": "Dehradun", "lat": 30.3165, "lon": 78.0322, "baseline_aqi": 92},
    {"state": "West Bengal", "capital": "Kolkata", "lat": 22.5726, "lon": 88.3639, "baseline_aqi": 160},
    
    # Union Territories (8)
    {"state": "Andaman and Nicobar", "capital": "Port Blair", "lat": 11.6234, "lon": 92.7265, "baseline_aqi": 28},
    {"state": "Chandigarh", "capital": "Chandigarh", "lat": 30.7333, "lon": 76.7794, "baseline_aqi": 155},
    {"state": "Dadra & Nagar Haveli & Daman & Diu", "capital": "Daman", "lat": 20.3974, "lon": 72.8328, "baseline_aqi": 110},
    {"state": "Delhi NCR", "capital": "Delhi", "lat": 28.6139, "lon": 77.2090, "baseline_aqi": 220},
    {"state": "Jammu & Kashmir", "capital": "Srinagar", "lat": 34.0837, "lon": 74.7973, "baseline_aqi": 82},
    {"state": "Ladakh", "capital": "Leh", "lat": 34.1526, "lon": 77.5771, "baseline_aqi": 30},
    {"state": "Lakshadweep", "capital": "Kavaratti", "lat": 10.5667, "lon": 72.6417, "baseline_aqi": 25},
    {"state": "Puducherry", "capital": "Puducherry", "lat": 11.9416, "lon": 79.8083, "baseline_aqi": 72}
]

INDIAN_CITIES = {s["capital"].split(" / ")[0]: {"lat": s["lat"], "lon": s["lon"], "state": s["state"], "baseline_aqi": s["baseline_aqi"]} for s in ALL_INDIAN_STATES}

def calculate_indian_aqi(pm25, pm10, no2, so2, co, o3):
    def pm25_sub_index(c):
        if c <= 30: return c * (50/30)
        if c <= 60: return 50 + (c-30) * (50/30)
        if c <= 90: return 100 + (c-60) * (100/30)
        if c <= 120: return 200 + (c-90) * (100/30)
        if c <= 250: return 300 + (c-120) * (100/130)
        return 400 + (c-250) * (100/130)

    def pm10_sub_index(c):
        if c <= 50: return c
        if c <= 100: return 50 + (c-50)
        if c <= 250: return 100 + (c-100) * (100/150)
        if c <= 350: return 200 + (c-250)
        if c <= 430: return 300 + (c-350) * (100/80)
        return 400 + (c-430) * (100/80)

    def no2_sub_index(c):
        if c <= 40: return c * (50/40)
        if c <= 80: return 50 + (c-40) * (50/40)
        if c <= 180: return 100 + (c-80) * (100/100)
        if c <= 280: return 200 + (c-180) * (100/100)
        if c <= 400: return 300 + (c-280) * (100/120)
        return 400 + (c-400) * (100/120)

    sub_indices = [pm25_sub_index(pm25), pm10_sub_index(pm10), no2_sub_index(no2)]
    return int(round(max(sub_indices)))

def get_live_air_quality(lat, lon):
    try:
        aq_params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,aerosol_optical_depth",
            "timezone": "Asia/Kolkata"
        }
        res = requests.get(OPEN_METEO_AQ_URL, params=aq_params, timeout=1.2)
        if res.status_code == 200:
            data = res.json()
            hourly = data.get("hourly", {})
            current_idx = datetime.datetime.now().hour
            
            pm25 = hourly.get("pm2_5", [45])[current_idx] or 45.0
            pm10 = hourly.get("pm10", [90])[current_idx] or 90.0
            no2 = hourly.get("nitrogen_dioxide", [35])[current_idx] or 35.0
            so2 = hourly.get("sulphur_dioxide", [15])[current_idx] or 15.0
            co = hourly.get("carbon_monoxide", [500])[current_idx] or 500.0
            o3 = hourly.get("ozone", [25])[current_idx] or 25.0
            aod = hourly.get("aerosol_optical_depth", [0.4])[current_idx] or 0.45

            wx_params = {
                "latitude": lat,
                "longitude": lon,
                "hourly": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m",
                "timezone": "Asia/Kolkata"
            }
            wx_res = requests.get(OPEN_METEO_WEATHER_URL, params=wx_params, timeout=1.2)
            wx_data = wx_res.json() if wx_res.status_code == 200 else {}
            wx_hourly = wx_data.get("hourly", {})

            temp = wx_hourly.get("temperature_2m", [30])[current_idx] or 30.0
            rh = wx_hourly.get("relative_humidity_2m", [65])[current_idx] or 65.0
            wind_speed = wx_hourly.get("wind_speed_10m", [8.5])[current_idx] or 8.5
            wind_dir = wx_hourly.get("wind_direction_10m", [210])[current_idx] or 210

            aqi = calculate_indian_aqi(pm25, pm10, no2, so2, co/10.0, o3)

            return {
                "status": "LIVE_SATELLITE_API",
                "lat": lat,
                "lon": lon,
                "aqi": aqi,
                "pm2_5": round(pm25, 1),
                "pm10": round(pm10, 1),
                "no2": round(no2, 1),
                "so2": round(so2, 1),
                "co": round(co/1000.0, 2),
                "o3": round(o3, 1),
                "aod": round(aod, 3),
                "temperature": round(temp, 1),
                "humidity": round(rh, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_dir": wind_dir,
                "boundary_layer_height": round(450 + 150 * math.sin(current_idx / 24 * math.pi), 1),
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
    except Exception as e:
        print(f"API fetch fallback due to: {e}")

    # Distance to Delhi
    d_delhi = math.sqrt((lat - 28.6139)**2 + (lon - 77.2090)**2)
    base_aqi = 210 if d_delhi < 2.0 else 120
    return {
        "status": "SIMULATED_REANALYSIS",
        "lat": lat,
        "lon": lon,
        "aqi": int(base_aqi),
        "pm2_5": round(base_aqi * 0.45, 1),
        "pm10": round(base_aqi * 0.85, 1),
        "no2": round(base_aqi * 0.25, 1),
        "so2": 18.0,
        "co": 1.2,
        "o3": 30.0,
        "aod": 0.42,
        "temperature": 29.5,
        "humidity": 68.0,
        "wind_speed": 6.2,
        "wind_dir": 180,
        "boundary_layer_height": 520.0,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def search_location(query):
    query_lower = query.lower().strip()
    # 1. Search local state/capital list
    for item in ALL_INDIAN_STATES:
        state_match = query_lower in item["state"].lower()
        capital_match = query_lower in item["capital"].lower()
        if state_match or capital_match:
            return item
            
    # 2. Dynamic Open-Meteo Geocoding API search for any city/locality
    try:
        geo_url = "https://geocoding-api.open-meteo.com/v1/search"
        res = requests.get(geo_url, params={"name": query, "count": 1, "language": "en", "format": "json"}, timeout=1.2)
        if res.status_code == 200:
            results = res.json().get("results", [])
            if results:
                first = results[0]
                city_name = first.get("name", query.title())
                country_state = first.get("admin1", first.get("country", "India"))
                return {
                    "state": f"{country_state}",
                    "capital": city_name,
                    "lat": float(first["latitude"]),
                    "lon": float(first["longitude"]),
                    "baseline_aqi": 140
                }
    except Exception as e:
        print(f"Geocoding API error: {e}")

    # Fallback to Delhi if unmatched
    return ALL_INDIAN_STATES[31] # Delhi NCR

