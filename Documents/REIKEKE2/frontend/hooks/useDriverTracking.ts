import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { getDriverPosition, getRouteToPickup } from '../services/endpoints/tracking';
import { decodePolyline } from '../services/polylineUtils';

export function useDriverTracking(options: {
  tripId: string | null;
  token: string | null;
  enabled?: boolean;
}) {
  const { tripId, token, enabled = true } = options;
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number; heading?: number } | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [eta, setEta] = useState<string>('');
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const routeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const handleWsMessage = useCallback((data: any) => {
    if (data.type === 'location_update' && data.location) {
      setDriverLocation({
        lat: data.location.lat,
        lng: data.location.lng,
        heading: data.location.heading,
      });
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
      if (data.distance) setDistance(data.distance);
      if (data.eta) setEta(data.eta);
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  }, [tripId, token]);

  const pollLocation = useCallback(async () => {
    if (!tripId || !token) return;
    try {
      const data = await getDriverPosition(tripId, token);
      if (data.location) {
        setDriverLocation({
          lat: data.location.lat,
          lng: data.location.lng,
          heading: data.location.heading,
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
