from agents.attribution_agent import GeospatialAttributionAgent
from agents.forecast_agent import HyperlocalForecastAgent
from agents.enforcement_agent import EnforcementIntelligenceAgent
from agents.advisory_agent import ActionableAlertAgent
from services.open_meteo_service import ALL_INDIAN_STATES

class AgentOrchestrator:
    def __init__(self):
        self.attribution_agent = GeospatialAttributionAgent()
        self.forecast_agent = HyperlocalForecastAgent()
        self.enforcement_agent = EnforcementIntelligenceAgent()
        self.actionable_alert_agent = ActionableAlertAgent()

    def run_full_intelligence_pipeline(self, lat, lon, location_name="Delhi"):
        # 1. Run Forecast Agent
        forecast_res = self.forecast_agent.generate_forecast(lat, lon)
        current_aqi = forecast_res["current_state"]["aqi"]
        pred_24h = forecast_res["predictive_timeline"][1]["aqi"]

        # 2. Run Source Attribution Agent
        attribution_res = self.attribution_agent.analyze_source_attribution(
            lat, lon,
            live_data={
                "aqi": current_aqi,
                "pm2_5": current_aqi * 0.45,
                "pm10": current_aqi * 0.85,
                "no2": current_aqi * 0.25,
                "so2": 18.0,
                "aod": 0.52,
                "wind_dir": 210
            },
            matched_ward={"type": location_name}
        )

        # 3. Run Enforcement Agent
        enforcement_res = self.enforcement_agent.generate_prioritized_tickets(
            lat, lon, location_name, location_name, current_aqi
        )

        # 4. Run Actionable Alert & Guidance Agent
        alert_res = self.actionable_alert_agent.generate_actionable_guidance(
            location_name, current_aqi, pred_24h
        )

        return {
            "platform": "AirIQ AI Urban Air Quality Intelligence Platform",
            "orchestrator_status": "PIPELINE_COMPLETE",
            "query_location": {"latitude": lat, "longitude": lon, "location_name": location_name},
            "attribution": attribution_res,
            "forecast": forecast_res,
            "enforcement": enforcement_res,
            "actionable_alerts": alert_res
        }

orchestrator = AgentOrchestrator()
