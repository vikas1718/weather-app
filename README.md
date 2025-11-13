# Beautiful Weather Application

A modern, responsive weather application that displays real-time weather data with an attractive user interface. Built with HTML, CSS, JavaScript, and Python Flask backend.

## Features

- **Beautiful Modern Design**: Clean UI with gradient backgrounds, centered card layout, soft shadows, and smooth animations
- **Real-time Weather Data**: Fetches live weather information from OpenWeatherMap API
- **Comprehensive Weather Info**: Displays temperature (°C and °F), feels-like temperature, humidity, wind speed, pressure, and weather conditions
- **Temperature Conversion**: Toggle between Celsius and Fahrenheit with one click
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **User-friendly**: Search any city worldwide with instant results
- **Loading States**: Visual feedback with loading spinner and error messages
- **Weather Icons**: Dynamic weather icons that match current conditions

## Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Async/await API calls, DOM manipulation, event handling

### Backend
- **Python 3.11**: Core programming language
- **Flask**: Lightweight web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Requests**: HTTP library for API calls
- **python-dotenv**: Environment variable management

### API
- **OpenWeatherMap API**: Real-time weather data

## Project Structure

```
.
├── app.py              # Flask backend server
├── index.html          # Main HTML structure
├── style.css           # Styling and design
├── script.js           # Frontend JavaScript logic
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## How It Works

### Data Flow
1. **User Input**: User enters a city name and clicks search (or presses Enter)
2. **Frontend Request**: JavaScript sends a GET request to `/api/weather?city={cityname}`
3. **Backend Processing**: Flask receives the request and forwards it to OpenWeatherMap API
4. **API Response**: OpenWeatherMap returns weather data in JSON format
5. **Data Processing**: Flask processes and formats the data (temperature conversions, etc.)
6. **Display**: Frontend receives the data and updates the UI with weather information

### API Endpoint

**GET /api/weather**
- **Query Parameter**: `city` (string, required)
- **Response**: JSON object with weather data
- **Error Codes**: 
  - 400: Missing city parameter
  - 404: City not found
  - 500: API key not configured
  - 503: Failed to connect to weather service
  - 504: Request timeout

## Setup Instructions

### 1. Prerequisites
- Python 3.11+ installed
- OpenWeatherMap API key (free tier available)

### 2. Install Dependencies
The required dependencies are already installed in this Replit environment:
- flask
- flask-cors
- requests
- python-dotenv

### 3. Get OpenWeatherMap API Key
1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to your account's API keys section
4. Copy your API key
5. The API key has already been configured as a Replit Secret

### 4. Run the Application
The Flask server is already configured and running on port 5000:
```bash
python app.py
```

The server will start on `http://0.0.0.0:5000` and you can access the weather app through the Replit webview.

### 5. Using the Application
1. The app loads with weather data for London by default
2. Enter any city name in the search box
3. Click the search button or press Enter
4. View comprehensive weather information
5. Toggle between Celsius and Fahrenheit using the temperature buttons

## Features Explained

### Weather Data Displayed
- **City & Country**: Location information
- **Temperature**: Current temperature (switchable between °C and °F)
- **Feels Like**: Perceived temperature
- **Weather Condition**: Description with matching icon
- **Humidity**: Relative humidity percentage
- **Wind Speed**: Wind speed in meters per second
- **Pressure**: Atmospheric pressure in hPa

### UI Elements
- **Search Box**: Input field with search button
- **Loading Spinner**: Displays while fetching data
- **Error Messages**: Shows helpful error messages for invalid cities or API failures
- **Weather Card**: Centered, responsive card with all weather information
- **Temperature Toggle**: Switch between Celsius and Fahrenheit

## Error Handling

The application handles various error scenarios:
- **Invalid city names**: Shows "City not found" error
- **Empty input**: Prompts user to enter a city name
- **API failures**: Displays connection error messages
- **Timeouts**: Handles slow or unresponsive API requests
- **Missing API key**: Alerts if configuration is incomplete

## Design Highlights

- **Gradient Background**: Eye-catching purple gradient with animated pattern
- **Card Design**: Frosted glass effect with backdrop blur
- **Typography**: Modern, readable font with gradient text for headers
- **Icons**: SVG icons for search and weather details
- **Animations**: Smooth fade-in, slide-up, and shake effects
- **Hover Effects**: Interactive elements respond to user interaction
- **Mobile Responsive**: Adapts layout for smaller screens

## Future Enhancements

Potential features for future versions:
- 5-day weather forecast
- Geolocation to auto-detect user's location
- Weather data visualization with charts
- Favorite cities list with local storage
- Additional metrics (UV index, visibility, sunrise/sunset)
- Weather alerts and notifications
- Multiple language support
- Dark/light theme toggle

## Security Notes

- API key is stored securely in Replit Secrets (environment variables)
- Never commit `.env` file to version control
- CORS is enabled for local development
- Input is sanitized and validated before API calls

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## License

This project is open source and available for personal and educational use.

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Weather icons from OpenWeatherMap
- Built with Flask and vanilla JavaScript

---

**Enjoy tracking the weather with this beautiful application!** 🌤️
