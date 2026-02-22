'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🟢 Fix Leaflet Default Icon Issue in Next.js
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
    // 💡 FIX: Removed 'headers' to stop CORS blockage.
    // Added '&accept-language=en,ar' to the URL instead!
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar,en&email=support@devfolio.net`;

    const res = await fetch(url); // No headers object here!

    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();

    // Returns the beautifully formatted street address
    return data.display_name || 'Unknown Location';
  } catch (error) {
    console.error('Geocoding Error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

const searchAddress = async (query: string) => {
  try {
    // 💡 FIX: Same here, removed headers and added accept-language to URL
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=ar,en&email=support@devfolio.net`;

    const res = await fetch(url); // No headers object!

    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
};

// 🟢 FIXED: DETERMINISTIC TRAFFIC SIMULATION
// This uses math linked to the exact GPS coordinates.
// It guarantees the traffic colors will NEVER randomly move or flicker!
const simulateTrafficSegments = (geometry: any[]) => {
  const segments: { positions: any[]; color: string }[] = [];
  let currentSegment: any[] = [];
  let currentColor = '#3b82f6';

  // Seeded math function to lock traffic to specific streets
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
      // Split route into chunks
      segments.push({ positions: [...currentSegment], color: currentColor });
      currentSegment = [coord];
      // Generate the color based on the specific coordinate, so it never changes randomly
      currentColor = getTrafficColor(coord[0], coord[1]);
    }
  });
  if (currentSegment.length > 1) segments.push({ positions: currentSegment, color: currentColor });
  return segments;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // ✅ UPDATED CODE
  useEffect(() => {
    // 🟢 1. Do not ask for GPS if the map is just displaying an old order
    if (readOnly || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        // 🟢 2. Handle the denial gracefully without throwing scary red console errors
        if (err.code === 1) {
          console.log('GPS tracking bypassed: User denied permission.');
        } else {
          console.warn('Location tracking issue:', err.message);
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [readOnly]); // 🟢 3. Added readOnly to the dependency array

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
          // 🟢 Calls the newly fixed Stable Algorithm
          setTrafficSegments(simulateTrafficSegments(res.geometry));
          setDistanceKm(res.distanceKm);
          if (onRouteFound && res.distanceKm && !readOnly) {
            onRouteFound(Number(res.distanceKm), pickup, destination);
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
    <div className={`relative z-0 flex flex-col gap-4 ${readOnly ? 'h-full' : ''}`}>
      <style>{`
        @keyframes leaflet-ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {!readOnly && (
        <div className="relative z-[1001] space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {distanceKm && (
            <div className="absolute top-4 right-4 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
              {distanceKm} km
            </div>
          )}
          <div className="flex items-center gap-3 pr-16">
            <div className="h-4 w-4 flex-shrink-0 rounded-full bg-blue-500 shadow-sm" />
            <input
              placeholder="Pickup Location"
              value={pickupSearch}
              onChange={(e) => setPickupSearch(e.target.value)}
              onFocus={() => setActiveInput('pickup')}
              className={`w-full rounded-lg border bg-gray-50 p-3 transition-all outline-none ${activeInput === 'pickup' ? 'bg-white ring-2 ring-blue-500' : 'border-gray-200'}`}
            />
          </div>
          <div className="flex items-center gap-3 pr-16">
            <div className="h-4 w-4 flex-shrink-0 bg-black shadow-sm" />
            <input
              placeholder="Destination"
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              onFocus={() => setActiveInput('destination')}
              className={`w-full rounded-lg border bg-gray-50 p-3 transition-all outline-none ${activeInput === 'destination' ? 'bg-white ring-2 ring-black' : 'border-gray-200'}`}
            />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute top-[110px] right-0 left-0 z-[1002] max-h-60 overflow-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSuggestionSelect(s)}
                  className="cursor-pointer border-b p-3 text-sm text-gray-700 last:border-0 hover:bg-gray-50"
                >
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={`relative z-0 w-full overflow-hidden border-gray-300 ${readOnly ? 'h-full flex-1' : 'h-[400px] rounded-xl border'}`}
      >
        <MapContainer
          center={[30.0444, 31.2357]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
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

        {!readOnly && (
          <button
            type="button"
            onClick={handleLocateMe}
            className="absolute right-4 bottom-6 z-[1000] flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all hover:bg-blue-50 hover:text-blue-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
