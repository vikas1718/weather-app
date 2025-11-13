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

@app.route('/style.css')
def styles():
    return app.send_static_file('style.css')

@app.route('/script.js')
def scripts():
    return app.send_static_file('script.js')

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

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city')
    
    if not city:
        return jsonify({'error': 'City name is required'}), 400
    
    if not OPENWEATHER_API_KEY:
        return jsonify({'error': 'API key not configured'}), 500
    
    try:
        url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=40'
        response = requests.get(url, timeout=10)
        
        if response.status_code == 404:
            return jsonify({'error': 'City not found'}), 404
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch forecast data'}), response.status_code
        
        data = response.json()
        
        daily_forecasts = {}
        for item in data['list']:
            date = item['dt_txt'].split(' ')[0]
            
            if date not in daily_forecasts:
                daily_forecasts[date] = {
                    'temps': [],
                    'descriptions': [],
                    'icons': []
                }
            
            daily_forecasts[date]['temps'].append(item['main']['temp'])
            daily_forecasts[date]['descriptions'].append(item['weather'][0]['description'])
            daily_forecasts[date]['icons'].append(item['weather'][0]['icon'])
        
        forecast_list = []
        for date, values in sorted(daily_forecasts.items())[:7]:
            max_temp = max(values['temps'])
            min_temp = min(values['temps'])
            
            most_common_desc = max(set(values['descriptions']), key=values['descriptions'].count)
            most_common_icon = max(set(values['icons']), key=values['icons'].count)
            
            forecast_list.append({
                'date': date,
                'temperature': {
                    'max_celsius': round(max_temp, 1),
                    'min_celsius': round(min_temp, 1),
                    'max_fahrenheit': round((max_temp * 9/5) + 32, 1),
                    'min_fahrenheit': round((min_temp * 9/5) + 32, 1)
                },
                'description': most_common_desc.title(),
                'icon': most_common_icon
            })
        
        return jsonify({
            'city': data['city']['name'],
            'country': data['city']['country'],
            'forecast': forecast_list
        }), 200
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout'}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to connect to weather service'}), 503
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
