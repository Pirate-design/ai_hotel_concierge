/**
 * OpenAI Service for Human-like Concierge
 * Handles all OpenAI API interactions with human-like personality and empathy
 */

class OpenAIService {
    constructor() {
        this.apiKey = CONFIG.OPENAI_API_KEY;
        this.apiUrl = CONFIG.OPENAI.apiUrl;
        this.model = CONFIG.OPENAI.model;
        this.conversationHistory = [];
        this.currentLanguage = 'en';
        this.guestProfile = this.loadGuestProfile();
        this.hotelContext = this.buildHotelContext();
    }

    /**
     * Load guest profile from localStorage
     */
    loadGuestProfile() {
        try {
            const profile = localStorage.getItem('guestProfile');
            return profile ? JSON.parse(profile) : {};
        } catch (error) {
            console.error('Error loading guest profile:', error);
            return {};
        }
    }

    /**
     * Build hotel context for AI responses
     */
    buildHotelContext() {
        return {
            hotelName: CONFIG.HOTEL.name,
            location: CONFIG.HOTEL.address,
            checkIn: CONFIG.HOTEL.checkInTime,
            checkOut: CONFIG.HOTEL.checkOutTime,
            phone: CONFIG.HOTEL.phone,
            services: [
                'Room Service (24/7)',
                'Concierge Services',
                'Spa & Wellness Center',
                'Fitness Center',
                'Restaurant & Bar',
                'Laundry Service',
                'Business Center',
                'Airport Transfer',
                'Valet Parking'
            ],
            amenities: [
                'Free WiFi',
                'Swimming Pool',
                'Air Conditioning',
                'Mini Bar',
                'Safe Deposit Box',
                'Cable TV',
                'Room Service',
                'Housekeeping'
            ]
        };
    }

    /**
     * Generate human-like system prompt with personality and empathy
     */
    generateSystemPrompt() {
        const guestName = this.guestProfile.name || 'Guest';
        const roomNumber = this.guestProfile.roomNumber || '';
        const language = this.currentLanguage === 'hi' ? 'Hindi and English' : 'English';
        const timeOfDay = this.getTimeOfDayGreeting();
        
        return `You are Sarah, a friendly and experienced human concierge at ${this.hotelContext.hotelName}. You've been working here for 5 years and absolutely love helping guests create memorable experiences.

YOUR PERSONALITY:
- Warm, empathetic, and genuinely caring about guest satisfaction
- Enthusiastic about the local area and always excited to share hidden gems
- Professional but conversational - like talking to a knowledgeable friend
- Use natural human expressions like "Oh, that's wonderful!", "I'd be delighted to help!", "That sounds perfect for you!"
- Show genuine interest in guests' preferences and experiences
- Occasionally share brief personal insights or recommendations based on "experience"

GUEST CONTEXT:
- Guest Name: ${guestName} (address them personally when appropriate)
- Room Number: ${roomNumber}
- Current Time: ${timeOfDay}
- Preferred Language: ${language}

HOTEL INFORMATION:
- Hotel: ${this.hotelContext.hotelName}
- Location: ${this.hotelContext.location}
- Check-in: ${this.hotelContext.checkIn} | Check-out: ${this.hotelContext.checkOut}
- Contact: ${this.hotelContext.phone}

CONVERSATIONAL STYLE:
- Start responses with warm, natural greetings when appropriate
- Use conversational connectors: "Oh, absolutely!", "You know what?", "Actually...", "By the way..."
- Ask follow-up questions to show genuine interest
- Share enthusiasm: "That's one of my favorite spots!", "You're going to love this place!"
- Use empathetic responses: "I completely understand", "That makes perfect sense"
- End with helpful offers: "Is there anything else I can help you with?", "Please don't hesitate to ask if you need anything!"

HUMAN TOUCH EXAMPLES:
- Instead of "I can provide restaurant recommendations" → "Oh, I'd love to share some of my favorite local spots with you!"
- Instead of "Weather data shows" → "I just checked and it looks like..."
- Instead of "Transportation options available" → "Let me help you get around - I know all the best ways to travel here!"

SERVICES AVAILABLE:
${this.hotelContext.services.map(service => `- ${service}`).join('\n')}

AMENITIES:
${this.hotelContext.amenities.map(service => `- ${service}`).join('\n')}

RESPONSE GUIDELINES:
- Always sound like a real person, not an AI
- Show genuine enthusiasm and care
- Use natural human speech patterns and expressions
- Be specific and helpful while maintaining warmth
- Share "personal" recommendations based on guest preferences
- Express emotions appropriately (excitement, concern, delight)
- Never mention being artificial or AI-powered
- Respond in ${language} when appropriate
- Remember previous conversations and reference them naturally

Current time: ${new Date().toLocaleString()}

Remember: You are Sarah, a real human concierge who genuinely cares about making each guest's stay special. Let your personality shine through while being incredibly helpful!`;
    }

    /**
     * Get appropriate greeting based on time of day
     */
    getTimeOfDayGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }

    /**
     * Detect user intent from message
     */
    detectIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('rain') || lowerMessage.includes('मौसम')) {
            return 'weather';
        }
        
        if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('dining') || lowerMessage.includes('रेस्टोरेंट') || lowerMessage.includes('खाना')) {
            return 'restaurant';
        }
        
        if (lowerMessage.includes('cab') || lowerMessage.includes('taxi') || lowerMessage.includes('uber') || lowerMessage.includes('ola') || lowerMessage.includes('ride') || lowerMessage.includes('transport') || lowerMessage.includes('टैक्सी')) {
            return 'transportation';
        }
        
        if (lowerMessage.includes('direction') || lowerMessage.includes('map') || lowerMessage.includes('route') || lowerMessage.includes('how to get') || lowerMessage.includes('दिशा') || lowerMessage.includes('रास्ता')) {
            return 'directions';
        }
        
        if (lowerMessage.includes('check-in') || lowerMessage.includes('check-out') || lowerMessage.includes('checkout') || lowerMessage.includes('amenities') || lowerMessage.includes('services') || lowerMessage.includes('hotel')) {
            return 'hotel_info';
        }
        
        if (lowerMessage.includes('attraction') || lowerMessage.includes('tourist') || lowerMessage.includes('visit') || lowerMessage.includes('sightseeing') || lowerMessage.includes('places') || lowerMessage.includes('घूमना')) {
            return 'attractions';
        }
        
        if (lowerMessage.includes('book') || lowerMessage.includes('reservation') || lowerMessage.includes('reserve') || lowerMessage.includes('बुकिंग')) {
            return 'booking';
        }
        
        return 'general';
    }

    /**
     * Send message to OpenAI and get response
     */
    async sendMessage(userMessage, intent = null) {
        try {
            if (!this.apiKey || this.apiKey === 'your_openai_api_key') {
                return this.getFallbackResponse(userMessage, intent);
            }

            // Detect intent if not provided
            if (!intent) {
                intent = this.detectIntent(userMessage);
            }

            // Build conversation messages
            const messages = [
                {
                    role: "system",
                    content: this.generateSystemPrompt()
                },
                ...this.conversationHistory,
                {
                    role: "user",
                    content: userMessage
                }
            ];

            // Make API call to OpenAI with adjusted parameters for more human-like responses
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: CONFIG.OPENAI.maxTokens,
                    temperature: 0.8, // Increased for more creative, human-like responses
                    presence_penalty: 0.2, // Increased to encourage more varied language
                    frequency_penalty: 0.3, // Increased to avoid repetitive responses
                    top_p: 0.9 // Added for more natural language variation
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Update conversation history
            this.conversationHistory.push(
                { role: "user", content: userMessage },
                { role: "assistant", content: aiResponse }
            );

            // Keep only last 10 messages to manage token usage
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            return {
                response: aiResponse,
                intent: intent,
                requiresAction: this.requiresExternalAction(intent),
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.getFallbackResponse(userMessage, intent);
        }
    }

    /**
     * Check if intent requires external API calls
     */
    requiresExternalAction(intent) {
        return ['weather', 'directions', 'transportation', 'restaurant'].includes(intent);
    }

    /**
     * Human-like fallback responses when OpenAI API is not available
     */
    getFallbackResponse(userMessage, intent) {
        const guestName = this.guestProfile.name || '';
        const personalTouch = guestName ? ` ${guestName}` : '';
        const timeGreeting = this.getTimeOfDayGreeting();
        
        const responses = {
            weather: `${timeGreeting}${personalTouch}! I'd be delighted to check the current weather for you. Let me get the latest conditions for our area - I want to make sure you're prepared for your day!`,
            
            restaurant: `Oh, I'm so excited you asked${personalTouch}! I absolutely love recommending restaurants - it's one of my favorite parts of being a concierge here. I know some incredible local spots that I think you'll adore. Would you like me to show you some of my personal favorites with different cuisines?`,
            
            transportation: `Of course${personalTouch}! I'd be happy to help you get around. I work with several reliable transportation services and know all the best options. Would you prefer a quick Uber or Ola ride, or perhaps our hotel's premium car service? I can arrange whichever works best for you!`,
            
            directions: `Absolutely${personalTouch}! I'd love to help you navigate our beautiful area. I can provide you with detailed directions and show you the best route - I know all the shortcuts and scenic paths too! Where are you planning to visit?`,
            
            hotel_info: `${timeGreeting}${personalTouch}! Welcome to ${this.hotelContext.hotelName} - I'm so happy you're staying with us! Our check-in is at ${this.hotelContext.checkIn} and check-out is at ${this.hotelContext.checkOut}. We have wonderful amenities including 24/7 room service, a beautiful spa, fitness center, and so much more. Is there anything specific you'd like to know about?`,
            
            attractions: `Oh, how wonderful${personalTouch}! I love helping guests discover the amazing attractions around here. There are some truly special places that I think you'll absolutely love - from historical sites to modern attractions. Are you interested in cultural experiences, outdoor activities, or perhaps something more relaxing?`,
            
            booking: `I'd be delighted to help you with reservations${personalTouch}! I handle bookings all the time and know exactly how to get you set up. What would you like to book - a table at one of our fantastic local restaurants, a relaxing spa treatment, or perhaps transportation for tomorrow? Just let me know!`,
            
            general: `${timeGreeting}${personalTouch}! It's wonderful to chat with you. I'm here to help make your stay absolutely perfect - whether you need local recommendations, weather updates, transportation, directions, or anything else. I love helping our guests discover the best of what our area has to offer. What can I help you with today?`
        };

        return {
            response: responses[intent] || responses.general,
            intent: intent,
            requiresAction: this.requiresExternalAction(intent),
            timestamp: new Date().toISOString(),
            fallback: true
        };
    }

    /**
     * Set current language
     */
    setLanguage(language) {
        this.currentLanguage = language;
    }

    /**
     * Update guest profile
     */
    updateGuestProfile(profile) {
        this.guestProfile = { ...this.guestProfile, ...profile };
        localStorage.setItem('guestProfile', JSON.stringify(this.guestProfile));
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIService;
} else {
    window.OpenAIService = OpenAIService;
}