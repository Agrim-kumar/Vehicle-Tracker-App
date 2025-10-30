import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  ZoomControl, // 1. Imported ZoomControl
} from "react-leaflet";
import L from "leaflet";
import Controls from "./Controls";
import "./VehicleMap.css"; // Add custom dark theme styles

// Fix Leaflet icon issue (no default marker images in React build)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Automatically fit map bounds to the loaded route
function FitBounds({ routeData }) {
  const map = useMap();
  useEffect(() => {
    if (routeData?.length) {
      const bounds = L.latLngBounds(routeData.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [routeData, map]);
  return null;
}

const INITIAL_CENTER = [17.385544, 78.487471]; // Hyderabad

function VehicleMap() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(2000);
  const intervalRef = useRef(null);

  // Load vehicle route
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(import.meta.env.BASE_URL + "dummy-route.json");
        if (!res.ok) throw new Error("Failed to load route data");

        const data = await res.json();
        const formatted = data.map(p => ({
          lat: p.latitude,
          lng: p.longitude,
          timestamp: p.timestamp,
        }));

        setRouteData(formatted);
      } catch (err) {
        console.error(err);
        setError("Unable to load route data. Please verify dummy-route.json in the public folder.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoute();
  }, []);

  // Vehicle movement simulation
  useEffect(() => {
    if (isPlaying && routeData.length > 1 && currentIndex < routeData.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => {
          if (i >= routeData.length - 1) {
            clearInterval(intervalRef.current);
            return i;
          }
          return i + 1;
        });
      }, simulationSpeed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, routeData, simulationSpeed, currentIndex]);

  const handlePlay = () => {
    if (currentIndex >= routeData.length - 1) setCurrentIndex(0);
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
  const handleSpeedChange = speed => setSimulationSpeed(speed);

  // Custom icons
  const vehicleIcon = L.divIcon({
    className: "vehicle-marker",
    html: `
      <div class="car-icon">
        🚙
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  const startIcon = L.divIcon({
    className: "start-icon",
    html: "<div class='pulse-dot start'></div>",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const endIcon = L.divIcon({
    className: "end-icon",
    html: "<div class='pulse-dot end'></div>",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const currentPosition = routeData[currentIndex];
  const allCoords = routeData.map(p => [p.lat, p.lng]);
  const travelled = routeData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng]);

  if (isLoading) {
    return (
      <div className="map-loader">
        <div className="spinner"></div>
        <p>Loading vehicle data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error">
        <h2>⚠️ {error}</h2>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <div className="map-wrapper h-full w-full">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={15}
        scrollWheelZoom
        className="map-container"
        zoomControl={false} // 2. Disabled default controls
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* 3. Added new controls in the top right */}
        <ZoomControl position="topright" />

        <FitBounds routeData={routeData} />

        {/* Route lines */}
        {allCoords.length > 1 && (
          <Polyline positions={allCoords} pathOptions={{
            color: "#4B5563",
            weight: 3,
            dashArray: "6, 6",
            opacity: 0.6
          }} />
        )}

        {travelled.length > 1 && (
          <Polyline positions={travelled} pathOptions={{
            color: "#22d3ee",
            weight: 6,
            opacity: 0.9
          }} />
        )}

        {/* Start, End, and Vehicle */}
        {routeData.length > 0 && (
          <Marker position={allCoords[0]} icon={startIcon} />
        )}
        {routeData.length > 1 && (
          <Marker position={allCoords[allCoords.length - 1]} icon={endIcon} />
        )}
        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={vehicleIcon}>
            <Popup>
              <strong>Vehicle</strong><br />
              Lat: {currentPosition.lat.toFixed(5)}<br />
              Lng: {currentPosition.lng.toFixed(5)}<br />
              {new Date(currentPosition.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <Controls
        currentPosition={currentPosition}
        currentIndex={currentIndex}
        routeData={routeData}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
        simulationSpeed={simulationSpeed}
      />
    </div>
  );
}

export default VehicleMap;