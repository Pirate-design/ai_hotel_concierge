/**
 * Weather Service for AI Concierge
 * Handles weather API integration with OpenWeatherMap
 */

class WeatherService {
    constructor() {
        this.apiKey = CONFIG.OPENWEATHER_API_KEY;
        this.baseUrl = CONFIG.WEATHER.apiUrl;
        this.units = CONFIG.WEATHER.units;
        this.hotelLocation = {
            lat: CONFIG.HOTEL.latitude,
            lon: CONFIG.HOTEL.longitude
        };
    }

    /**
     * Get current weather data
     */
    async getCurrentWeather(lat = null, lon = null) {
        try {
            const location = lat && lon ? { lat, lon } : this.hotelLocation;
            
            if (!this.apiKey || this.apiKey === 'your_openweather_api_key') {
                return this.getMockWeatherData();
            }

            const url = `${this.baseUrl}/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=${this.units}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            
            return this.formatWeatherData(data);

        } catch (error) {
            console.error('Weather API Error:', error);
            return this.getMockWeatherData();
        }
    }

    /**
     * Get weather forecast for next 5 days
     */
    async getWeatherForecast(lat = null, lon = null) {
        try {
            const location = lat && lon ? { lat, lon } : this.hotelLocation;
            
            if (!this.apiKey || this.apiKey === 'your_openweather_api_key') {
                return this.getMockForecastData();
            }

            const url = `${this.baseUrl}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=${this.units}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            
            return this.formatForecastData(data);

        } catch (error) {
            console.error('Weather API Error:', error);
            return this.getMockForecastData();
        }
    }

    /**
     * Format current weather data
     */
    formatWeatherData(data) {
        return {
            location: data.name,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            main: data.weather[0].main,
            icon: data.weather[0].icon,
            windSpeed: data.wind?.speed || 0,
            visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
            pressure: data.main.pressure,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Format forecast data
     */
    formatForecastData(data) {
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: date,
                    temperatures: [],
                    descriptions: [],
                    icons: [],
                    humidity: [],
                    windSpeed: []
                };
            }
            
            dailyForecasts[date].temperatures.push(item.main.temp);
            dailyForecasts[date].descriptions.push(item.weather[0].description);
            dailyForecasts[date].icons.push(item.weather[0].icon);
            dailyForecasts[date].humidity.push(item.main.humidity);
            dailyForecasts[date].windSpeed.push(item.wind?.speed || 0);
        });

        // Process daily data
        const forecast = Object.values(dailyForecasts).slice(0, 5).map(day => ({
            date: day.date,
            minTemp: Math.round(Math.min(...day.temperatures)),
            maxTemp: Math.round(Math.max(...day.temperatures)),
            description: this.getMostCommonValue(day.descriptions),
            icon: this.getMostCommonValue(day.icons),
            avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            avgWindSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length)
        }));

        return {
            location: data.city.name,
            forecast: forecast,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get most common value from array
     */
    getMostCommonValue(arr) {
        const counts = {};
        arr.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    /**
     * Mock weather data for fallback
     */
    getMockWeatherData() {
        return {
            location: 'New Delhi',
            temperature: 28,
            feelsLike: 31,
            humidity: 65,
            description: 'clear sky',
            main: 'Clear',
            icon: '01d',
            windSpeed: 5,
            visibility: 10,
            pressure: 1013,
            sunrise: '06:30',
            sunset: '18:45',
            timestamp: new Date().toISOString(),
            mock: true
        };
    }

    /**
     * Mock forecast data for fallback
     */
    getMockForecastData() {
        const today = new Date();
        const forecast = [];
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            forecast.push({
                date: date.toDateString(),
                minTemp: 24 + Math.floor(Math.random() * 5),
                maxTemp: 32 + Math.floor(Math.random() * 8),
                description: ['clear sky', 'few clouds', 'scattered clouds', 'partly cloudy'][Math.floor(Math.random() * 4)],
                icon: ['01d', '02d', '03d', '04d'][Math.floor(Math.random() * 4)],
                avgHumidity: 60 + Math.floor(Math.random() * 20),
                avgWindSpeed: 3 + Math.floor(Math.random() * 5)
            });
        }

        return {
            location: 'New Delhi',
            forecast: forecast,
            timestamp: new Date().toISOString(),
            mock: true
        };
    }

    /**
     * Get weather icon URL
     */
    getWeatherIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    /**
     * Generate weather card HTML
     */
    generateWeatherCard(weatherData) {
        const iconUrl = weatherData.mock ? 
            `https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=60&h=60&fit=crop&crop=center` :
            this.getWeatherIconUrl(weatherData.icon);

        return `
            <div class="weather-card">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <img src="${iconUrl}" alt="${weatherData.description}" class="w-12 h-12 rounded-lg object-cover" />
                        <div>
                            <h4 class="font-semibold text-text-primary capitalize">${weatherData.main || weatherData.description}</h4>
                            <p class="text-sm text-text-secondary capitalize">${weatherData.description}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-primary">${weatherData.temperature}°C</div>
                        <div class="text-sm text-text-secondary">Feels like ${weatherData.feelsLike}°C</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-eye text-primary"></i>
                        <span>Visibility: ${weatherData.visibility}km</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-tint text-primary"></i>
                        <span>Humidity: ${weatherData.humidity}%</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-wind text-primary"></i>
                        <span>Wind: ${weatherData.windSpeed} m/s</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-thermometer-half text-primary"></i>
                        <span>Pressure: ${weatherData.pressure} hPa</span>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-secondary-200 flex justify-between text-xs text-text-secondary">
                    <span>Sunrise: ${weatherData.sunrise}</span>
                    <span>Sunset: ${weatherData.sunset}</span>
                </div>
            </div>
        `;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherService;
} else {
    window.WeatherService = WeatherService;
}