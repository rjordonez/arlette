import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useBalloonStore } from '../store';
import { Ruler, Gauge, Bomb, ArrowLeft, Maximize2, Minimize2, Plus, Minus } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD5lLAFNc7f79MaXpHpXq1R3HBrESJ0IQI';

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{"color": "#1d2c4d"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#8ec3b9"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#1a3646"}]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#4b6878"}]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#4b6878"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#0e1626"}]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#4e6d70"}]
  }
];

interface AnimationInfo {
  altitude: number;
  distanceTraveled: number;
  timeElapsed: number;
  currentSpeed: number;
  landingLocation: google.maps.LatLngLiteral | null;
}

export function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<Record<string, google.maps.Marker>>({});
  const trajectoryLines = useRef<Record<string, google.maps.Polyline>>({});
  const landingMarkers = useRef<Record<string, google.maps.Marker>>({});
  const streetViewService = useRef<google.maps.StreetViewService | null>(null);
  const panorama = useRef<google.maps.StreetViewPanorama | null>(null);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [animationInfo, setAnimationInfo] = useState<AnimationInfo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStreetView, setIsStreetView] = useState(false);
  
  const { 
    balloons, 
    selectedBalloonId,
    animatingBalloonId,
    setSelectedBalloonId,
    setAnimatingBalloonId 
  } = useBalloonStore();

  const handleZoom = (zoomIn: boolean) => {
    if (mapInstance.current) {
      const currentZoom = mapInstance.current.getZoom();
      mapInstance.current.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const showBalloonInfo = (balloon: any) => {
    if (!mapInstance.current || !infoWindow.current) return;

    const position = { lat: balloon.latitude, lng: balloon.longitude };
    const content = `
      <div class="p-4 min-w-[200px]">
        <div class="font-bold text-lg mb-3">${balloon.name}</div>
        <div class="grid gap-2">
          <div class="flex items-center gap-2">
            <svg class="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 22h20"/>
              <path d="M12 2v20"/>
              <path d="M2 2h20"/>
            </svg>
            <span>Altitude: ${Math.round(balloon.altitude).toLocaleString()}ft</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="8"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
            <span>Speed: ${Math.round(balloon.speed)}mph</span>
          </div>
          <button
            onclick="window.startBalloonAnimation('${balloon.id}')"
            class="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11.35 5.65A3 3 0 0 0 8 8"/>
              <path d="M15.46 3.05A8 8 0 0 0 3.05 15.46l4.6 4.6A12.11 12.11 0 0 0 15 22a8 8 0 0 0 4.94-1.69"/>
              <path d="M15 9h.01"/>
            </svg>
            Pop Balloon
          </button>
        </div>
      </div>
    `;
    
    infoWindow.current.setContent(content);
    infoWindow.current.setPosition(position);
    infoWindow.current.open(mapInstance.current);
  };

  const calculateLandingPoint = (balloon: any) => {
    const R = 6371e3;
    const d = balloon.speed * 3600;
    const δ = d / R;
    const θ = balloon.direction * Math.PI / 180;
    const φ1 = balloon.latitude * Math.PI / 180;
    const λ1 = balloon.longitude * Math.PI / 180;
    
    const φ2 = Math.asin(
      Math.sin(φ1) * Math.cos(δ) +
      Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
    );
    
    const λ2 = λ1 + Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );
    
    return {
      lat: φ2 * 180 / Math.PI,
      lng: λ2 * 180 / Math.PI
    };
  };

  const findNearestStreetView = async (location: google.maps.LatLngLiteral, radius: number = 50) => {
    if (!streetViewService.current) return null;

    try {
      const result = await new Promise<google.maps.StreetViewPanoramaData>((resolve, reject) => {
        streetViewService.current!.getPanorama({
          location,
          radius,
          source: google.maps.StreetViewSource.OUTDOOR
        }, (data, status) => {
          if (status === 'OK') resolve(data);
          else reject(status);
        });
      });
      return result.location!;
    } catch (error) {
      if (radius < 5000) {
        return findNearestStreetView(location, radius * 2);
      }
      return null;
    }
  };

  const showStreetView = async (location: google.maps.LatLngLiteral, direction: number) => {
    try {
      const nearestLocation = await findNearestStreetView(location);
      
      if (nearestLocation && mapInstance.current && mapRef.current) {
        setIsStreetView(true);
        panorama.current = new google.maps.StreetViewPanorama(
          mapRef.current,
          {
            position: nearestLocation.latLng!,
            pov: {
              heading: direction,
              pitch: 0,
            },
            zoom: 1,
            fullscreenControl: false,
          }
        );
        mapInstance.current.setStreetView(panorama.current);
        
        // Create and show custom back button
        const backButton = document.createElement('button');
        backButton.className = 'custom-map-button';
        backButton.innerHTML = `
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Map
          </div>
        `;
        backButton.onclick = exitStreetView;
        mapRef.current.appendChild(backButton);
      }
    } catch (error) {
      console.error('Could not find street view:', error);
    }
  };

  const exitStreetView = () => {
    if (mapInstance.current && panorama.current) {
      setIsStreetView(false);
      panorama.current.setVisible(false);
      mapInstance.current.setStreetView(null);
      
      // Remove custom back button
      const backButton = mapRef.current?.querySelector('.custom-map-button');
      if (backButton) {
        backButton.remove();
      }
    }
  };

  const animateBalloonPop = async (balloon: any) => {
    if (!mapInstance.current) return;

    const startPosition = { lat: balloon.latitude, lng: balloon.longitude };
    const landingPoint = calculateLandingPoint(balloon);
    const steps = 100;
    const duration = 5000;
    const stepDuration = duration / steps;

    const totalDistance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(startPosition),
      new google.maps.LatLng(landingPoint)
    );

    if (!infoWindow.current) {
      infoWindow.current = new google.maps.InfoWindow();
    }

    const animationMarker = new google.maps.Marker({
      position: startPosition,
      map: mapInstance.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#ef4444',
        fillOpacity: 0.9,
        strokeWeight: 2,
        strokeColor: '#fff',
      },
    });

    const updateInfoWindow = (position: google.maps.LatLngLiteral, metrics: any) => {
      const content = `
        <div class="p-4 min-w-[200px]">
          <div class="font-bold text-lg mb-3">${balloon.name}</div>
          <div class="grid gap-2">
            <div class="flex items-center gap-2">
              <svg class="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 22h20"/>
                <path d="M12 2v20"/>
                <path d="M2 2h20"/>
              </svg>
              <span>Altitude: ${Math.round(metrics.altitude).toLocaleString()}ft</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Distance: ${Math.round(metrics.distanceTraveled / 1000).toLocaleString()}km</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="8"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
              <span>Speed: ${Math.round(metrics.currentSpeed)}mph</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Time: ${metrics.timeElapsed.toFixed(1)}s</span>
            </div>
            ${metrics.landingLocation ? `
              <button
                onclick="window.viewLandingLocation(${metrics.landingLocation.lat}, ${metrics.landingLocation.lng}, ${balloon.direction})"
                class="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Landing Location
              </button>
            ` : ''}
          </div>
        </div>
      `;
      
      infoWindow.current!.setContent(content);
      infoWindow.current!.setPosition(position);
      infoWindow.current!.open(mapInstance.current!);
    };

    // Add global function for the view button
    (window as any).viewLandingLocation = (lat: number, lng: number, direction: number) => {
      showStreetView({ lat, lng }, direction);
    };

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const lat = startPosition.lat + (landingPoint.lat - startPosition.lat) * progress;
      const lng = startPosition.lng + (landingPoint.lng - startPosition.lng) * progress;
      
      const currentPosition = { lat, lng };
      const distanceTraveled = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(startPosition),
        new google.maps.LatLng(currentPosition)
      );
      
      const currentAltitude = balloon.altitude * (1 - Math.pow(progress, 0.5));
      const currentSpeed = balloon.speed * (1 - progress * 0.7);
      const timeElapsed = (progress * duration) / 1000;

      const metrics = {
        altitude: currentAltitude,
        distanceTraveled,
        timeElapsed,
        currentSpeed,
        landingLocation: i === steps ? landingPoint : null
      };

      setAnimationInfo(metrics);
      updateInfoWindow(currentPosition, metrics);
      
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      animationMarker.setPosition(currentPosition);
      
      if (mapInstance.current) {
        mapInstance.current.panTo(currentPosition);
      }
    }

    animationMarker.setMap(null);
    setAnimationInfo(null);
    setAnimatingBalloonId(null);
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['geometry'],
    });

    loader.load().then(() => {
      if (mapRef.current && !mapInstance.current) {
        const bounds = {
          north: 85,
          south: -85,
          east: 180,
          west: -180,
        };

        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
          styles: mapStyles,
          restriction: {
            latLngBounds: bounds,
            strictBounds: true,
          },
          minZoom: 3,
          maxZoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          mapTypeId: 'terrain'
        });

        streetViewService.current = new google.maps.StreetViewService();
        infoWindow.current = new google.maps.InfoWindow();

        // Show initial balloon info
        const firstBalloon = balloons[0];
        if (firstBalloon) {
          setSelectedBalloonId(firstBalloon.id);
          showBalloonInfo(firstBalloon);
        }

        // Add global function for the pop balloon button
        (window as any).startBalloonAnimation = (balloonId: string) => {
          setAnimatingBalloonId(balloonId);
          if (infoWindow.current) {
            infoWindow.current.close();
          }
        };
      }
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    balloons.forEach((balloon) => {
      const position = { lat: balloon.latitude, lng: balloon.longitude };
      const landingPoint = calculateLandingPoint(balloon);
      
      if (!markers.current[balloon.id]) {
        markers.current[balloon.id] = new google.maps.Marker({
          position,
          map: mapInstance.current,
          title: balloon.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: selectedBalloonId === balloon.id ? '#22c55e' : '#3b82f6',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#fff',
          },
        });

        markers.current[balloon.id].addListener('click', () => {
          setSelectedBalloonId(balloon.id);
          showBalloonInfo(balloon);
          if (mapInstance.current) {
            mapInstance.current.panTo(position);
            mapInstance.current.setZoom(6);
          }
        });
      } else {
        markers.current[balloon.id].setPosition(position);
        markers.current[balloon.id].setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: selectedBalloonId === balloon.id ? '#22c55e' : '#3b82f6',
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#fff',
        });
      }

      if (!landingMarkers.current[balloon.id]) {
        landingMarkers.current[balloon.id] = new google.maps.Marker({
          position: landingPoint,
          map: mapInstance.current,
          title: `${balloon.name} Landing Point`,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#ef4444',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#fff',
            rotation: balloon.direction,
          },
        });

        trajectoryLines.current[balloon.id] = new google.maps.Polyline({
          path: [position, landingPoint],
          geodesic: true,
          strokeColor: '#ef4444',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          map: mapInstance.current,
        });
      } else {
        landingMarkers.current[balloon.id].setPosition(landingPoint);
        landingMarkers.current[balloon.id].setIcon({
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#ef4444',
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#fff',
          rotation: balloon.direction,
        });
        trajectoryLines.current[balloon.id].setPath([position, landingPoint]);
      }
    });

    if (selectedBalloonId) {
      const selectedBalloon = balloons.find(b => b.id === selectedBalloonId);
      if (selectedBalloon && mapInstance.current) {
        mapInstance.current.panTo({ 
          lat: selectedBalloon.latitude, 
          lng: selectedBalloon.longitude 
        });
        mapInstance.current.setZoom(6);
      }
    }
  }, [balloons, selectedBalloonId]);

  useEffect(() => {
    if (animatingBalloonId) {
      const balloon = balloons.find(b => b.id === animatingBalloonId);
      if (balloon) {
        animateBalloonPop(balloon);
      }
    }
  }, [animatingBalloonId, balloons]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-[calc(100vh-11rem)] rounded-lg overflow-hidden" />
      {!isStreetView && (
        <>
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10 bg-black p-2 rounded-lg border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
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
        </>
      )}
    </div>
  );
}