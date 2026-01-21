import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { ref, update, push } from 'firebase/database';
import { db } from '../config/firebase';
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
  const { currentUser } = useAuth();
  const [stepCount, setStepCount] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0); // in meters
  const [status, setStatus] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [currentSpeed, setCurrentSpeed] = useState(0); // in m/s
  const [averageSpeed, setAverageSpeed] = useState(0); // in m/s
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  
  const watchIdRef = useRef(null);
  const lastValidPosRef = useRef(null);
  const lastPositionTimeRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const speedsRef = useRef([]);

  const averageStepLength = 0.762; // meters
  const minMovementThreshold = 3; // meters
  const maxMovementThreshold = 50; // meters
  const minSpeedThreshold = 0.3; // m/s
  const caloriesPerKm = 50; // Approximate calories burned per km walking

  // Timer effect
  useEffect(() => {
    if (tracking && !paused) {
      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [tracking, paused]);

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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  const formatSpeed = (mps) => {
    const kmh = mps * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  };

  const calculateCalories = (distanceInMeters) => {
    return Math.round((distanceInMeters / 1000) * caloriesPerKm);
  };

  const saveSessionToFirebase = async () => {
    if (!currentUser) {
      console.warn('User not authenticated, cannot save session.');
      return;
    }

    if (stepCount === 0) {
      console.warn('No steps to save.');
      return;
    }

    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const todayId = today.getTime();

      // Update today's health data
      await update(ref(db, `HealthData/${currentUser.uid}/${todayId}`), {
        steps: stepCount,
      });

      // Save session details
      const sessionData = {
        steps: stepCount,
        distance: distance,
        duration: elapsedTime,
        averageSpeed: averageSpeed,
        caloriesBurned: caloriesBurned,
        startTime: startTimeRef.current,
        endTime: Date.now(),
        positions: positions.slice(0, 100), // Save first 100 positions to avoid large data
      };

      await push(ref(db, `StepSessions/${currentUser.uid}`), sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
      if (error.code === 'PERMISSION_DENIED') {
        console.error('Permission denied. Please check Firebase database rules.');
      }
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setTracking(true);
    setPaused(false);
    setStepCount(0);
    setPositions([]);
    setDistance(0);
    setElapsedTime(0);
    setCaloriesBurned(0);
    setCurrentSpeed(0);
    setAverageSpeed(0);
    speedsRef.current = [];
    
    lastValidPosRef.current = null;
    lastPositionTimeRef.current = null;
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setStatus('📍 Tracking started...');

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

  const pauseTracking = () => {
    if (tracking && !paused) {
      setPaused(true);
      const pauseStart = Date.now();
      if (startTimeRef.current) {
        pausedTimeRef.current += pauseStart - (startTimeRef.current + pausedTimeRef.current);
      }
      setStatus('⏸️ Tracking paused');
    }
  };

  const resumeTracking = () => {
    if (tracking && paused) {
      setPaused(false);
      setStatus('▶️ Tracking resumed...');
    }
  };

  const stopTracking = async () => {
    setTracking(false);
    setPaused(false);
    setStatus('✅ Tracking completed!');
    
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Save session to Firebase
    await saveSessionToFirebase();

    // Reset after a delay
    setTimeout(() => {
      setPositions([]);
      lastValidPosRef.current = null;
      setStatus('');
    }, 3000);
  };

  const onPositionUpdate = (position) => {
    if (!tracking || paused) return;

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
      return; // Silently ignore invalid movements
    }

    if (speed < minSpeedThreshold) {
      return; // Silently ignore stationary movements
    }

    // Valid movement detected
    setPositions((prev) => [...prev, latlng]);
    const stepsDelta = distanceDelta / averageStepLength;
    setStepCount((prev) => prev + Math.round(stepsDelta));

    // Calculate total distance
    const totalDist = positions.reduce((acc, cur, i, arr) => {
      if (i === 0) return acc;
      return acc + calculateDistance(arr[i - 1], cur);
    }, 0) + distanceDelta;
    setDistance(totalDist);

    // Calculate calories
    setCaloriesBurned(calculateCalories(totalDist));

    // Update speeds
    speedsRef.current.push(speed);
    setCurrentSpeed(speed);
    const avg = speedsRef.current.reduce((a, b) => a + b, 0) / speedsRef.current.length;
    setAverageSpeed(avg);

    lastValidPosRef.current = latlng;
    lastPositionTimeRef.current = currentTimestamp;
    setStatus('📍 Tracking...');
  };

  const onPositionError = (err) => {
    setStatus(`❌ Location error: ${err.message}`);
  };

  const resetSession = () => {
    if (window.confirm('Are you sure you want to reset this session?')) {
      stopTracking();
      setStepCount(0);
      setDistance(0);
      setElapsedTime(0);
      setCaloriesBurned(0);
      setPositions([]);
      setStatus('');
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl p-5 shadow-medium">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            <i className="fas fa-walking text-primary-500 mr-2"></i>
            Step Tracker
          </h3>
          {tracking && (
            <button
              onClick={resetSession}
              className="text-sm text-red-600 hover:text-red-700"
              title="Reset Session"
            >
              <i className="fas fa-redo"></i>
            </button>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Steps</div>
            <div className="text-3xl font-bold text-primary-600">{stepCount.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Distance</div>
            <div className="text-2xl font-bold text-green-600">{formatDistance(distance)}</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Time</div>
            <div className="text-lg font-semibold text-gray-900">{formatTime(elapsedTime)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Pace</div>
            <div className="text-lg font-semibold text-gray-900">
              {currentSpeed > 0 ? formatSpeed(currentSpeed) : '--'}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Calories</div>
            <div className="text-lg font-semibold text-orange-600">{caloriesBurned}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4">
          {!tracking ? (
            <button
              onClick={startTracking}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <i className="fas fa-play mr-2"></i>Start Tracking
            </button>
          ) : (
            <>
              {!paused ? (
                <button
                  onClick={pauseTracking}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  <i className="fas fa-pause mr-2"></i>Pause
                </button>
              ) : (
                <button
                  onClick={resumeTracking}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  <i className="fas fa-play mr-2"></i>Resume
                </button>
              )}
              <button
                onClick={stopTracking}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                <i className="fas fa-stop mr-2"></i>Stop
              </button>
            </>
          )}
        </div>

        {/* Map */}
        {positions.length > 0 && (
          <div className="h-64 rounded-lg overflow-hidden mb-3 border-2 border-gray-200">
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
                    <Popup>Current Location</Popup>
                  </Marker>
                  {positions[0] && positions.length > 1 && (
                    <Marker position={positions[0]}>
                      <Popup>Start Point</Popup>
                    </Marker>
                  )}
                  <Polyline positions={positions} color="#3B6C92" weight={4} opacity={0.8} />
                </>
              )}
            </MapContainer>
          </div>
        )}

        {/* Status and Additional Info */}
        {status && (
          <div className={`text-sm p-3 rounded-lg mb-2 ${
            status.includes('error') || status.includes('❌')
              ? 'bg-red-50 text-red-700'
              : status.includes('✅')
              ? 'bg-green-50 text-green-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {status}
          </div>
        )}

        {tracking && averageSpeed > 0 && distance > 0 && (
          <div className="text-xs text-gray-500 text-center">
            Avg Speed: {formatSpeed(averageSpeed)}
            {elapsedTime > 0 && distance >= 100 && (
              <> • Pace: {formatTime(Math.round((elapsedTime / (distance / 1000))))}/km</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTracker;
