// Configuration file for API keys and settings
// In production, these should be loaded from environment variables or secure storage

const CONFIG = {
    // API Keys - Replace with actual keys
    OPENAI_API_KEY: 'your_openai_api_key',
    GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key',
    OPENWEATHER_API_KEY: 'your_openweather_api_key',
    UBER_API_KEY: 'your_uber_api_key',
    OLA_API_KEY: 'your_ola_api_key',
    
    // Hotel Configuration
    HOTEL: {
        name: 'Grand Palace Hotel',
        latitude: 28.6139,
        longitude: 77.2090,
        address: '123 Main Street, New Delhi, India',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        phone: '+91 11 1234 5678',
        email: 'concierge@grandpalacehotel.com'
    },
    
    // OpenAI Configuration
    OPENAI: {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 500,
        temperature: 0.7
    },
    
    // Weather API Configuration
    WEATHER: {
        apiUrl: 'https://api.openweathermap.org/data/2.5',
        units: 'metric'
    },
    
    // Google Maps Configuration
    MAPS: {
        defaultZoom: 15,
        center: { lat: 28.6139, lng: 77.2090 }
    },
    
    // Application Settings
    APP: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'hi'],
        voiceLanguages: {
            'en': 'en-US',
            'hi': 'hi-IN'
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}