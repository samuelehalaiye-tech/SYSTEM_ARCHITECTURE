import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle, LocateFixed, Navigation, Phone, Play } from 'lucide-react-native';
import { useCustomAlert } from '@/contexts/AlertContext';

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
import { getPassengerPosition } from '@/services/endpoints/tracking';
import { decodePolyline } from '@/services/polylineUtils';

const ROUTE_REFRESH_MS = 30000;
const USER_INTERACTION_COOLDOWN_MS = 5000;
const PANEL_COLLAPSED_OFFSET = 260;

const sameTripData = (current: any, next: any) =>
  current?.trip_id === next?.trip_id &&
  current?.status === next?.status &&
  current?.otp === next?.otp &&
  current?.pickup_lat === next?.pickup_lat &&
  current?.pickup_lng === next?.pickup_lng &&
  current?.dropoff_lat === next?.dropoff_lat &&
  current?.dropoff_lng === next?.dropoff_lng &&
  current?.rider_name === next?.rider_name;

const getBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const startLatRad = toRad(startLat);
  const startLngRad = toRad(startLng);
  const destLatRad = toRad(destLat);
  const destLngRad = toRad(destLng);

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
};

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
  const [passengerCoord, setPassengerCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  const { showAlert } = useCustomAlert();

  const handleCallRider = () => {
    const phone = tripData?.rider_phone;
    if (!phone || phone === 'N/A') {
      showAlert('Unavailable', 'The passenger phone number is not available.');
      return;
    }

    showAlert(
      'Call passenger?',
      'This will share your phone number with the passenger through a normal phone call.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) },
      ],
    );
  };

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
  const panelOffset = useRef(new Animated.Value(0)).current;
  const panelOffsetRef = useRef(0);
  const panelPanStartRef = useRef(0);

  const panelPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        panelPanStartRef.current = panelOffsetRef.current;
        panelOffset.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const nextOffset = Math.max(
          0,
          Math.min(
            PANEL_COLLAPSED_OFFSET,
            panelPanStartRef.current + gestureState.dy,
          ),
        );
        panelOffsetRef.current = nextOffset;
        panelOffset.setValue(nextOffset);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldCollapse =
          gestureState.vy > 0.5 ||
          (gestureState.vy >= -0.5 &&
            panelOffsetRef.current > PANEL_COLLAPSED_OFFSET / 2);
        const nextOffset = shouldCollapse ? PANEL_COLLAPSED_OFFSET : 0;
        panelOffsetRef.current = nextOffset;
        Animated.spring(panelOffset, {
          toValue: nextOffset,
          useNativeDriver: true,
          tension: 75,
          friction: 12,
        }).start();
      },
      onPanResponderTerminate: () => {
        panelOffsetRef.current = 0;
        Animated.spring(panelOffset, {
          toValue: 0,
          useNativeDriver: true,
          tension: 75,
          friction: 12,
        }).start();
      },
    }),
  ).current;

  // ── Load token + trip data ──────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const t = await AsyncStorage.getItem('userToken');
      setToken(t);
      if (!t) return;
      try {
        const trip = await getCurrentTrip(t);
        if (trip && trip.active !== false) {
          setTripData((current: any) => sameTripData(current, trip) ? current : trip);
        }
      } catch (e) {
        console.error('PreRideTracking init:', e);
      }
    };
    init();
  }, []);

  // Keep this screen in sync after the driver starts or completes the ride.
  useEffect(() => {
    if (!token || !tripId) return;

    let cancelled = false;
    const refreshTrip = async () => {
      try {
        const trip = await getCurrentTrip(token);
        if (!cancelled && trip?.trip_id === tripId) {
          setTripData((current: any) => sameTripData(current, trip) ? current : trip);
        }
      } catch (e) {
        console.error('PreRideTracking status refresh:', e);
      }
    };

    void refreshTrip();
    const interval = setInterval(refreshTrip, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, tripId]);

  // ── WebSocket — broadcast driver GPS to passenger ───────────────────────
  const { sendMessage } = useWebSocket({
    url: tripId ? `/ws/tracking/${tripId}/` : '',
    token,
    enabled: !!tripId && !!token,
    onMessage: (data) => {
      const loc = data.location ?? data;
      if (
        data.role === 'passenger' &&
        loc.lat != null &&
        loc.lng != null
      ) {
        const nextPassengerCoord = {
          latitude: Number(loc.lat),
          longitude: Number(loc.lng),
        };
        setPassengerCoord((current) =>
          current &&
          Math.abs(current.latitude - nextPassengerCoord.latitude) < 0.00008 &&
          Math.abs(current.longitude - nextPassengerCoord.longitude) < 0.00008
            ? current
            : nextPassengerCoord,
        );
      }
    },
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

  // Poll passenger live location (REST fallback) so driver map can show passenger device
  useEffect(() => {
    if (!tripId || !token) return;

    let cancelled = false;
    const fetchPassenger = async () => {
      try {
        const data = await getPassengerPosition(tripId as string, token);
        if (cancelled) return;
        if (data && data.passenger_lat && data.passenger_lng) {
          const nextPassengerCoord = {
            latitude: Number(data.passenger_lat),
            longitude: Number(data.passenger_lng),
          };
          setPassengerCoord((current) =>
            current &&
            Math.abs(current.latitude - nextPassengerCoord.latitude) < 0.00008 &&
            Math.abs(current.longitude - nextPassengerCoord.longitude) < 0.00008
              ? current
              : nextPassengerCoord,
          );
        }
      } catch (e) {
        // ignore 404/unauthorized quietly — passenger location may not be available yet
      }
    };

    void fetchPassenger();
    const interval = setInterval(fetchPassenger, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [tripId, token]);

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

  // Pickup coordinates are still used for the route and initial map centre.
  const pickupLat = tripData?.pickup_lat ? Number(tripData.pickup_lat) : null;
  const pickupLng = tripData?.pickup_lng ? Number(tripData.pickup_lng) : null;
  const hasPickup = pickupLat !== null && pickupLng !== null;

  const initialRegion = useMemo(() => {
    return hasPickup
      ? {
          latitude: pickupLat,
          longitude: pickupLng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }
      : YOLA_REGION;
  }, [hasPickup, pickupLat, pickupLng]);

  const driverCoord = driverLoc
    ? { latitude: driverLoc.lat, longitude: driverLoc.lng }
    : null;
  const isRideStarted = tripData?.status === 'STARTED';
  const dropoffCoord =
    tripData?.dropoff_lat != null && tripData?.dropoff_lng != null
      ? {
          latitude: Number(tripData.dropoff_lat),
          longitude: Number(tripData.dropoff_lng),
        }
      : null;

  // Determine the current destination (pickup or dropoff)
  const currentDestination = isRideStarted 
    ? dropoffCoord 
    : (passengerCoord || (hasPickup ? { latitude: pickupLat!, longitude: pickupLng! } : null));

  // Calculate the ideal bearing to look at the destination
  const targetBearing = (driverCoord && currentDestination)
    ? getBearing(driverCoord.latitude, driverCoord.longitude, currentDestination.latitude, currentDestination.longitude)
    : (driverLoc?.heading ?? 0);

  const handleRecenter = useCallback(() => {
    if (driverCoord) {
      mapRef.current?.animateCamera(
        { 
          center: driverCoord, 
          zoom: 18,
          pitch: 60,
          heading: targetBearing
        },
        { duration: 800 },
      );
      return;
    }

    if (currentDestination) {
      mapRef.current?.animateCamera(
        { center: currentDestination, zoom: 15 },
        { duration: 800 },
      );
    }
  }, [driverCoord, currentDestination, targetBearing]);

  const handleRideAction = () => {
    router.push({
      pathname: '/(driver)/otp-verify',
      params: { tripId, action: isRideStarted ? 'end' : 'start' },
    });
  };

  // ── Once map is ready + both live positions exist, launch 3D perspective ────
  const hasFitOnceRef = useRef(false);
  useEffect(() => {
    if (hasFitOnceRef.current) return;
    
    if (!mapReady || !driverCoord || !currentDestination) return;
    
    hasFitOnceRef.current = true;
    setTimeout(() => {
      handleRecenter();
    }, 600);
  }, [mapReady, !!driverCoord, currentDestination, handleRecenter]);

  useEffect(() => {
    if (!mapReady || !isRideStarted || !dropoffCoord) return;
    // Auto-recenter once when the ride starts so it faces the dropoff
    setTimeout(() => {
      handleRecenter();
    }, 400);
  }, [
    mapReady,
    isRideStarted,
    dropoffCoord?.latitude,
    dropoffCoord?.longitude,
    handleRecenter,
  ]);

  const connectionCoords = useMemo(() => {
    return driverCoord && passengerCoord ? [driverCoord, passengerCoord] : null;
  }, [driverCoord?.latitude, driverCoord?.longitude, passengerCoord?.latitude, passengerCoord?.longitude]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (!token || tripData?.status === 'COMPLETED') {
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
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={true}
        onMapReady={() => setMapReady(true)}
        onPanDrag={handleUserInteraction}
      >
        {/* Live road connection line */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#0EA5E9"
            strokeWidth={5}
          />
        )}

        {/* Live connection line between the two people in the ride. */}
        {connectionCoords && (
          <Polyline
            coordinates={connectionCoords}
            strokeColor="#FF8C00"
            strokeWidth={5}
          />
        )}

        {/* Animated driver keke marker */}
        {driverCoord && (
          <DriverMarker
            coordinate={driverCoord}
            heading={targetBearing}
          />
        )}

        {/* Live passenger device marker (if available) */}
        {passengerCoord && (
          <Marker
            coordinate={passengerCoord}
            title="Passenger"
            pinColor="#2563EB"
          />
        )}

        {isRideStarted && dropoffCoord && (
          <Marker
            coordinate={dropoffCoord}
            title="Dropoff"
            pinColor="#EF4444"
          />
        )}
      </MapView>

      <Pressable
        accessibilityLabel="Center map on ride"
        style={styles.recenterBtn}
        onPress={handleRecenter}
      >
        <LocateFixed size={20} color="#111827" />
      </Pressable>

      {/* ── BOTTOM PANEL ────────────────────────────────────────────────── */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateY: panelOffset }] }]}
      >
        <View
          style={styles.panelHandleTouchTarget}
          {...panelPanResponder.panHandlers}
        >
          <View style={styles.panelHandle} />
        </View>

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

        {/* Current trip destination/status */}
        <View style={styles.pickupRow}>
          <Navigation size={16} color="#FF8C00" />
          <Text style={styles.pickupText} numberOfLines={1}>
            {isRideStarted
              ? tripData?.dropoff_location_name ?? 'Dropoff Location'
              : tripData?.pickup_location_name ?? 'Pickup Location'}
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
        <Pressable style={styles.callBtn} onPress={handleCallRider}>
          <Phone size={20} color="#fff" />
          <Text style={styles.callBtnText}>Call Passenger</Text>
        </Pressable>
        <Pressable style={styles.startBtn} onPress={handleRideAction}>
          {isRideStarted ? (
            <CheckCircle size={20} color="#fff" />
          ) : (
            <Play size={20} color="#fff" />
          )}
          <Text style={styles.startBtnText}>
            {isRideStarted ? 'End Ride' : 'Start Ride'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },

  recenterBtn: {
    position: 'absolute',
    top: 110,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── Panel ──
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 16,
    borderTopWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  panelHandleTouchTarget: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },
  routeError: {
    color: '#DC2626',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },

  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  pickupText: { flex: 1, color: '#111827', fontSize: 14 },

  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FF8C00', fontSize: 18, fontWeight: '700' },
  riderName: { color: '#111827', fontSize: 16, fontWeight: '700' },

  callBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  callBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  startBtn: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
