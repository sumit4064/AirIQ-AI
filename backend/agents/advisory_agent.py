class ActionableAlertAgent:
    """
    AI Advisory & Alert Agent that monitors live AQI thresholds, generates real-time hazard alerts,
    and provides explicit step-by-step 'What To Do' and 'How To Do It' action plans for
    both Municipal Authorities (Officials) and Citizens (Vulnerable Groups).
    """
    def __init__(self):
        self.agent_name = "Actionable AI Advisory & Alert Agent"

    def generate_actionable_guidance(self, location_name="Delhi", current_aqi=230, forecast_24h=245):
        max_aqi = max(current_aqi, forecast_24h)

        if max_aqi >= 300:
            alert_level = "CRITICAL_RED_ALERT"
            alert_title = "CRITICAL AIR POLLUTION EMERGENCY"
            color = "#7C3AED"
        elif max_aqi >= 200:
            alert_level = "HIGH_ORANGE_WARNING"
            alert_title = "DANGEROUS AIR QUALITY HAZARD WARNING"
            color = "#EF4444"
        elif max_aqi >= 120:
            alert_level = "MODERATE_YELLOW_ADVISORY"
            alert_title = "MODERATE TO POOR AIR ADVISORY"
            color = "#F59E0B"
        else:
            alert_level = "GREEN_SATISFACTORY"
            alert_title = "SATISFACTORY AIR QUALITY"
            color = "#10B981"

        # Step-by-Step Action Plan for Authorities (WHAT to do & HOW to do it)
        official_playbook = [
            {
                "step": 1,
                "what_to_do": "Enforce Emergency GRAP Stage III/IV Directives",
                "how_to_do_it": "Issue immediate Section 144 orders prohibiting uncontained construction, demolition, and open biomass/waste burning within a 5km radius.",
                "priority": "IMMEDIATE_ACTION"
            },
            {
                "step": 2,
                "what_to_do": "Deploy Anti-Smog Water Cannons & Wet Suppressants",
                "how_to_do_it": "Mobilize municipal water sprinkling tankers along top 5 high-density traffic corridors twice daily (6 AM & 8 PM).",
                "priority": "HIGH_PRIORITY"
            },
            {
                "step": 3,
                "what_to_do": "Activate ANPR Truck Diversion Barriers",
                "how_to_do_it": "Reroute non-destined commercial BS-III/IV diesel trucks via Peripheral Expressways using automated camera checkpoints.",
                "priority": "CORRIDOR_PATROL"
            },
            {
                "step": 4,
                "what_to_do": "Audit Red-Category Industrial Stacks",
                "how_to_do_it": "Dispatch SPCB flying squads to audit continuous stack monitoring (OCEMS) data and verify PNG fuel compliance.",
                "priority": "INSPECTION_DISPATCH"
            }
        ]

        # Step-by-Step Action Guide for Citizens & Vulnerable Groups (WHAT to do & HOW to do it)
        citizen_playbook = [
            {
                "step": 1,
                "what_to_do": "Wear Certified Respirator Protection Outdoors",
                "how_to_do_it": "Use N95 or FFP2 rated masks. Ensure metal nose strip is tightly pressed against the nose bridge with zero gaps on cheek contours.",
                "target_group": "All Residents & Outdoor Workers"
            },
            {
                "step": 2,
                "what_to_do": "Implement DIY Indoor Air Filtration",
                "how_to_do_it": "Keep windows sealed between 5 AM - 10 AM. If commercial air purifiers are unavailable, attach a MERV-13 filter to a standard box fan.",
                "target_group": "Homes, Schools & Elderly Care"
            },
            {
                "step": 3,
                "what_to_do": "Hydration & Nasal Saline Rinses",
                "how_to_do_it": "Drink 2.5 - 3 Liters of warm water daily. Perform saline nasal spray irrigation twice daily to clear particulate matter from upper airways.",
                "target_group": "Asthma Patients & Children"
            },
            {
                "step": 4,
                "what_to_do": "Adjust School & Workplace Outdoor Schedules",
                "how_to_do_it": "Suspend morning outdoor sports & assemblies. Outdoor workers must take a compulsory 15-minute hydration/rest break every 2 hours in shaded areas.",
                "target_group": "Schools & Construction Teams"
            }
        ]

        # Multi-lingual broadcast advisory text
        translations = {
            "en": {
                "headline": f"{alert_title} for {location_name}: AQI {max_aqi}",
                "summary": "Immediate intervention required. High PM2.5/PM10 levels pose severe health risks to children and elderly."
            },
            "hi": {
                "headline": f"{location_name} के लिए आपातकालीन वायु चेतावनी: AQI {max_aqi}",
                "summary": "तत्काल कार्रवाई की आवश्यकता है। उच्च PM2.5/PM10 स्तर बच्चों और बुजुर्गों के लिए गंभीर खतरा पैदा करता है।"
            },
            "kn": {
                "headline": f"{location_name} ಗಾಗಿ ವಾಯು ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ: AQI {max_aqi}",
                "summary": "ತಕ್ಷಣದ ಕ್ರಮದ ಅಗತ್ಯವಿದೆ. PM2.5 ಮಟ್ಟವು ಆರೋಗ್ಯಕ್ಕೆ ಅಪಾಯಕಾರಿಯಾಗಿದೆ."
            },
            "ta": {
                "headline": f"{location_name} பகுதி வளிமண்டல எச்சரிக்கை: AQI {max_aqi}",
                "summary": "உடனடி நடவடிக்கை தேவை. PM2.5 அளவுகள் கடுமையான சுகாதார அபாயத்தை ஏற்படுத்துகின்றன."
            },
            "bn": {
                "headline": f"{location_name} এর জন্য বায়ু সতর্কতা: AQI {max_aqi}",
                "summary": "অবিলম্বে ব্যবস্থা নেওয়া প্রয়োজন। শিশু এবং প্রবীণদের জন্য বিপজ্জনক।"
            },
            "mr": {
                "headline": f"{location_name} साठी हवामान आपत्कालीन इशारा: AQI {max_aqi}",
                "summary": "तातडीने कारवाई आवश्यक आहे. PM2.5 पातळी आरोग्यासाठी गंभीर धोक्याची आहे."
            },
            "te": {
                "headline": f"{location_name} కోసం గాలి నాణ్యత హెచ్చరిక: AQI {max_aqi}",
                "summary": "వెంటనే చర్యలు తీసుకోవడం అవసరం. PM2.5 స్థాయిలు తీవ్ర ఆరోగ్య ప్రమాదాన్ని కలిగిస్తాయి."
            }
        }

        return {
            "agent": self.agent_name,
            "location": location_name,
            "alert_level": alert_level,
            "alert_title": alert_title,
            "color": color,
            "current_aqi": current_aqi,
            "forecast_24h": forecast_24h,
            "official_playbook": official_playbook,
            "citizen_playbook": citizen_playbook,
            "translations": translations
        }
