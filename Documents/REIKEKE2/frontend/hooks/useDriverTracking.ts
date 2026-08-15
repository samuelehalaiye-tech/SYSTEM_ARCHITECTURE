import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { getDriverPosition, getRouteToPickup } from '../services/endpoints/tracking';
import { decodePolyline } from '../services/polylineUtils';

export function useDriverTracking(options: {
  tripId: string | null;
  token: string | null;
  enabled?: boolean;
  initialDriverLocation?: { lat: number; lng: number };
}) {
  const { tripId, token, enabled = true, initialDriverLocation } = options;
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number; heading?: number } | null>(
    initialDriverLocation ?? null
  );
  const [distance, setDistance] = useState<string>('');
  const [eta, setEta] = useState<string>('');
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const routeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Seed location when REST tripData arrives after hook already mounted
  useEffect(() => {
    if (initialDriverLocation && !driverLocation) {
      setDriverLocation(initialDriverLocation);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDriverLocation?.lat, initialDriverLocation?.lng]);
  
  const handleWsMessage = useCallback((data: any) => {
    // Backend sends type: 'location'; guard against both variants
    if ((data.type === 'location' || data.type === 'location_update')) {
      const loc = data.location ?? data; // backend sends flat or nested
      if (loc.lat != null && loc.lng != null) {
        setDriverLocation({
          lat: Number(loc.lat),
          lng: Number(loc.lng),
          heading: loc.heading != null ? Number(loc.heading) : undefined,
        });
      }
      if (data.distance) setDistance(data.distance);
      if (data.eta) setEta(data.eta);
    }
  }, []);

  const { isConnected } = useWebSocket({
    url: tripId ? `/ws/tracking/${tripId}/` : '',
    token,
    enabled: enabled && !!tripId && !!token,
    onMessage: handleWsMessage,
  });

  const fetchRoute = useCallback(async () => {
    if (!tripId || !token) return;
    try {
      const data = await getRouteToPickup(tripId, token);
      if (data.polyline) {
        setRouteCoords(decodePolyline(data.polyline));
      }
      // Backend returns distance_text / duration_text from Google Directions
      if (data.distance_text) setDistance(data.distance_text);
      else if (data.distance) setDistance(data.distance);
      if (data.duration_text) setEta(data.duration_text);
      else if (data.eta) setEta(data.eta);
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  }, [tripId, token]);

  const pollLocation = useCallback(async () => {
    if (!tripId || !token) return;
    try {
      const data = await getDriverPosition(tripId, token);
      // Backend returns driver_lat / driver_lng at the top level
      const lat = data.location?.lat ?? data.driver_lat;
      const lng = data.location?.lng ?? data.driver_lng;
      const heading = data.location?.heading ?? data.heading;
      if (lat != null && lng != null) {
        setDriverLocation({
          lat: Number(lat),
          lng: Number(lng),
          heading: heading != null ? Number(heading) : undefined,
        });
      }
    } catch (error) {
      console.error('Failed to poll location:', error);
    }
  }, [tripId, token]);

  useEffect(() => {
    if (enabled && tripId && token) {
      setIsLoading(true);
      fetchRoute().finally(() => setIsLoading(false));
      
      // Periodically refresh route/eta every 30 seconds
      routeIntervalRef.current = setInterval(fetchRoute, 30000);
    }

    return () => {
      if (routeIntervalRef.current) clearInterval(routeIntervalRef.current);
    };
  }, [enabled, tripId, token, fetchRoute]);

  useEffect(() => {
    if (enabled && tripId && token && !isConnected) {
      // Fallback: poll every 5 seconds if WS is disconnected
      pollLocation(); // Initial poll
      pollIntervalRef.current = setInterval(pollLocation, 5000);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [enabled, tripId, token, isConnected, pollLocation]);

  return { driverLocation, distance, eta, routeCoords, isConnected, isLoading };
}
