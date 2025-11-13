const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherDisplay = document.getElementById('weatherDisplay');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');

let currentWeatherData = null;
let isCelsius = true;

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

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        fetchWeather(city);
    }
});

celsiusBtn.addEventListener('click', () => {
    isCelsius = true;
    updateTemperatureDisplay();
});

fahrenheitBtn.addEventListener('click', () => {
    isCelsius = false;
    updateTemperatureDisplay();
});

fetchWeather('London');
