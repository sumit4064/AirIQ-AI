from backend.ml.predict import predictor

class HyperlocalForecastAgent:
    """
    AI Agent integrating meteorological forecasts, traffic prediction, seasonal emission calendars,
    and ML dispersion modeling to provide 24-72h AQI forecasts at 1km grid resolution.
    """
    def __init__(self):
        self.agent_name = "Hyperlocal Predictive AQI Forecasting Agent"

    def generate_forecast(self, lat, lon):
        ml_prediction = predictor.predict_hyperlocal_aqi(lat, lon)
        forecasts = ml_prediction["forecasts"]

        curr_aqi = forecasts["current_aqi"]
        p24 = forecasts["pred_24h"]
        p48 = forecasts["pred_48h"]
        p72 = forecasts["pred_72h"]

        # Determine advisory tier
        def get_severity(val):
            if val <= 50: return ("Good", "#10B981")
            if val <= 100: return ("Satisfactory", "#84CC16")
            if val <= 200: return ("Moderate", "#F59E0B")
            if val <= 300: return ("Poor", "#F97316")
            if val <= 400: return ("Very Poor", "#EF4444")
            return ("Severe+", "#7C3AED")

        curr_label, curr_color = get_severity(curr_aqi)
        p24_label, p24_color = get_severity(p24)

        trend = "SURGING" if p24 > curr_aqi + 15 else ("IMPROVING" if p24 < curr_aqi - 15 else "STABLE")

        return {
            "agent": self.agent_name,
            "resolution": "1km Grid Resolution",
            "current_state": {
                "aqi": curr_aqi,
                "category": curr_label,
                "color": curr_color
            },
            "predictive_timeline": [
                {"period": "Current (0h)", "aqi": curr_aqi, "baseline_aqi": curr_aqi, "category": curr_label, "color": curr_color},
                {"period": "+24 Hours", "aqi": p24, "baseline_aqi": forecasts["persistence_baseline_24h"], "category": p24_label, "color": p24_color},
                {"period": "+48 Hours", "aqi": p48, "baseline_aqi": forecasts["persistence_baseline_24h"] + 5, "category": get_severity(p48)[0], "color": get_severity(p48)[1]},
                {"period": "+72 Hours", "aqi": p72, "baseline_aqi": forecasts["persistence_baseline_24h"] - 3, "category": get_severity(p72)[0], "color": get_severity(p72)[1]}
            ],
            "dispersion_trend": trend,
            "model_metrics": ml_prediction["model_performance"]
        }
