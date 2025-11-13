const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherDisplay = document.getElementById('weatherDisplay');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
const themeToggle = document.getElementById('themeToggle');
const citySuggestions = document.getElementById('citySuggestions');
const forecastBtn = document.getElementById('forecastBtn');
const currentWeatherView = document.getElementById('currentWeatherView');
const forecastView = document.getElementById('forecastView');
const backBtn = document.getElementById('backBtn');
const forecastCardsContainer = document.getElementById('forecastCardsContainer');
const forecastLoadingSpinner = document.getElementById('forecastLoadingSpinner');
const forecastCityName = document.getElementById('forecastCityName');

let currentWeatherData = null;
let isCelsius = true;
let suggestionsTimeout = null;

const popularCities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 
    'Sydney', 'Mumbai', 'Barcelona', 'Istanbul', 'Los Angeles', 
    'Chicago', 'Toronto', 'Berlin', 'Rome', 'Madrid', 'Amsterdam',
    'Bangkok', 'Hong Kong', 'Seoul', 'San Francisco', 'Miami',
    'Boston', 'Seattle', 'Las Vegas', 'Vancouver', 'Montreal'
];

function initTheme() {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('weatherAppTheme', isDark ? 'dark' : 'light');
}

function showCurrentWeatherView() {
    currentWeatherView.classList.remove('hide');
    currentWeatherView.classList.add('show');
    forecastView.classList.remove('show');
    forecastView.classList.add('hide');
    setTimeout(() => {
        forecastView.style.display = 'none';
        currentWeatherView.style.display = 'block';
    }, 100);
}

function showForecastView() {
    forecastView.style.display = 'block';
    currentWeatherView.style.display = 'none';
    currentWeatherView.classList.remove('show');
    currentWeatherView.classList.add('hide');
    forecastView.classList.remove('hide');
    forecastView.classList.add('show');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showLoading() {
    loadingSpinner.classList.add('show');
    weatherDisplay.classList.remove('show');
    hideError();
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
}

function hideSuggestions() {
    citySuggestions.classList.remove('show');
    citySuggestions.innerHTML = '';
}

function showSuggestions(query) {
    if (!query || query.length < 2) {
        hideSuggestions();
        return;
    }

    const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (filtered.length === 0) {
        hideSuggestions();
        return;
    }

    citySuggestions.innerHTML = filtered.map(city => {
        const regex = new RegExp(`(${query})`, 'gi');
        const highlighted = city.replace(regex, '<strong>$1</strong>');
        return `<div class="city-suggestion-item" data-city="${city}">${highlighted}</div>`;
    }).join('');

    citySuggestions.classList.add('show');

    document.querySelectorAll('.city-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const city = item.getAttribute('data-city');
            cityInput.value = city;
            hideSuggestions();
            fetchWeather(city);
        });
    });
}

function updateTemperatureDisplay() {
    if (!currentWeatherData) return;

    const tempCelsius = document.getElementById('tempCelsius');
    const feelsLike = document.getElementById('feelsLike');

    if (isCelsius) {
        tempCelsius.textContent = `${currentWeatherData.temperature.celsius}°C`;
        feelsLike.textContent = `${currentWeatherData.feels_like.celsius}°C`;
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        tempCelsius.textContent = `${currentWeatherData.temperature.fahrenheit}°F`;
        feelsLike.textContent = `${currentWeatherData.feels_like.fahrenheit}°F`;
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
    }
}

function displayWeather(data) {
    currentWeatherData = data;

    document.getElementById('cityName').textContent = data.city;
    document.getElementById('country').textContent = data.country;
    document.getElementById('weatherDescription').textContent = data.description;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} m/s`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;

    updateTemperatureDisplay();

    hideLoading();
    weatherDisplay.classList.add('show');
}

function displayForecast(data) {
    forecastCardsContainer.innerHTML = '';
    forecastCityName.textContent = `7-Day Forecast - ${data.city}`;

    data.forecast.forEach((day, index) => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const tempHigh = isCelsius ? day.temperature.max_celsius : day.temperature.max_fahrenheit;
        const tempLow = isCelsius ? day.temperature.min_celsius : day.temperature.min_fahrenheit;
        const unit = isCelsius ? '°C' : '°F';

        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date-text">${dateStr}</div>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
            <div class="forecast-high">${tempHigh}${unit}</div>
            <div class="forecast-low">${tempLow}${unit}</div>
            <div class="forecast-desc">${day.description}</div>
        `;

        forecastCardsContainer.appendChild(card);
    });

    forecastLoadingSpinner.classList.remove('show');
}

async function fetchWeather(city) {
    if (!city.trim()) {
        showError('Please enter a city name');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }

        displayWeather(data);
    } catch (error) {
        hideLoading();
        showError(error.message || 'Unable to fetch weather data. Please try again.');
    }
}

async function fetchForecast(city) {
    if (!city && !currentWeatherData) {
        showError('Please search for a city first');
        return;
    }

    const searchCity = city || currentWeatherData.city;
    
    showForecastView();
    forecastLoadingSpinner.classList.add('show');

    try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(searchCity)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch forecast data');
        }

        displayForecast(data);
    } catch (error) {
        forecastLoadingSpinner.classList.remove('show');
        showError(error.message || 'Unable to fetch forecast data. Please try again.');
        showCurrentWeatherView();
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    fetchWeather(city);
    hideSuggestions();
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        fetchWeather(city);
        hideSuggestions();
    }
});

cityInput.addEventListener('input', (e) => {
    clearTimeout(suggestionsTimeout);
    suggestionsTimeout = setTimeout(() => {
        showSuggestions(e.target.value);
    }, 300);
});

document.addEventListener('click', (e) => {
    if (!citySuggestions.contains(e.target) && e.target !== cityInput) {
        hideSuggestions();
    }
});

celsiusBtn.addEventListener('click', () => {
    isCelsius = true;
    updateTemperatureDisplay();
    if (forecastView.classList.contains('show') && currentWeatherData) {
        fetchForecast(currentWeatherData.city);
    }
});

fahrenheitBtn.addEventListener('click', () => {
    isCelsius = false;
    updateTemperatureDisplay();
    if (forecastView.classList.contains('show') && currentWeatherData) {
        fetchForecast(currentWeatherData.city);
    }
});

themeToggle.addEventListener('click', toggleTheme);

forecastBtn.addEventListener('click', () => {
    if (currentWeatherData) {
        fetchForecast(currentWeatherData.city);
    }
});

backBtn.addEventListener('click', () => {
    showCurrentWeatherView();
});

initTheme();
fetchWeather('London');
