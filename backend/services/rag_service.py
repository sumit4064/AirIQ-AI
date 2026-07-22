import re

# Comprehensive RAG Knowledge Base Document Corpus
RAG_DOCUMENT_CORPUS = [
    {
        "id": "cpcb_aqi_standards",
        "category": "Regulatory Standards",
        "title": "CPCB Indian National Ambient Air Quality Index (NAAQS) Thresholds",
        "content": (
            "Indian AQI Categories & PM2.5 / PM10 Standards:\n"
            "- Good (0-50): PM2.5 <= 30 µg/m³, PM10 <= 50 µg/m³. Minimal impact.\n"
            "- Satisfactory (51-100): PM2.5 31-60, PM10 51-100. Minor breathing discomfort to sensitive people.\n"
            "- Moderate (101-200): PM2.5 61-90, PM10 101-250. Breathing discomfort to people with lungs, asthma, and heart disease.\n"
            "- Poor (201-300): PM2.5 91-120, PM10 251-350. Breathing discomfort to most people on prolonged exposure.\n"
            "- Very Poor (301-400): PM2.5 121-250, PM10 351-430. Respiratory illness on prolonged exposure.\n"
            "- Severe (401-500): PM2.5 > 250, PM10 > 430. Affects healthy people and seriously impacts those with existing diseases."
        )
    },
    {
        "id": "grap_action_plan",
        "category": "Environmental Enforcement",
        "title": "Graded Response Action Plan (GRAP Stages I - IV) Directives",
        "content": (
            "GRAP Enforcement Protocols:\n"
            "- Stage I (AQI 201-300 'Poor'): Mechanized sweeping, anti-smog guns at construction sites > 500 sqm, strict ban on garbage burning.\n"
            "- Stage II (AQI 301-400 'Very Poor'): Enhance parking fees, augment CNG/electric bus services, daily water sprinkling with dust suppressants.\n"
            "- Stage III (AQI 401-450 'Severe'): Strict ban on non-essential construction, restriction on BS-III Petrol and BS-IV Diesel 4-wheelers.\n"
            "- Stage IV (AQI 450+ 'Severe Plus'): Stop entry of heavy commercial trucks (except essential services), consider physical school closures, enforce 50% work-from-home for public/private offices."
        )
    },
    {
        "id": "vehicular_traffic_impact",
        "category": "Traffic & Emissions",
        "title": "Urban Vehicular Emissions & Traffic Congestion Dynamics",
        "content": (
            "Traffic & Pollution Correlation:\n"
            "- Heavy vehicular traffic contributes up to 40% of urban PM2.5 and 60% of Nitrogen Dioxide (NO2) emissions during peak hours.\n"
            "- Stop-and-go congestion increases per-vehicle fuel consumption and fugitive dust resuspension by 3.2x compared to free-flowing traffic.\n"
            "- Idling engines at major traffic intersections emit micro-particulates and carbon monoxide in localized hotspots.\n"
            "- Key Interventions: Traffic signal synchronization, staggered office timing, congestion charging, promotion of EV corridors, and enforcement of PUC certificates."
        )
    },
    {
        "id": "health_mitigation_guidelines",
        "category": "Public Health",
        "title": "Health Advisories & Personal Protection Guidelines",
        "content": (
            "Health Guidelines based on AQI & Traffic Density:\n"
            "- Outdoor Exercise: Avoid morning/evening outdoor workouts when AQI > 200 or traffic congestion index > 60% due to inversion layer trapping pollutants.\n"
            "- Mask Recommendations: Use N95 or FFP2 respirators near heavy traffic corridors and industrial stack plumes.\n"
            "- Vulnerable Populations: Children, elderly, and individuals with cardiovascular or respiratory conditions should remain indoors with HEPA air purifiers when AQI exceeds 300."
        )
    },
    {
        "id": "meteorology_inversion",
        "category": "Meteorology",
        "title": "Thermal Inversion & Boundary Layer Dynamics",
        "content": (
            "Boundary Layer Height (BLH) & Temperature Inversion:\n"
            "- Low Boundary Layer Heights (< 400m) during winter nights lock vehicular exhaust and industrial emissions near the ground surface.\n"
            "- Low wind speeds (< 5 km/h) restrict horizontal dispersion, compounding PM2.5 and NO2 concentrations in traffic bottlenecks."
        )
    }
]

def retrieve_rag_context(user_query: str, location_name: str = None, live_env_data: dict = None, traffic_data: dict = None) -> dict:
    """
    RAG Retrieval Engine: Matches user query intent against document corpus, 
    fuses real-time sensor metrics, and produces grounded context for LLM generation.
    """
    query_lower = user_query.lower()
    
    # 1. Document Relevance Scoring
    scored_docs = []
    for doc in RAG_DOCUMENT_CORPUS:
        score = 0
        keywords = doc["title"].lower().split() + doc["content"].lower().split()
        for word in re.findall(r'\w+', query_lower):
            if len(word) > 3 and word in keywords:
                score += 1
        
        # Boost specific categories based on query terms
        if any(term in query_lower for term in ["grap", "stage", "ban", "rule", "policy", "law"]):
            if doc["id"] == "grap_action_plan": score += 5
        if any(term in query_lower for term in ["traffic", "vehicle", "car", "jam", "road", "congestion", "speed"]):
            if doc["id"] == "vehicular_traffic_impact": score += 5
        if any(term in query_lower for term in ["health", "mask", "run", "exercise", "asthma", "safe"]):
            if doc["id"] == "health_mitigation_guidelines": score += 5
        if any(term in query_lower for term in ["standard", "level", "pm2.5", "aqi", "normal"]):
            if doc["id"] == "cpcb_aqi_standards": score += 5

        if score > 0:
            scored_docs.append((score, doc))
            
    scored_docs.sort(key=lambda x: x[0], reverse=True)
    top_docs = [doc for _, doc in scored_docs[:3]] if scored_docs else RAG_DOCUMENT_CORPUS[:2]

    # 2. Extract context strings
    retrieved_passages = [f"[{doc['category']}] {doc['title']}: {doc['content']}" for doc in top_docs]

    # 3. Fuse Real-time Sensor Data Context
    live_context = ""
    if live_env_data:
        live_context = (
            f"LIVE SATELLITE & IOT DATA for {location_name or 'Requested Location'}:\n"
            f"- AQI: {live_env_data.get('aqi')} ({'Poor/Severe' if live_env_data.get('aqi', 0)>200 else 'Moderate/Good'})\n"
            f"- PM2.5: {live_env_data.get('pm2_5')} µg/m³\n"
            f"- PM10: {live_env_data.get('pm10')} µg/m³\n"
            f"- NO2: {live_env_data.get('no2')} µg/m³\n"
            f"- Temperature: {live_env_data.get('temperature')}°C, Humidity: {live_env_data.get('humidity')}%\n"
            f"- Wind Speed: {live_env_data.get('wind_speed')} km/h"
        )
        
    traffic_context = ""
    if traffic_data:
        traffic_context = (
            f"REAL-TIME TRAFFIC ML PREDICTION for {location_name or 'Requested Location'}:\n"
            f"- Traffic Status: {traffic_data.get('traffic_status')}\n"
            f"- Congestion Index: {traffic_data.get('congestion_index_pct')}%\n"
            f"- Average Speed: {traffic_data.get('estimated_speed_kmh')} km/h\n"
            f"- Expected Delay: {traffic_data.get('estimated_delay_mins')} mins\n"
            f"- Peak Hour Status: {'YES (High Congestion Risk)' if traffic_data.get('is_peak_hour') else 'NO'}"
        )

    return {
        "retrieved_documents": top_docs,
        "passages": retrieved_passages,
        "live_context": live_context,
        "traffic_context": traffic_context,
        "sources": [doc["title"] for doc in top_docs] + (["Live Open-Meteo Satellite Feed", "AirIQ XGBoost Traffic ML Engine"] if live_env_data else [])
    }
