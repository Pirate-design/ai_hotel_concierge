# AI Hotel Concierge - Hackathon Project

## 🏨 Project Overview

An AI-powered concierge assistant for hotels that provides voice and text-based interactions to help guests with:

- **Hotel FAQs** - Check-in/out times, amenities, services
- **Local Recommendations** - Restaurants, attractions, activities  
- **Weather Updates** - Current weather and forecasts
- **Transportation Booking** - Cab/ride services (Uber, Ola)
- **Maps & Directions** - Turn-by-turn navigation with Google Maps
- **Multilingual Support** - English and Hindi
- **Voice Interface** - Speech-to-text and text-to-speech

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind), Vanilla JavaScript
- **AI**: OpenAI GPT-3.5-turbo API
- **Maps**: Google Maps API (Places, Directions)
- **Weather**: OpenWeatherMap API
- **Transportation**: Uber/Ola APIs
- **Voice**: Web Speech API
- **Build**: npm scripts with Tailwind CLI

## 📁 Project Structure

```
├── css/
│   ├── main.css (generated)
│   └── tailwind.css (source)
├── pages/
│   ├── ai_concierge_chat_dashboard.html
│   ├── local_recommendations_booking_hub.html
│   ├── transportation_weather_services.html
│   ├── hotel_services_guest_support.html
│   └── guest_authentication_profile_setup.html
├── public/
│   ├── js/
│   │   ├── config.js
│   │   ├── openai-service.js
│   │   ├── weather-service.js
│   │   └── maps-service.js
│   ├── favicon.ico
│   ├── manifest.json
│   └── dhws-data-injector.js
├── index.html
├── package.json
├── tailwind.config.js
└── .env
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Google Maps API Configuration  
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Weather API Configuration
OPENWEATHER_API_KEY=your_openweather_api_key

# Transportation APIs
UBER_API_KEY=your_uber_api_key
OLA_API_KEY=your_ola_api_key
```

### 3. Update Configuration

Edit `public/js/config.js` with your actual API keys:

```javascript
const CONFIG = {
    OPENAI_API_KEY: 'your_openai_api_key',
    GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key',
    OPENWEATHER_API_KEY: 'your_openweather_api_key',
    // ... other configurations
};
```

### 4. Build CSS

```bash
npm run build:css
```

### 5. Start Development Server

```bash
npm run dev
```

or

```bash
npm start
```

## 🔑 API Keys Setup Guide

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key to your `.env` file

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Maps JavaScript API, Places API, and Directions API
4. Create credentials (API Key)
5. Copy the key to your `.env` file

### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate API key from dashboard
4. Copy the key to your `.env` file

## 🎯 Core Features

### 1. AI Chat Interface
- Real-time conversation with OpenAI GPT-3.5
- Intent detection for personalized responses
- Context-aware responses with hotel information
- Conversation history management

### 2. Voice Interaction
- Speech-to-text using Web Speech API
- Multilingual support (English/Hindi)
- Real-time transcription with confidence levels
- Voice command processing

### 3. Weather Integration
- Current weather conditions
- 5-day weather forecast
- Location-based weather data
- Weather cards in chat interface

### 4. Maps & Directions
- Google Maps integration
- Turn-by-turn directions from hotel
- Places search and recommendations
- Interactive map with markers

### 5. Transportation Services
- Uber/Ola integration
- Price estimates and booking
- Hotel car service options
- Real-time availability

## 📱 Demo Flow

### Example Interaction:

**Guest**: "Can you book me a cab to the airport at 5 PM and also show me directions?"

**AI Response**: 
1. Processes request using OpenAI
2. Shows transportation options (Uber/Ola)
3. Displays route map with directions
4. Provides booking interface

**Output**: 
- Voice response: "Your cab options are available. Here's the route to the airport."
- Visual: Map with route + booking cards
- Actions: Direct booking links

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Build CSS (production)
npm run build:css

# Watch CSS changes (development)
npm run watch:css

# Start development server
npm run dev

# Serve with Python
npm run serve
```

## 🌐 Browser Support

- **Voice Recognition**: Chrome, Edge, Safari (latest)
- **Web APIs**: Modern browsers with ES6+ support
- **Maps**: All browsers with JavaScript enabled
- **Responsive**: Mobile-first design

## 🔒 Security Considerations

- API keys should be stored securely (not in frontend)
- Implement rate limiting for API calls
- Sanitize user inputs before processing
- Use HTTPS in production
- Implement proper CORS policies

## 🚀 Deployment

### Production Setup:
1. Move API keys to server-side environment
2. Implement backend proxy for API calls
3. Enable HTTPS
4. Configure CDN for static assets
5. Set up monitoring and analytics

### Recommended Hosting:
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Node.js on Heroku, AWS Lambda
- **Database**: Firebase, Supabase (if user data storage needed)

## 📈 Performance Optimizations

- Lazy loading of Google Maps API
- Image optimization and WebP support
- CSS and JS minification
- Service worker for offline functionality
- Response caching for weather/places data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Deliverables

- ✅ Working prototype with chat + voice interface
- ✅ Map rendering for directions
- ✅ Personalized responses using guest profile
- ✅ Real-time weather integration
- ✅ Transportation booking interface
- ✅ Multilingual support (EN/HI)
- ✅ Responsive design for mobile/desktop

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Contact: concierge@grandpalacehotel.com
- Demo: [Live Demo Link]

---

Built with ❤️ for the Hotel Tech Hackathon 2025