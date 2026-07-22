# AirIQ: AI-Powered Urban Air Quality Intelligence Platform
## Hackathon Pitch Deck & Technical Presentation

---

### Slide 1: Title & Vision
- **Header**: AirIQ — Moving India from Reactive AQI Monitoring to Proactive Source Attribution & Enforcement.
- **Tagline**: The Intelligence Layer India's Cities Need to Reduce Air Pollution at Source.
- **Problem**: 24 of India's 50 most polluted cities are Tier 1/2 urban centers. While 900+ CAAQMS monitoring stations exist, a 2024 CAG audit revealed that **only 31% of cities have actionable multi-agency response protocols**.

---

### Slide 2: The Core Technological Breakthrough
- **Multi-Modal AI Fusion**: Fuses satellite reanalysis (Sentinel-5P NO2 column, MODIS AOD, NASA FIRMS active fire spots), IoT station feeds, meteorological forecasts, and geospatial stack databases.
- **Hyperlocal ML Engine**: Trained XGBoost & Deep Learning models producing 24-72h AQI forecasts at 1km grid resolution across Indian urban centers.
- **79.2% RMSE Reduction**: Achieves an RMSE of 22.23 vs 106.72 for standard persistence baselines (R² score: 0.9716).

---

### Slide 3: Multi-Agent AI System Architecture
- **Agent 1: Geospatial Attribution Engine**: Calculates ward-level source breakdown (Vehicular 38%, Stacks 24%, Construction Dust 22%, Biomass Burning 16%) with statistical confidence scores (e.g. 91.5%).
- **Agent 2: Hyperlocal Forecast Agent**: Generates 1km resolution predictive timelines for +24h, +48h, and +72h.
- **Agent 3: Enforcement Intelligence Agent**: Correlates hotspots with registered emission sources, generating prioritized inspection tickets & field squad dispatch orders.
- **Agent 4: Citizen Advisory System**: Maps population vulnerability (schools, hospitals, outdoor workers) and pushes regional advisories in 7 Indian languages with text-to-speech audio synthesis.

---

### Slide 4: Judging Criteria Alignment Matrix
| Criteria | Weight | AirIQ Implementation Highlight |
|---|---|---|
| **Innovation** | **25%** | First Indian platform uniting satellite thermal anomaly fusion, multi-agent AI source attribution & automated inspector dispatch |
| **Business Impact** | **25%** | Bridges the CAG-identified 69% actionable protocol gap; reduces response time from signal to enforcement from 48h to < 15 mins |
| **Technical Excellence** | **20%** | XGBoost ML dispersion model with 79.2% RMSE improvement; FastAPI + Leaflet + React glassmorphic web dashboard |
| **Scalability** | **15%** | Multi-city comparative intelligence layer scalable across all 131 NCAP non-attainment Indian cities |
| **User Experience** | **15%** | State-of-the-art dark glassmorphism dashboard, interactive 1km map inspector, and 7-language audio broadcast advisories |

---

### Slide 5: Multi-City Scope
- Delhi NCR, Mumbai, Kolkata, Bengaluru, Chennai, Hyderabad, Ahmedabad, Pune.
