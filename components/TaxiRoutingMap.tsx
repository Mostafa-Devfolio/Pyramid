'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, MapPin, Navigation } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const userLocationIcon = L.divIcon({
  className: 'bg-transparent border-0',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
      <div style="position: absolute; width: 100%; height: 100%; background-color: #3b82f6; border-radius: 50%; animation: leaflet-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>
      <div style="position: relative; width: 14px; height: 14px; background-color: #2563eb; border: 2px solid white; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.5);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// --- OPEN SOURCE APIS ---
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar,en&email=support@devfolio.net`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return data.display_name || 'Unknown Location';
  } catch (error) {
    console.error('Geocoding Error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

const searchAddress = async (query: string) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=ar,en&email=support@devfolio.net`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
};

// FIXED: DETERMINISTIC TRAFFIC SIMULATION
const simulateTrafficSegments = (geometry: any[]) => {
  const segments: { positions: any[]; color: string }[] = [];
  let currentSegment: any[] = [];
  let currentColor = '#3b82f6';

  const getTrafficColor = (lat: number, lng: number) => {
    const hash = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
    const rand = hash - Math.floor(hash);
    if (rand < 0.75) return '#3b82f6'; // 75% Clear (Blue)
    if (rand < 0.9) return '#eab308'; // 15% Moderate (Yellow)
    return '#ef4444'; // 10% Heavy (Red)
  };

  geometry.forEach((coord, i) => {
    currentSegment.push(coord);
    if (i > 0 && i % 12 === 0) {
      segments.push({ positions: [...currentSegment], color: currentColor });
      currentSegment = [coord];
      currentColor = getTrafficColor(coord[0], coord[1]);
    }
  });
  if (currentSegment.length > 1) segments.push({ positions: currentSegment, color: currentColor });
  return segments;
};

const getFallbackDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c * 1.3).toFixed(2); 
};

const getRoute = async (pLat: number, pLng: number, dLat: number, dLng: number) => {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
      const geometry = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
      return { distanceKm, geometry };
    }
  } catch (error) {}
  return { distanceKm: null, geometry: [] };
};

const MapEvents = ({ onMapClick, readOnly }: any) => {
  useMapEvents({
    click: (e) => {
      if (!readOnly) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapController = ({ pickup, destination, routeGeometry, currentLocation, readOnly }: any) => {
  const map = useMap();

  useEffect(() => {
    if (routeGeometry && routeGeometry.length > 0) {
      map.fitBounds(routeGeometry, { padding: [50, 50], animate: true, maxZoom: 16 });
    } else if (pickup?.lat && pickup?.lng && !destination?.lat) {
      map.flyTo([pickup.lat, pickup.lng], 16, { animate: true });
    } else if (destination?.lat && destination?.lng && !pickup?.lat) {
      map.flyTo([destination.lat, destination.lng], 16, { animate: true });
    }
  }, [routeGeometry, pickup, destination, map]);

  useEffect(() => {
    if (currentLocation && !pickup?.lat && !destination?.lat && (!routeGeometry || routeGeometry.length === 0)) {
      map.flyTo([currentLocation.lat, currentLocation.lng], 15, { animate: false });
    }
  }, [currentLocation?.lat, currentLocation?.lng, map]);

  return null;
};

interface TaxiMapProps {
  onRouteFound?: (km: number, pickup: any, dest: any) => void;
  initialPickup?: { lat: number; lng: number; address?: string } | null;
  initialDest?: { lat: number; lng: number; address?: string } | null;
  driverCoords?: { lat: number; lng: number } | null;
  readOnly?: boolean;
}

export default function TaxiRoutingMap({
  onRouteFound,
  initialPickup,
  initialDest,
  driverCoords,
  readOnly = false,
}: TaxiMapProps) {
  const [pickup, setPickup] = useState(initialPickup || { lat: null, lng: null, address: '' });
  const [destination, setDestination] = useState(initialDest || { lat: null, lng: null, address: '' });
  const [activeInput, setActiveInput] = useState<'pickup' | 'destination'>('pickup');
  const [pickupSearch, setPickupSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [routeGeometry, setRouteGeometry] = useState<any[]>([]);
  const [trafficSegments, setTrafficSegments] = useState<{ positions: any[]; color: string }[]>([]);
  const [distanceKm, setDistanceKm] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (readOnly || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code !== 1) console.warn('Location tracking issue:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [readOnly]);

  useEffect(() => {
    if (initialPickup && initialDest) {
      setPickup(initialPickup as any);
      setDestination(initialDest as any);
    }
  }, [initialPickup, initialDest]);

  useEffect(() => {
    if (readOnly) return;
    const timer = setTimeout(async () => {
      const activeQuery = activeInput === 'pickup' ? pickupSearch : destSearch;
      if (activeQuery.length > 3) setSuggestions(await searchAddress(activeQuery));
      else setSuggestions([]);
    }, 800);
    return () => clearTimeout(timer);
  }, [pickupSearch, destSearch, activeInput, readOnly]);

  useEffect(() => {
    if (pickup?.lat && destination?.lat) {
      getRoute(pickup.lat, pickup.lng, destination.lat, destination.lng).then((res) => {
        if (res.geometry && res.geometry.length > 0) {
          setRouteGeometry(res.geometry);
          setTrafficSegments(simulateTrafficSegments(res.geometry));
          setDistanceKm(res.distanceKm);
          if (onRouteFound && res.distanceKm && !readOnly) {
            onRouteFound(Number(res.distanceKm), pickup, destination);
          }
        } else {
          console.warn('OSRM API timed out. Using fallback distance calculation.');
          const fallbackKm = getFallbackDistance(pickup.lat, pickup.lng, destination.lat, destination.lng);
          const straightLine = [
            [pickup.lat, pickup.lng],
            [destination.lat, destination.lng],
          ];

          setDistanceKm(fallbackKm);
          setRouteGeometry(straightLine);
          setTrafficSegments([{ positions: straightLine, color: '#3b82f6' }]);

          if (onRouteFound && !readOnly) {
            onRouteFound(Number(fallbackKm), pickup, destination);
          }
        }
      });
    }
  }, [pickup, destination, onRouteFound, readOnly]);

  const handleSuggestionSelect = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = suggestion.display_name;

    if (activeInput === 'pickup') {
      setPickup({ lat, lng, address } as any);
      setPickupSearch(address);
      setActiveInput('destination');
    } else {
      setDestination({ lat, lng, address } as any);
      setDestSearch(address);
    }
    setSuggestions([]);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    if (activeInput === 'pickup') {
      setPickup({ lat, lng, address } as any);
      setPickupSearch(address);
      setActiveInput('destination');
    } else {
      setDestination({ lat, lng, address } as any);
      setDestSearch(address);
    }
    setSuggestions([]);
  };

  const handleLocateMe = () => {
    if (currentLocation) {
      reverseGeocode(currentLocation.lat, currentLocation.lng).then((address) => {
        setPickup({ lat: currentLocation.lat, lng: currentLocation.lng, address } as any);
        setPickupSearch(address);
        setActiveInput('destination');
      });
    } else {
      alert('Waiting for GPS signal...');
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-100">
      <style>{`
        @keyframes leaflet-ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-control-container .leaflet-top { z-index: 999; }
        .leaflet-control-container .leaflet-bottom { z-index: 999; }
      `}</style>

      {/* Immersive Map Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapContainer
          center={[30.0444, 31.2357]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapEvents onMapClick={handleMapClick} readOnly={readOnly} />
          <MapController
            pickup={pickup}
            destination={destination}
            routeGeometry={routeGeometry}
            currentLocation={currentLocation}
            readOnly={readOnly}
          />

          {currentLocation?.lat && currentLocation?.lng && (
            <Marker position={[currentLocation.lat, currentLocation.lng]} icon={userLocationIcon} zIndexOffset={999} />
          )}
          {pickup?.lat && pickup?.lng && (
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} zIndexOffset={900} />
          )}
          {destination?.lat && destination?.lng && (
            <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} zIndexOffset={900} />
          )}
          {driverCoords?.lat && driverCoords?.lng && readOnly && (
            <Marker position={[driverCoords.lat, driverCoords.lng]} icon={carIcon} zIndexOffset={1000} />
          )}

          {trafficSegments.map((segment, index) => (
            <Polyline key={index} positions={segment.positions} color={segment.color} weight={6} opacity={0.9} />
          ))}
        </MapContainer>
      </div>

      {/* Floating 2026 UI Overlays */}
      {!readOnly && (
        <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col justify-between p-4 sm:p-6">
          {/* Top Floating Search Card */}
          <div className="pointer-events-auto relative mx-auto w-full max-w-lg rounded-[2rem] border border-white bg-white/90 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
            {/* Distance Badge */}
            {distanceKm && (
              <div className="absolute -top-4 right-6 rounded-full bg-blue-600 px-4 py-1 text-xs font-black tracking-widest text-white uppercase shadow-lg">
                {distanceKm} KM
              </div>
            )}

            <div className="space-y-2">
              {/* Pickup Input */}
              <div
                className={`flex items-center gap-3 rounded-[1.5rem] px-4 py-3 transition-all ${activeInput === 'pickup' ? 'bg-white shadow-md ring-2 ring-blue-500' : 'bg-slate-100 hover:bg-slate-200/50'}`}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <MapPin size={14} />
                </div>
                <input
                  placeholder="Where from?"
                  value={pickupSearch}
                  onChange={(e) => setPickupSearch(e.target.value)}
                  onFocus={() => setActiveInput('pickup')}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Connecting Line Visual (CSS only) */}
              <div className="absolute top-[50px] left-[34px] h-6 w-[2px] border-l-2 border-dotted border-slate-300 bg-slate-200" />

              {/* Destination Input */}
              <div
                className={`flex items-center gap-3 rounded-[1.5rem] px-4 py-3 transition-all ${activeInput === 'destination' ? 'bg-white shadow-md ring-2 ring-slate-900' : 'bg-slate-100 hover:bg-slate-200/50'}`}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <Navigation size={14} />
                </div>
                <input
                  placeholder="Where to?"
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  onFocus={() => setActiveInput('destination')}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Floating Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 max-h-60 overflow-y-auto rounded-[1.5rem] border border-slate-100 bg-white p-2 shadow-2xl">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionSelect(s)}
                    className="cursor-pointer rounded-xl p-3 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <p className="line-clamp-2">{s.display_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Floating Locate Button */}
          <div className="pointer-events-auto flex justify-end pb-24 lg:pb-0">
            <button
              type="button"
              onClick={handleLocateMe}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-700 shadow-xl shadow-slate-900/10 transition-transform hover:scale-105 hover:text-blue-600 active:scale-95"
            >
              <LocateFixed size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
