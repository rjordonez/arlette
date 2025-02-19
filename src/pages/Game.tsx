import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { loadMapsApi, mapStyles } from '../utils/maps';

// Random location generator within reasonable bounds
const getRandomLocation = () => {
  // Exclude extreme latitudes where Street View is rare
  const lat = Math.random() * 140 - 70; // -70 to 70
  const lng = Math.random() * 360 - 180; // -180 to 180
  return { lat, lng };
};

const findValidStreetView = async (
  streetViewService: google.maps.StreetViewService,
  attempts: number = 0
): Promise<google.maps.LatLngLiteral> => {
  if (attempts > 10) {
    // If we can't find a location after 10 attempts, try a new random location
    return findValidStreetView(streetViewService, 0);
  }

  const location = getRandomLocation();
  
  try {
    const result = await new Promise<google.maps.StreetViewPanoramaData>((resolve, reject) => {
      streetViewService.getPanorama({
        location,
        radius: 50000, // 50km radius
        source: google.maps.StreetViewSource.OUTDOOR
      }, (data, status) => {
        if (status === 'OK') resolve(data);
        else reject(status);
      });
    });
    
    return {
      lat: result.location!.latLng!.lat(),
      lng: result.location!.latLng!.lng()
    };
  } catch (error) {
    return findValidStreetView(streetViewService, attempts + 1);
  }
};

export default function Game() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [guessing, setGuessing] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [actualLocation, setActualLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const panorama = useRef<google.maps.StreetViewPanorama | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const actualMarker = useRef<google.maps.Marker | null>(null);
  const line = useRef<google.maps.Polyline | null>(null);
  const streetViewService = useRef<google.maps.StreetViewService | null>(null);

  const handleZoom = (zoomIn: boolean) => {
    if (mapInstance.current) {
      const currentZoom = mapInstance.current.getZoom();
      mapInstance.current.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
    }
  };

  const loadNewLocation = async () => {
    if (!streetViewService.current || !panorama.current) return;
    
    setLoading(true);
    try {
      const location = await findValidStreetView(streetViewService.current);
      setActualLocation(location);
      panorama.current.setPosition(location);
    } catch (error) {
      console.error('Error finding location:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMapsApi.then(() => {
      setMapsLoaded(true);
      if (mapRef.current && streetViewRef.current) {
        // Initialize the map with minimal UI
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          styles: [
            ...mapStyles,
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: false,
        });

        // Initialize Street View with minimal UI
        panorama.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
          position: { lat: 0, lng: 0 },
          pov: {
            heading: Math.random() * 360,
            pitch: 0
          },
          showRoadLabels: false,
          addressControl: false,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false,
          linksControl: true, // Keep this for navigation
          panControl: true,
          enableCloseButton: false,
          zoomControl: false,
        });

        streetViewService.current = new google.maps.StreetViewService();

        // Add click listener to map
        mapInstance.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (guessing && e.latLng) {
            const clickedLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            };
            placeGuessMarker(clickedLocation);
          }
        });

        // Load first location
        loadNewLocation();
      }
    });
  }, []);

  useEffect(() => {
    if (round <= 5 && mapsLoaded) {
      // Reset markers and line
      if (marker.current) marker.current.setMap(null);
      if (actualMarker.current) actualMarker.current.setMap(null);
      if (line.current) line.current.setMap(null);
      
      setSelectedLocation(null);
      setDistance(null);
      setGuessing(true);

      // Reset map view
      if (mapInstance.current) {
        mapInstance.current.setZoom(2);
        mapInstance.current.setCenter({ lat: 0, lng: 0 });
      }

      // Load new location
      loadNewLocation();
    } else if (round > 5) {
      // Game finished, redirect to home after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [round, mapsLoaded, navigate]);

  const placeGuessMarker = (location: google.maps.LatLngLiteral) => {
    if (guessing && mapInstance.current) {
      setSelectedLocation(location);
      
      // Place or update guess marker
      if (marker.current) marker.current.setMap(null);
      marker.current = new google.maps.Marker({
        position: location,
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#4ade80',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#fff',
        },
        draggable: true
      });

      // Update marker position when dragged
      marker.current.addListener('dragend', () => {
        const newPosition = marker.current?.getPosition();
        if (newPosition) {
          setSelectedLocation({
            lat: newPosition.lat(),
            lng: newPosition.lng()
          });
        }
      });
    }
  };

  const submitGuess = () => {
    if (!mapsLoaded || !guessing || !selectedLocation || !actualLocation || !mapInstance.current) {
      return;
    }

    try {
      // Place actual location marker
      actualMarker.current = new google.maps.Marker({
        position: actualLocation,
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#fff',
        }
      });

      // Draw line between guess and actual location
      line.current = new google.maps.Polyline({
        path: [selectedLocation, actualLocation],
        geodesic: true,
        strokeColor: '#ef4444',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: mapInstance.current
      });

      // Calculate distance
      const from = new google.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
      const to = new google.maps.LatLng(actualLocation.lat, actualLocation.lng);
      const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(from, to);
      const distanceInKm = distanceInMeters / 1000;
      setDistance(distanceInKm);
      
      // Calculate score (max 5000 points, lose 2 points per km)
      const points = Math.max(5000 - Math.floor(distanceInKm * 2), 0);
      setScore(score + points);
      setGuessing(false);

      // Fit bounds to show both markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(from);
      bounds.extend(to);
      mapInstance.current.fitBounds(bounds, { padding: 50 });
    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  };

  const nextRound = () => {
    if (round < 5) {
      setRound(round + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/80 backdrop-blur-sm">
        <Link to="/" className="text-[#4ade80] text-2xl font-light flex items-center gap-2">
          <ArrowLeft className="w-6 h-6" />
          Back to Home
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-gray-400">Round {round}/5</div>
          <div className="text-[#4ade80]">Score: {score}</div>
        </div>
      </nav>

      {/* Game Area */}
      <div className="pt-16 h-screen flex flex-col lg:flex-row">
        {/* Street View */}
        <div ref={streetViewRef} className="h-1/2 lg:h-full lg:flex-1"></div>
        
        {/* Map */}
        <div className="h-1/2 lg:h-full lg:flex-1 relative">
          <div ref={mapRef} className="h-full"></div>
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-[#4ade80] text-xl">Finding location...</div>
            </div>
          )}
          
          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(true)}
              className="bg-black p-2 rounded-lg border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleZoom(false)}
              className="bg-black p-2 rounded-lg border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Game Controls */}
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-4">
            {distance !== null && (
              <div className="bg-black/80 px-4 py-2 rounded-lg text-[#4ade80]">
                Distance: {Math.round(distance).toLocaleString()} km
              </div>
            )}
            {guessing ? (
              selectedLocation && (
                <button
                  onClick={submitGuess}
                  className="bg-[#4ade80] text-black px-8 py-3 rounded-full hover:bg-[#22c55e] transition-colors font-medium"
                >
                  Submit Guess
                </button>
              )
            ) : (
              round === 5 ? (
                <div className="text-[#4ade80] text-xl">
                  Game Complete! Redirecting...
                </div>
              ) : (
                <button
                  onClick={nextRound}
                  className="bg-[#4ade80] text-black px-8 py-3 rounded-full hover:bg-[#22c55e] transition-colors font-medium"
                >
                  Next Round
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}