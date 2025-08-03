/**
 * Google Maps Service for AI Concierge
 * Handles maps, directions, and places functionality
 */

class MapsService {
    constructor() {
        this.apiKey = CONFIG.GOOGLE_MAPS_API_KEY;
        this.hotelLocation = {
            lat: CONFIG.HOTEL.latitude,
            lng: CONFIG.HOTEL.longitude
        };
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.placesService = null;
        this.geocoder = null;
    }

    /**
     * Initialize Google Maps
     */
    async initializeMap(mapElementId) {
        try {
            if (!window.google || !window.google.maps) {
                await this.loadGoogleMapsAPI();
            }

            const mapElement = document.getElementById(mapElementId);
            if (!mapElement) {
                throw new Error(`Map element with ID '${mapElementId}' not found`);
            }

            // Initialize map
            this.map = new google.maps.Map(mapElement, {
                zoom: CONFIG.MAPS.defaultZoom,
                center: this.hotelLocation,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                styles: this.getMapStyles()
            });

            // Initialize services
            this.directionsService = new google.maps.DirectionsService();
            this.directionsRenderer = new google.maps.DirectionsRenderer({
                draggable: true,
                panel: null
            });
            this.directionsRenderer.setMap(this.map);
            
            this.placesService = new google.maps.places.PlacesService(this.map);
            this.geocoder = new google.maps.Geocoder();

            // Add hotel marker
            this.addHotelMarker();

            return this.map;

        } catch (error) {
            console.error('Error initializing Google Maps:', error);
            return null;
        }
    }

    /**
     * Load Google Maps API dynamically
     */
    async loadGoogleMapsAPI() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry&callback=initGoogleMaps`;
            script.async = true;
            script.defer = true;
            
            window.initGoogleMaps = () => {
                delete window.initGoogleMaps;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google Maps API'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Get custom map styles
     */
    getMapStyles() {
        return [
            {
                featureType: "all",
                elementType: "geometry.fill",
                stylers: [{ weight: "2.00" }]
            },
            {
                featureType: "all",
                elementType: "geometry.stroke",
                stylers: [{ color: "#9c9c9c" }]
            },
            {
                featureType: "all",
                elementType: "labels.text",
                stylers: [{ visibility: "on" }]
            }
        ];
    }

    /**
     * Add hotel marker to map
     */
    addHotelMarker() {
        if (!this.map) return;

        const hotelMarker = new google.maps.Marker({
            position: this.hotelLocation,
            map: this.map,
            title: CONFIG.HOTEL.name,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(32, 32)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="p-2">
                    <h3 class="font-semibold text-primary">${CONFIG.HOTEL.name}</h3>
                    <p class="text-sm text-text-secondary">${CONFIG.HOTEL.address}</p>
                    <p class="text-xs text-text-secondary mt-1">Your Hotel</p>
                </div>
            `
        });

        hotelMarker.addListener('click', () => {
            infoWindow.open(this.map, hotelMarker);
        });
    }

    /**
     * Get directions from hotel to destination
     */
    async getDirections(destination, travelMode = 'DRIVING') {
        try {
            if (!this.directionsService) {
                throw new Error('Directions service not initialized');
            }

            const request = {
                origin: this.hotelLocation,
                destination: destination,
                travelMode: google.maps.TravelMode[travelMode],
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            };

            return new Promise((resolve, reject) => {
                this.directionsService.route(request, (result, status) => {
                    if (status === 'OK') {
                        this.directionsRenderer.setDirections(result);
                        resolve(this.formatDirectionsResult(result));
                    } else {
                        reject(new Error(`Directions request failed: ${status}`));
                    }
                });
            });

        } catch (error) {
            console.error('Error getting directions:', error);
            return this.getMockDirections(destination);
        }
    }

    /**
     * Format directions result
     */
    formatDirectionsResult(result) {
        const route = result.routes[0];
        const leg = route.legs[0];

        return {
            distance: leg.distance.text,
            duration: leg.duration.text,
            startAddress: leg.start_address,
            endAddress: leg.end_address,
            steps: leg.steps.map(step => ({
                instruction: step.instructions.replace(/<[^>]*>/g, ''),
                distance: step.distance.text,
                duration: step.duration.text,
                maneuver: step.maneuver || ''
            })),
            overview: route.overview_polyline,
            bounds: route.bounds,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Search for places near hotel
     */
    async searchNearbyPlaces(query, type = 'restaurant', radius = 5000) {
        try {
            if (!this.placesService) {
                throw new Error('Places service not initialized');
            }

            const request = {
                location: this.hotelLocation,
                radius: radius,
                query: query,
                type: type
            };

            return new Promise((resolve, reject) => {
                this.placesService.textSearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(this.formatPlacesResults(results));
                    } else {
                        reject(new Error(`Places search failed: ${status}`));
                    }
                });
            });

        } catch (error) {
            console.error('Error searching places:', error);
            return this.getMockPlaces(query, type);
        }
    }

    /**
     * Format places search results
     */
    formatPlacesResults(results) {
        return results.slice(0, 10).map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating || 0,
            priceLevel: place.price_level || 0,
            photos: place.photos ? place.photos.map(photo => photo.getUrl({ maxWidth: 400 })) : [],
            types: place.types,
            geometry: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            },
            openingHours: place.opening_hours ? {
                isOpen: place.opening_hours.open_now,
                periods: place.opening_hours.periods
            } : null,
            distance: this.calculateDistance(
                this.hotelLocation.lat,
                this.hotelLocation.lng,
                place.geometry.location.lat(),
                place.geometry.location.lng()
            )
        }));
    }

    /**
     * Calculate distance between two points
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; // Distance in kilometers
        return Math.round(d * 10) / 10;
    }

    /**
     * Convert degrees to radians
     */
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    /**
     * Geocode an address
     */
    async geocodeAddress(address) {
        try {
            if (!this.geocoder) {
                throw new Error('Geocoder service not initialized');
            }

            return new Promise((resolve, reject) => {
                this.geocoder.geocode({ address: address }, (results, status) => {
                    if (status === 'OK') {
                        const location = results[0].geometry.location;
                        resolve({
                            lat: location.lat(),
                            lng: location.lng(),
                            address: results[0].formatted_address
                        });
                    } else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                });
            });

        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    }

    /**
     * Mock directions for fallback
     */
    getMockDirections(destination) {
        return {
            distance: '3.2 km',
            duration: '12 mins',
            startAddress: CONFIG.HOTEL.address,
            endAddress: destination,
            steps: [
                {
                    instruction: 'Head north on Main Street',
                    distance: '500 m',
                    duration: '2 mins',
                    maneuver: 'straight'
                },
                {
                    instruction: 'Turn right onto Park Avenue',
                    distance: '1.2 km',
                    duration: '4 mins',
                    maneuver: 'turn-right'
                },
                {
                    instruction: 'Continue straight for 1.5 km',
                    distance: '1.5 km',
                    duration: '6 mins',
                    maneuver: 'straight'
                }
            ],
            mock: true,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Mock places for fallback
     */
    getMockPlaces(query, type) {
        const mockPlaces = [
            {
                id: 'mock-1',
                name: 'Spice Garden Restaurant',
                address: '123 Park Avenue, New Delhi',
                rating: 4.5,
                priceLevel: 2,
                photos: ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'],
                types: ['restaurant', 'food'],
                geometry: { lat: 28.6149, lng: 77.2100 },
                openingHours: { isOpen: true },
                distance: 0.8
            },
            {
                id: 'mock-2',
                name: 'Dragon Palace',
                address: '456 Central Street, New Delhi',
                rating: 4.2,
                priceLevel: 1,
                photos: ['https://images.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg'],
                types: ['restaurant', 'food'],
                geometry: { lat: 28.6129, lng: 77.2080 },
                openingHours: { isOpen: true },
                distance: 1.2
            }
        ];

        return mockPlaces.filter(place => 
            place.name.toLowerCase().includes(query.toLowerCase()) ||
            place.types.includes(type)
        );
    }

    /**
     * Generate directions card HTML
     */
    generateDirectionsCard(directions) {
        return `
            <div class="directions-card bg-white border border-secondary-200 rounded-lg p-4 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-text-primary">Route Information</h4>
                    <div class="text-right text-sm">
                        <div class="text-primary font-medium">${directions.distance}</div>
                        <div class="text-text-secondary">${directions.duration}</div>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="text-sm">
                        <span class="text-text-secondary">From:</span>
                        <span class="text-text-primary ml-2">${directions.startAddress}</span>
                    </div>
                    <div class="text-sm">
                        <span class="text-text-secondary">To:</span>
                        <span class="text-text-primary ml-2">${directions.endAddress}</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <h5 class="text-sm font-medium text-text-primary">Turn-by-turn directions:</h5>
                    ${directions.steps.slice(0, 3).map((step, index) => `
                        <div class="flex items-start space-x-3 text-sm">
                            <div class="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                                ${index + 1}
                            </div>
                            <div class="flex-1">
                                <p class="text-text-primary">${step.instruction}</p>
                                <p class="text-text-secondary text-xs">${step.distance} • ${step.duration}</p>
                            </div>
                        </div>
                    `).join('')}
                    ${directions.steps.length > 3 ? `
                        <div class="text-xs text-text-secondary text-center pt-2">
                            +${directions.steps.length - 3} more steps
                        </div>
                    ` : ''}
                </div>

                <div class="mt-4 pt-3 border-t border-secondary-200 flex space-x-2">
                    <button class="btn-primary text-sm px-4 py-2 flex-1" onclick="openInGoogleMaps('${directions.endAddress}')">
                        <i class="fas fa-map-marked-alt mr-2"></i>Open in Maps
                    </button>
                    <button class="btn-secondary text-sm px-4 py-2" onclick="shareDirections('${directions.endAddress}')">
                        <i class="fas fa-share mr-2"></i>Share
                    </button>
                </div>
            </div>
        `;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapsService;
} else {
    window.MapsService = MapsService;
}