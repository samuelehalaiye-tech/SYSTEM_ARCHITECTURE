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

const MAP_MOVE_METERS = 2;
const MAP_HEADING_DEGREES = 10;

function headingDelta(a: number, b: number) {
  return Math.abs(((b - a + 540) % 360) - 180);
}

function isMissingLocationTaskError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('TaskNotFoundException') || message.includes('Task not found');
}

/** Skip tiny GPS jitter so the map is not redrawn on every native location event. */
export function shouldUpdateMapLocation(
  prev: LocationData | null,
  next: LocationData,
  minMeters = MAP_MOVE_METERS,
  minHeading = MAP_HEADING_DEGREES,
) {
  if (!prev) return true;

  const latMeters = (next.lat - prev.lat) * 111000;
  const lngMeters =
    (next.lng - prev.lng) * 111000 * Math.cos((prev.lat * Math.PI) / 180);
  const movedMeters = Math.hypot(latMeters, lngMeters);

  return (
    movedMeters >= minMeters ||
    headingDelta(prev.heading, next.heading) >= minHeading
  );
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
  const lastMapLocationRef = useRef<LocationData | null>(null);

  const onLocationUpdateRef = useRef(onLocationUpdate);
  useEffect(() => {
    onLocationUpdateRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  const publishLocation = useCallback((locationData: LocationData) => {
    onLocationUpdateRef.current?.(locationData);
    if (!shouldUpdateMapLocation(lastMapLocationRef.current, locationData)) {
      return;
    }
    lastMapLocationRef.current = locationData;
    setLocation(locationData);
  }, []);

  const startTracking = useCallback(async () => {
    try {
      if (locationSubRef.current) return;

      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setError('Foreground location permission denied');
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        console.warn('Background location permission denied. Tracking will only work in foreground.');
      }

      // Seed with last known location immediately so the marker doesn't disappear for seconds
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown && !lastMapLocationRef.current) {
          const initData: LocationData = {
            lat: lastKnown.coords.latitude,
            lng: lastKnown.coords.longitude,
            heading: lastKnown.coords.heading || 0,
            speed: lastKnown.coords.speed || 0,
            accuracy: lastKnown.coords.accuracy || 0,
            timestamp: new Date(lastKnown.timestamp).toISOString(),
          };
          publishLocation(initData);
        }
      } catch (e) {
        // Ignore failure to get initial location
      }

      locationSubRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: intervalMs,
          distanceInterval: 10,
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
          publishLocation(locationData);
        }
      );

      if (bgStatus === 'granted') {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if (!isRegistered) {
          await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: intervalMs,
            distanceInterval: 10,
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
  }, [intervalMs, publishLocation]);

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
      if (!isMissingLocationTaskError(e)) {
        console.error('Error stopping background location:', e);
      }
    }

    setIsTracking(false);
  }, []);

  const startTrackingRef = useRef(startTracking);
  const stopTrackingRef = useRef(stopTracking);
  startTrackingRef.current = startTracking;
  stopTrackingRef.current = stopTracking;

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(LOCATION_UPDATE_EVENT, (locationData: LocationData) => {
      publishLocation(locationData);
    });

    return () => {
      subscription.remove();
    };
  }, [publishLocation]);

  useEffect(() => {
    if (!enabled) {
      lastMapLocationRef.current = null;
      void stopTrackingRef.current();
      return;
    }

    void startTrackingRef.current();
    return () => {
      void stopTrackingRef.current();
    };
  }, [enabled]);

  return { location, isTracking, error, startTracking, stopTracking };
}
