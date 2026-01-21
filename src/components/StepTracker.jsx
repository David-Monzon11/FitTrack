import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const StepTracker = () => {
  const [stepCount, setStepCount] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0);
  const [status, setStatus] = useState('');
  const watchIdRef = useRef(null);
  const lastValidPosRef = useRef(null);
  const lastPositionTimeRef = useRef(null);

  const averageStepLength = 0.762; // meters
  const minMovementThreshold = 3; // meters
  const maxMovementThreshold = 50; // meters
  const minSpeedThreshold = 0.3; // m/s

  const calculateDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return 0;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (pos1[0] * Math.PI) / 180;
    const φ2 = (pos2[0] * Math.PI) / 180;
    const Δφ = ((pos2[0] - pos1[0]) * Math.PI) / 180;
    const Δλ = ((pos2[1] - pos1[1]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setTracking(true);
    setStepCount(0);
    setPositions([]);
    setDistance(0);
    lastValidPosRef.current = null;
    lastPositionTimeRef.current = null;
    setStatus('Tracking started...');

    const options = {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      onPositionUpdate,
      onPositionError,
      options
    );
  };

  const stopTracking = () => {
    setTracking(false);
    setStatus('Tracking stopped.');
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setPositions([]);
    lastValidPosRef.current = null;
  };

  const onPositionUpdate = (position) => {
    if (!tracking) return;

    const latlng = [position.coords.latitude, position.coords.longitude];
    const currentTimestamp = position.timestamp;

    if (!lastValidPosRef.current) {
      lastValidPosRef.current = latlng;
      lastPositionTimeRef.current = currentTimestamp;
      setPositions([latlng]);
      return;
    }

    const distanceDelta = calculateDistance(lastValidPosRef.current, latlng);
    const timeDelta = (currentTimestamp - lastPositionTimeRef.current) / 1000;
    const speed = distanceDelta / timeDelta;

    if (distanceDelta < minMovementThreshold || distanceDelta > maxMovementThreshold) {
      setStatus('Ignoring fluctuation/jump.');
      return;
    }

    if (speed < minSpeedThreshold) {
      setStatus('Ignoring due to low speed.');
      return;
    }

    setPositions((prev) => [...prev, latlng]);
    const stepsDelta = distanceDelta / averageStepLength;
    setStepCount((prev) => prev + Math.round(stepsDelta));

    const totalDist = positions.reduce((acc, cur, i, arr) => {
      if (i === 0) return acc;
      return acc + calculateDistance(arr[i - 1], cur);
    }, 0) + distanceDelta;
    setDistance(totalDist);

    lastValidPosRef.current = latlng;
    lastPositionTimeRef.current = currentTimestamp;
    setStatus('Tracking...');
  };

  const onPositionError = (err) => {
    setStatus(`Location error: ${err.message}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl p-4 shadow-medium">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Step Tracker</h3>
        <div className="mb-3">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            Steps: {stepCount}
          </div>
          <div className="text-lg text-gray-600">
            Distance: {distance.toFixed(2)} m
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={startTracking}
            disabled={tracking}
            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Start
          </button>
          <button
            onClick={stopTracking}
            disabled={!tracking}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Stop
          </button>
        </div>
        {positions.length > 0 && (
          <div className="h-48 rounded-lg overflow-hidden">
            <MapContainer
              center={positions[0] || [0, 0]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapController center={positions[positions.length - 1]} />
              {positions.length > 0 && (
                <>
                  <Marker position={positions[positions.length - 1]}>
                    <Popup>You are here</Popup>
                  </Marker>
                  <Polyline positions={positions} color="blue" weight={5} />
                </>
              )}
            </MapContainer>
          </div>
        )}
        {status && (
          <p className={`text-sm mt-2 ${status.includes('error') ? 'text-red-600' : 'text-gray-600'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepTracker;
