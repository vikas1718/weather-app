from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app)

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    
    if not city:
        return jsonify({'error': 'City name is required'}), 400
    
    if not OPENWEATHER_API_KEY:
        return jsonify({'error': 'API key not configured'}), 500
    
    try:
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric'
        response = requests.get(url, timeout=10)
        
        if response.status_code == 404:
            return jsonify({'error': 'City not found'}), 404
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch weather data'}), response.status_code
        
        data = response.json()
        
        weather_data = {
            'city': data['name'],
            'country': data['sys']['country'],
            'temperature': {
                'celsius': round(data['main']['temp'], 1),
                'fahrenheit': round((data['main']['temp'] * 9/5) + 32, 1)
            },
            'feels_like': {
                'celsius': round(data['main']['feels_like'], 1),
                'fahrenheit': round((data['main']['feels_like'] * 9/5) + 32, 1)
            },
            'humidity': data['main']['humidity'],
            'description': data['weather'][0]['description'].title(),
            'icon': data['weather'][0]['icon'],
            'wind_speed': data['wind']['speed'],
            'pressure': data['main']['pressure']
        }
        
        return jsonify(weather_data), 200
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout'}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to connect to weather service'}), 503
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
