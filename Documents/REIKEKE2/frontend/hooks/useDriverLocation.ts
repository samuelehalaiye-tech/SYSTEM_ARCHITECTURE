import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { DeviceEventEmitter } from 'react-native';

const BACKGROUND_LOCATION_TASK = 'REIKEKE_DRIVER_LOCATION';
const LOCATION_UPDATE_EVENT = 'REIKEKE_LOCATION_UPDATE';

interface LocationData {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  accuracy: number;
  timestamp: string;
}

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const loc = locations[locations.length - 1];
      const locationData: LocationData = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        heading: loc.coords.heading || 0,
        speed: loc.coords.speed || 0,
        accuracy: loc.coords.accuracy || 0,
        timestamp: new Date(loc.timestamp).toISOString(),
      };
      // Emit the event to the foreground app
      DeviceEventEmitter.emit(LOCATION_UPDATE_EVENT, locationData);
    }
  }
});

export function useDriverLocation(options: {
  enabled: boolean;
  onLocationUpdate?: (location: LocationData) => void;
  intervalMs?: number;
}) {
  const { enabled, onLocationUpdate, intervalMs = 5000 } = options;
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  // Keep a ref to the latest callback so we don't restart tracking on callback change
  const onLocationUpdateRef = useRef(onLocationUpdate);
  useEffect(() => {
    onLocationUpdateRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  const startTracking = useCallback(async () => {
    try {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setError('Foreground location permission denied');
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        console.warn('Background location permission denied. Tracking will only work in foreground.');
      }

      // Foreground tracking
      locationSubRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: intervalMs,
          distanceInterval: 5,
        },
        (loc) => {
          const locationData: LocationData = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            heading: loc.coords.heading || 0,
            speed: loc.coords.speed || 0,
            accuracy: loc.coords.accuracy || 0,
            timestamp: new Date(loc.timestamp).toISOString(),
          };
          setLocation(locationData);
          onLocationUpdateRef.current?.(locationData);
        }
      );

      // Background tracking (only if permission granted)
      if (bgStatus === 'granted') {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if (!isRegistered) {
          await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
            accuracy: Location.Accuracy.High,
            timeInterval: intervalMs,
            distanceInterval: 5,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: 'REIKEKE Driver',
              notificationBody: 'Tracking location for your active ride',
              notificationColor: '#FF8C00',
            },
          });
        }
      }

      setIsTracking(true);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to start tracking');
      setIsTracking(false);
    }
  }, [intervalMs]);

  const stopTracking = useCallback(async () => {
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }

    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      }
    } catch (e) {
      console.error('Error stopping background location:', e);
    }

    setIsTracking(false);
  }, []);

  // Listen for background updates
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(LOCATION_UPDATE_EVENT, (locationData: LocationData) => {
      setLocation(locationData);
      onLocationUpdateRef.current?.(locationData);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    
    if (enabled && !isTracking) {
      startTracking();
    } else if (!enabled && isTracking) {
      stopTracking();
    }

    return () => {
      mounted = false;
      if (isTracking) {
        stopTracking();
      }
    };
  }, [enabled, isTracking, startTracking, stopTracking]);

  return { location, isTracking, error, startTracking, stopTracking };
}
