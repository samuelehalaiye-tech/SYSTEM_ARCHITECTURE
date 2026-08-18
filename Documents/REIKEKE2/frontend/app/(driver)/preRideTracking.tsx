import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation, Play } from 'lucide-react-native';

import DriverMarker from '@/components/DriverMarker';
import { YOLA_REGION } from '@/components/MapComponent';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDriverLocation } from '@/hooks/useDriverLocation';
import { getCurrentTrip } from '@/services/endpoints/driver';
import {
  getRouteToPickup,
  TrackingApiError,
  updateDriverLocation,
} from '@/services/endpoints/tracking';
import { decodePolyline } from '@/services/polylineUtils';

const ROUTE_REFRESH_MS = 30000;
const USER_INTERACTION_COOLDOWN_MS = 5000;

export default function PreRideTracking() {
  const params = useLocalSearchParams();
  const tripId = Array.isArray(params.tripId)
    ? params.tripId[0]
    : params.tripId;
  const router = useRouter();

  const mapRef = useRef<MapView>(null);

  const [token, setToken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [eta, setEta] = useState<string>('--');
  const [distance, setDistance] = useState<string>('--');
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [mapReady, setMapReady] = useState(false);

  // Tracks whether the driver is currently dragging the map, so our
  // GPS-driven camera follow doesn't fight their own panning/zooming.
  const userInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const routeIsAvailableRef = useRef(false);
  const lastLocationRouteRefreshRef = useRef(0);
  const locationFallbackBlockedRef = useRef(false);
  const lastRoutePolylineRef = useRef<string | null>(null);
  const hasRouteOnMapRef = useRef(false);
  const hasPositionedCameraRef = useRef(false);

  // ── Load token + trip data ──────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const t = await AsyncStorage.getItem('userToken');
      setToken(t);
      if (!t) return;
      try {
        const trip = await getCurrentTrip(t);
        if (trip && trip.active !== false) {
          setTripData(trip);
        }
      } catch (e) {
        console.error('PreRideTracking init:', e);
      }
    };
    init();
  }, []);

  // ── WebSocket — broadcast driver GPS to passenger ───────────────────────
  const { sendMessage } = useWebSocket({
    url: tripId ? `/ws/tracking/${tripId}/` : '',
    token,
    enabled: !!tripId && !!token,
  });

  // ── Route to pickup — fetched from OUR OWN backend on a fixed interval,
  //    not re-requested from Google on every GPS tick. The backend endpoint
  //    already does traffic-aware routing (google_directions.get_route_info).
  const fetchRoute = useCallback(async () => {
    if (!tripId || !token) return;
    try {
      const data = await getRouteToPickup(tripId, token);
      const hasRouteSummary =
        typeof data.distance_text === 'string' &&
        typeof data.duration_text === 'string';

      if (!hasRouteSummary) {
        routeIsAvailableRef.current = false;
        if (hasRouteOnMapRef.current) {
          hasRouteOnMapRef.current = false;
          lastRoutePolylineRef.current = null;
          setRouteCoords([]);
        }
        setDistance('--');
        setEta('--');
        setRouteError('Route unavailable. Waiting for GPS or Maps response.');
        return;
      }

      if (data.polyline && data.polyline !== lastRoutePolylineRef.current) {
        lastRoutePolylineRef.current = data.polyline;
        hasRouteOnMapRef.current = true;
        setRouteCoords(decodePolyline(data.polyline));
      }
      routeIsAvailableRef.current = true;
      setDistance(data.distance_text);
      setEta(data.duration_text);
      setRouteError(null);
    } catch (e) {
      console.error('Failed to fetch route to pickup:', e);
      routeIsAvailableRef.current = false;
      if (hasRouteOnMapRef.current) {
        hasRouteOnMapRef.current = false;
        lastRoutePolylineRef.current = null;
        setRouteCoords([]);
      }
      setDistance('--');
      setEta('--');
      setRouteError('Unable to load route. Check your connection and try again.');
    }
  }, [tripId, token]);

  useEffect(() => {
    if (!tripId || !token) return;
    fetchRoute();
    const interval = setInterval(fetchRoute, ROUTE_REFRESH_MS);
    return () => clearInterval(interval);
  }, [tripId, token, fetchRoute]);

  // ── Driver GPS ──────────────────────────────────────────────────────────
  const { location: driverLoc, error: driverLocationError } = useDriverLocation({
    enabled: !!token,
    onLocationUpdate: (loc) => {
      const locationMessage = {
        type: 'location',
        lat: loc.lat,
        lng: loc.lng,
        heading: loc.heading,
        speed: loc.speed,
        accuracy: loc.accuracy,
        timestamp: loc.timestamp,
      };

      // A successful WebSocket send only means the message left this device;
      // it does not guarantee the route endpoint can read the coordinate yet.
      // Until a route is available, make the REST location update authoritative
      // and retry the route immediately after the first saved GPS point.
      const sentOverWebSocket = sendMessage(locationMessage);
      const routeNeedsDriverLocation = !routeIsAvailableRef.current;
      if (
        !locationFallbackBlockedRef.current &&
        (!sentOverWebSocket || routeNeedsDriverLocation) &&
        tripId &&
        token
      ) {
        void updateDriverLocation(tripId, locationMessage, token)
          .then(() => {
            const now = Date.now();
            const canRefreshRoute =
              routeNeedsDriverLocation &&
              now - lastLocationRouteRefreshRef.current >= ROUTE_REFRESH_MS;

            if (canRefreshRoute) {
              lastLocationRouteRefreshRef.current = now;
              void fetchRoute();
            }
          })
          .catch((e) => {
            if (
              e instanceof TrackingApiError &&
              (e.status === 403 || e.status === 409)
            ) {
              locationFallbackBlockedRef.current = true;
              setRouteError(
                e.message.replace(/^Failed to update location: \d+:\s*/, ''),
              );
              return;
            }
            console.error('Failed to save driver location fallback:', e);
          });
      }

      // Keep the map stable after its initial position. The marker itself is
      // animated for every GPS point; moving the entire camera every few
      // seconds made the driver screen look as though it was refreshing.
      if (
        !hasPositionedCameraRef.current &&
        !userInteractingRef.current &&
        mapRef.current
      ) {
        hasPositionedCameraRef.current = true;
        mapRef.current.animateCamera(
          {
            center: { latitude: loc.lat, longitude: loc.lng },
            heading: loc.heading ?? 0,
            pitch: 45,
            zoom: 17,
          },
          { duration: 800 },
        );
      }
    },
  });

  const handleUserInteraction = () => {
    userInteractingRef.current = true;
    if (interactionTimeoutRef.current)
      clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      userInteractingRef.current = false;
    }, USER_INTERACTION_COOLDOWN_MS);
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current)
        clearTimeout(interactionTimeoutRef.current);
    };
  }, []);

  // Pickup coordinate (Django returns Decimal strings — coerce to number)
  const pickupLat = tripData?.pickup_lat ? Number(tripData.pickup_lat) : null;
  const pickupLng = tripData?.pickup_lng ? Number(tripData.pickup_lng) : null;
  const hasPickup = pickupLat !== null && pickupLng !== null;

  const driverCoord = driverLoc
    ? { latitude: driverLoc.lat, longitude: driverLoc.lng }
    : null;

  // ── Once map is ready + we have both points, fit them on screen (once) ──
  const hasFitOnceRef = useRef(false);
  useEffect(() => {
    if (hasFitOnceRef.current) return;
    if (!mapReady || !hasPickup || !driverCoord) return;
    hasFitOnceRef.current = true;
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        [driverCoord, { latitude: pickupLat!, longitude: pickupLng! }],
        {
          edgePadding: { top: 80, right: 60, bottom: 280, left: 60 },
          animated: true,
        },
      );
    }, 600);
  }, [mapReady, hasPickup, !!driverCoord]);

  const handleStartRide = () => {
    router.push({
      pathname: '/(driver)/otp-verify',
      params: { tripId, action: 'start' },
    });
  };

  // ── Loading ─────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── MAP ─────────────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={
          hasPickup
            ? {
                latitude: pickupLat!,
                longitude: pickupLng!,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }
            : YOLA_REGION
        }
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={true}
        onMapReady={() => setMapReady(true)}
        onPanDrag={handleUserInteraction}
      >
        {/* Route from driver → pickup, refreshed every 30s from our backend */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#FF8C00"
            strokeWidth={5}
          />
        )}

        {/* Pickup pin */}
        {hasPickup && (
          <Marker
            coordinate={{ latitude: pickupLat!, longitude: pickupLng! }}
            title="Pickup"
            pinColor="#22C55E"
          />
        )}

        {/* Animated driver keke marker */}
        {driverCoord && (
          <DriverMarker
            coordinate={driverCoord}
            heading={driverLoc?.heading ?? 0}
          />
        )}
      </MapView>

      {/* ── BOTTOM PANEL ────────────────────────────────────────────────── */}
      <View style={styles.panel}>
        <View style={styles.panelHandle} />

        {/* ETA + distance row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{eta}</Text>
            <Text style={styles.statLabel}>ETA</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{distance}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>

        {routeError && (
          <Text accessibilityRole="alert" style={styles.routeError}>
            {routeError}
          </Text>
        )}

        {driverLocationError && (
          <Text accessibilityRole="alert" style={styles.routeError}>
            GPS is unavailable: {driverLocationError}
          </Text>
        )}

        {/* Pickup name */}
        <View style={styles.pickupRow}>
          <Navigation size={16} color="#FF8C00" />
          <Text style={styles.pickupText} numberOfLines={1}>
            {tripData?.pickup_location_name ?? 'Pickup Location'}
          </Text>
        </View>

        {/* Rider info */}
        <View style={styles.riderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(tripData?.rider_name ?? 'R')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.riderName}>
            {tripData?.rider_name ?? 'Rider'}
          </Text>
        </View>

        {/* Action button */}
        <Pressable style={styles.startBtn} onPress={handleStartRide}>
          <Play size={20} color="#fff" />
          <Text style={styles.startBtnText}>Start Ride</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // ── Panel ──
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#374151' },
  routeError: {
    color: '#FCD34D',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },

  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pickupText: { flex: 1, color: '#D1D5DB', fontSize: 14 },

  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  riderName: { color: '#fff', fontSize: 16, fontWeight: '600' },

  startBtn: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
