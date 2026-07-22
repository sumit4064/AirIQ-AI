import numpy as np
import pandas as pd
import joblib
import os
import sys
import datetime
from xgboost import XGBClassifier, XGBRegressor
from services.open_meteo_service import get_live_air_quality

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

np.random.seed(42)
TRAFFIC_MODEL_PATH = os.path.join(os.path.dirname(__file__), "traffic_model.pkl")

def generate_traffic_dataset(num_samples=2500):
    lats = np.random.uniform(12.8, 28.9, num_samples)
    lons = np.random.uniform(72.5, 88.5, num_samples)
    hours = np.random.randint(0, 24, num_samples)
    days_of_week = np.random.randint(0, 7, num_samples) # 0=Monday, 6=Sunday
    
    is_weekend = (days_of_week >= 5).astype(int)
    is_peak_hour = (((hours >= 8) & (hours <= 11)) | ((hours >= 17) & (hours <= 20))).astype(int)
    
    fleet_density = np.random.uniform(1.0, 10.0, num_samples)
    pm25 = np.random.uniform(15.0, 280.0, num_samples)
    temp = np.random.uniform(15.0, 42.0, num_samples)
    visibility = np.clip(10.0 - (pm25 / 30.0), 0.5, 10.0)
    
    # Calculate synthetic realistic Congestion Index (0 - 100%)
    base_congestion = (
        is_peak_hour * 42.0 
        + fleet_density * 4.5 
        + (1 - is_weekend) * 15.0 
        + np.where(hours >= 22, -25.0, 0.0)
        + np.where(hours <= 5, -35.0, 0.0)
        + (10.0 - visibility) * 2.0
    )
    
    congestion_index = np.clip(base_congestion + np.random.normal(0, 6, num_samples), 5, 98)
    
    # Speed inversely proportional to congestion
    speed_kmh = np.clip(60.0 - (congestion_index * 0.48) + np.random.normal(0, 3, num_samples), 8, 65)
    
    # Delay in minutes
    delay_mins = np.clip((congestion_index / 100.0) * 35.0 + np.random.normal(0, 2, num_samples), 0, 45)
    
    # Categorical Traffic Status: 0=CLEAR, 1=MODERATE, 2=HEAVY, 3=SEVERE
    traffic_status = np.select(
        [congestion_index < 35, congestion_index < 60, congestion_index < 80],
        [0, 1, 2],
        default=3
    )

    df = pd.DataFrame({
        "lat": lats,
        "lon": lons,
        "hour": hours,
        "day_of_week": days_of_week,
        "is_weekend": is_weekend,
        "is_peak_hour": is_peak_hour,
        "fleet_density": fleet_density,
        "pm25": pm25,
        "temp": temp,
        "visibility": visibility,
        "congestion_index": congestion_index,
        "speed_kmh": speed_kmh,
        "delay_mins": delay_mins,
        "traffic_status": traffic_status
    })
    return df

def retrain_traffic_model():
    print("⚡ [AirIQ Traffic ML] Training Multi-Variate Traffic Predictor...")
    df = generate_traffic_dataset(3000)
    
    feature_cols = [
        "lat", "lon", "hour", "day_of_week", "is_weekend",
        "is_peak_hour", "fleet_density", "pm25", "temp", "visibility"
    ]
    
    X = df[feature_cols]
    y_class = df["traffic_status"]
    y_index = df["congestion_index"]
    y_speed = df["speed_kmh"]
    y_delay = df["delay_mins"]

    classifier = XGBClassifier(n_estimators=150, max_depth=5, learning_rate=0.05, random_state=42)
    classifier.fit(X, y_class)
    
    reg_index = XGBRegressor(n_estimators=150, max_depth=5, learning_rate=0.05, random_state=42)
    reg_index.fit(X, y_index)
    
    reg_speed = XGBRegressor(n_estimators=150, max_depth=5, learning_rate=0.05, random_state=42)
    reg_speed.fit(X, y_speed)
    
    reg_delay = XGBRegressor(n_estimators=150, max_depth=5, learning_rate=0.05, random_state=42)
    reg_delay.fit(X, y_delay)

    model_payload = {
        "classifier": classifier,
        "reg_index": reg_index,
        "reg_speed": reg_speed,
        "reg_delay": reg_delay,
        "feature_cols": feature_cols
    }
    
    os.makedirs("backend/ml", exist_ok=True)
    joblib.dump(model_payload, TRAFFIC_MODEL_PATH)
    print("✅ AirIQ Traffic ML Model trained & saved successfully!")
    return {"status": "TRAFFIC_MODEL_TRAINED", "samples": len(df)}

class TrafficPredictor:
    def __init__(self):
        self.model_data = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(TRAFFIC_MODEL_PATH):
            try:
                self.model_data = joblib.load(TRAFFIC_MODEL_PATH)
                print("✅ Traffic XGBoost ML Model loaded into memory.")
            except Exception as e:
                print(f"⚠️ Traffic model load error: {e}")
        else:
            retrain_traffic_model()
            self._load_model()

    def predict_traffic(self, lat, lon, hour=None, day_of_week=None, fleet_density=6.5):
        now = datetime.datetime.now()
        target_hour = hour if hour is not None else now.hour
        target_dow = day_of_week if day_of_week is not None else now.weekday()
        
        is_weekend = 1 if target_dow >= 5 else 0
        is_peak_hour = 1 if ((8 <= target_hour <= 11) or (17 <= target_hour <= 20)) else 0
        
        live_env = get_live_air_quality(lat, lon)
        pm25 = live_env.get("pm2_5", 65.0)
        temp = live_env.get("temperature", 28.0)
        visibility = max(0.5, 10.0 - (pm25 / 35.0))

        feat_vector = [[
            lat, lon, target_hour, target_dow, is_weekend,
            is_peak_hour, fleet_density, pm25, temp, visibility
        ]]

        status_names = {0: "CLEAR / LOW TRAFFIC", 1: "MODERATE TRAFFIC", 2: "HEAVY CONGESTION", 3: "SEVERE GRIDLOCK"}
        status_colors = {0: "emerald", 1: "amber", 2: "orange", 3: "rose"}

        if self.model_data:
            clf = self.model_data["classifier"]
            reg_idx = self.model_data["reg_index"]
            reg_spd = self.model_data["reg_speed"]
            reg_dly = self.model_data["reg_delay"]
            
            status_code = int(clf.predict(feat_vector)[0])
            prob_dist = clf.predict_proba(feat_vector)[0]
            congestion_pct = float(np.clip(reg_idx.predict(feat_vector)[0], 5, 99))
            speed_kmh = float(np.clip(reg_spd.predict(feat_vector)[0], 8, 65))
            delay_mins = float(np.clip(reg_dly.predict(feat_vector)[0], 0, 45))
            confidence_pct = float(np.max(prob_dist) * 100.0)
        else:
            # Fallback estimation
            congestion_pct = 72.0 if is_peak_hour else 35.0
            status_code = 2 if is_peak_hour else 0
            speed_kmh = 24.0 if is_peak_hour else 45.0
            delay_mins = 18.0 if is_peak_hour else 4.0
            confidence_pct = 85.0

        return {
            "latitude": lat,
            "longitude": lon,
            "hour": target_hour,
            "day_of_week": target_dow,
            "is_peak_hour": bool(is_peak_hour),
            "is_weekend": bool(is_weekend),
            "traffic_status": status_names.get(status_code, "MODERATE TRAFFIC"),
            "traffic_code": status_code,
            "status_color": status_colors.get(status_code, "amber"),
            "congestion_index_pct": round(congestion_pct, 1),
            "estimated_speed_kmh": round(speed_kmh, 1),
            "estimated_delay_mins": round(delay_mins, 1),
            "confidence_pct": round(confidence_pct, 1),
            "fleet_density_index": fleet_density,
            "pm25_impact_ugm3": round(fleet_density * 6.2 + congestion_pct * 0.45, 1)
        }

traffic_predictor = TrafficPredictor()

if __name__ == "__main__":
    retrain_traffic_model()
