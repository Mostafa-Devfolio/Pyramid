'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// 1. Handles manual map clicks
const LocationMarker = ({ position, setPosition, onLocationSelect }: any) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position} icon={customIcon} />;
};

// 2. The Hyper-Optimized GPS Logic
const MapController = ({ setPosition, onLocationSelect, setLocateTrigger }: any) => {
  const map = useMap();

  const updateMap = (coords: any, updateForm: boolean) => {
    const { latitude, longitude } = coords;
    const currentLatLng = new L.LatLng(latitude, longitude);
    setPosition(currentLatLng);

    if (updateForm) onLocationSelect(latitude, longitude);

    map.flyTo(currentLatLng, 16, { animate: true, duration: 1.5 });
  };

  const performLocate = (isManualClick = false, onComplete?: () => void) => {
    if (!navigator.geolocation) {
      if (onComplete) onComplete();
      return;
    }

    // KILL SWITCH: Force the spinner to stop after 8 seconds no matter what happens!
    let fallbackTimer: NodeJS.Timeout;
    if (onComplete) {
      fallbackTimer = setTimeout(() => {
        onComplete();
      }, 8000);
    }

    // Helper to clear the timer and stop the spinner safely
    const handleComplete = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (onComplete) onComplete();
    };

    // The High Accuracy function
    const fetchHighAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateMap(pos.coords, true);
          handleComplete();
        },
        (err) => {
          console.warn('High accuracy GPS failed. Using fast Wi-Fi fallback.', err);
          // If high accuracy fails (indoors/desktop), INSTANTLY fallback to low accuracy!
          navigator.geolocation.getCurrentPosition(
            (fallbackPos) => {
              updateMap(fallbackPos.coords, true);
              handleComplete();
            },
            () => handleComplete(),
            { enableHighAccuracy: false, timeout: 5000 }
          );
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
      );
    };

    if (!isManualClick) {
      // PAGE LOAD: Get the ultra-fast approximate location in 0.1 seconds
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateMap(pos.coords, false); // Move camera immediately
          fetchHighAccuracy(); // Then silently get the exact house in the background
        },
        () => fetchHighAccuracy(), // If fast fails, try accurate
        { enableHighAccuracy: false, timeout: 3000, maximumAge: Infinity }
      );
    } else {
      // MANUAL BUTTON CLICK: Go straight for the exact location
      fetchHighAccuracy();
    }
  };

  useEffect(() => {
    // FIX: We are now catching the 'onComplete' signal from the button and passing it to performLocate!
    setLocateTrigger(() => (onComplete?: () => void) => performLocate(true, onComplete));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    performLocate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

// 3. Main Component
export default function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [triggerLocate, setTriggerLocate] = useState<((onComplete?: () => void) => void) | null>(null);

  const handleManualLocate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (triggerLocate) {
      setIsLocating(true);
      triggerLocate(() => setIsLocating(false));
    }
  };

  return (
    <div className="relative z-0 h-[350px] w-full overflow-hidden rounded-xl border border-gray-300 shadow-sm">
      <MapContainer
        center={[30.0444, 31.2357]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />

        <MapController
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
          setLocateTrigger={setTriggerLocate}
        />
      </MapContainer>

      <button
        type="button"
        onClick={handleManualLocate}
        title="Go to my exact location"
        className="absolute right-4 bottom-6 z-[1000] flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all hover:bg-blue-50 hover:text-blue-600"
      >
        {isLocating ? (
          <svg
            className="h-6 w-6 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
