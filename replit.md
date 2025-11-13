# Overview

This is a beautiful, modern weather application that provides real-time weather information for cities worldwide. The application features a responsive design with dark/light theme support, temperature unit conversion (Celsius/Fahrenheit), and an intuitive search interface with city suggestions. It uses the OpenWeatherMap API to fetch live weather data and presents it in an attractive, user-friendly interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Single-Page Application (SPA) Design**
- The application uses vanilla JavaScript (ES6+) without frameworks, keeping the bundle size minimal and performance optimal
- DOM manipulation is handled directly through JavaScript for real-time updates without page reloads
- State management is implemented using simple JavaScript variables (`currentWeatherData`, `isCelsius`) rather than a state management library
- Theme preference is persisted using localStorage for user convenience across sessions

**Responsive Design Approach**
- CSS3 with custom properties (CSS variables) for theming, allowing instant theme switching between light and dark modes
- Gradient backgrounds and modern UI elements (soft shadows, rounded corners) for visual appeal
- Mobile-first responsive design principles to ensure compatibility across all device sizes

**Key UI Features**
- Dynamic city suggestions from a predefined list of popular cities
- Loading states with spinners to provide user feedback during API calls
- Error handling with dismissible error messages
- Temperature unit toggle functionality without requiring new API calls

## Backend Architecture

**Flask Microservice Pattern**
- Lightweight Flask application serving both static files and API endpoints
- RESTful API design with a single `/api/weather` endpoint that accepts GET requests
- CORS enabled to allow cross-origin requests (useful for development and potential future hosting scenarios)

**Request Flow**
1. User input triggers frontend JavaScript
2. Frontend makes GET request to `/api/weather?city={cityname}`
3. Backend validates city parameter and API key configuration
4. Backend proxies request to OpenWeatherMap API with configured credentials
5. Backend transforms and returns weather data to frontend
6. Frontend updates UI with received data

**Error Handling Strategy**
- Input validation (city parameter required)
- Configuration validation (API key must be present)
- HTTP status code propagation (404 for city not found, 500 for server errors)
- Timeout protection (10-second timeout on external API calls)

**Rationale**: Using Flask as a backend proxy rather than direct API calls from the frontend protects the API key from exposure in client-side code and allows for future rate limiting, caching, or data transformation.

## Static File Serving

**Flask Static File Handler**
- Flask serves HTML, CSS, and JavaScript files directly from the root directory
- Individual route handlers for each static file type (`/`, `/style.css`, `/script.js`)
- Alternative approach considered: Using a traditional static folder structure, but current approach simplifies deployment on Replit

## Data Processing

**Weather Data Transformation**
- Backend receives comprehensive weather data from OpenWeatherMap API
- Data is filtered and restructured into a simplified format before sending to frontend
- Temperature is received in Celsius (metric units) from API, with frontend handling Fahrenheit conversion

## External Dependencies

**OpenWeatherMap API**
- Purpose: Provides real-time weather data for cities worldwide
- Integration: HTTP GET requests to `api.openweathermap.org/data/2.5/weather`
- Authentication: API key passed as query parameter
- Configuration: API key stored in environment variable (`OPENWEATHER_API_KEY`)
- Data format: JSON response with temperature, humidity, wind speed, pressure, and conditions
- Units: Metric system (Celsius) requested by default

**Python Dependencies**
- `Flask`: Web framework for backend server and routing
- `flask-cors`: Middleware for handling Cross-Origin Resource Sharing
- `requests`: HTTP library for making API calls to OpenWeatherMap
- `python-dotenv`: Environment variable management for secure API key storage

**Environment Configuration**
- `.env` file (not committed to version control) stores sensitive API credentials
- `.env.example` provides template for required environment variables
- API key must be obtained from OpenWeatherMap and configured before application can function

**Frontend Dependencies**
- No external JavaScript libraries or frameworks
- Uses modern browser APIs (Fetch API, localStorage)
- SVG icons embedded directly in HTML for theme toggle and search button