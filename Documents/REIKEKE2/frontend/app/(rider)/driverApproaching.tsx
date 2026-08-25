import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
  Linking,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Phone, Shield, XCircle, LocateFixed } from 'lucide-react-native';

import DriverMarker from '@/components/DriverMarker';
import { YOLA_REGION } from '@/components/MapComponent';
import { useDriverTracking } from '@/hooks/useDriverTracking';
import { usePassengerLocation } from '@/hooks/usePassengerLocation';
import { cancelTrip, getTripStatus } from '@/services/endpoints/rider';
import { useCustomAlert } from '@/contexts/AlertContext';

const TRIP_STATUS_REFRESH_MS = 5000;
const PANEL_COLLAPSED_OFFSET = 260;

export default function DriverApproaching() {
  const params = useLocalSearchParams();
  const tripId = Array.isArray(params.tripId)
    ? params.tripId[0]
    : params.tripId;
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const mapRef = useRef<MapView>(null);
  const hasFitOnceRef = useRef(false);
  const completionHandledRef = useRef(false);
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
          (gestureState.vy >= -0.5 && panelOffsetRef.current > PANEL_COLLAPSED_OFFSET / 2);
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

  const [token, setToken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const { showAlert } = useCustomAlert();

  // ── Load token ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem('userToken');
      setToken(t);
    };
    loadToken();
  }, []);

  // Refresh status so the screen gets the newly rotated end PIN and changes
  // its target from pickup to dropoff as soon as the driver starts the ride.
  useEffect(() => {
    if (!token || !tripId) return;

    let cancelled = false;
    const refreshTrip = async () => {
      try {
        const trip = await getTripStatus(tripId as string, token);
        if (cancelled) return;

        setTripData(trip);

        if (trip.status === 'COMPLETED' && !completionHandledRef.current) {
          completionHandledRef.current = true;
          showAlert('Ride completed', 'You have arrived at your destination.', [
            {
              text: 'Back to Home',
              onPress: () => routerRef.current.replace('/(rider)/riderHome'),
            },
          ]);
        }
      } catch (e) {
        console.error('driverApproaching status refresh:', e);
      }
    };

    void refreshTrip();
    const interval = setInterval(refreshTrip, TRIP_STATUS_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [tripId, token]);

  // Seed the hook with whatever the initial REST call already knows,
  // so the map isn't blank while the WS/route fetch is still spinning up.
  const seededDriverLoc =
    tripData?.driver_lat && tripData?.driver_lng
      ? { lat: Number(tripData.driver_lat), lng: Number(tripData.driver_lng) }
      : undefined;

  const routePhase = tripData?.status === 'STARTED' ? 'dropoff' : 'pickup';
  const isRideStarted = routePhase === 'dropoff';
  const dropoffCoord =
    tripData?.dropoff_lat != null && tripData?.dropoff_lng != null
      ? {
          latitude: Number(tripData.dropoff_lat),
          longitude: Number(tripData.dropoff_lng),
        }
      : null;

  // ── One hook handles: WebSocket live updates, REST polling fallback
  //    when the socket is down, and a throttled (30s) route/ETA refresh
  //    from the backend — no per-tick Google Directions calls from the client.
  const { driverLocation, distance, eta, routeCoords, isConnected, sendMessage } =
    useDriverTracking({
      tripId: (tripId as string) ?? null,
      token,
      enabled: !!tripId && !!token,
      initialDriverLocation: seededDriverLoc,
      routePhase,
    });

    // Send passenger device GPS to backend so drivers can see live passenger location
    const { location: passengerLocation } = usePassengerLocation({
      enabled: !!tripId && !!token,
      onLocationUpdate: async (loc) => {
        try {
          if (!tripId || !token) return;
          sendMessage?.({ type: 'location', ...loc });
          const { updatePassengerLocation } = await import('@/services/endpoints/tracking');
          await updatePassengerLocation(tripId as string, loc, token);
        } catch (e) {
          console.error('Failed to update passenger location:', e);
        }
      },
      intervalMs: 2000,
    });

  const driverCoord = driverLocation
    ? { latitude: driverLocation.lat, longitude: driverLocation.lng }
    : null;

  // Re-fit only when the route phase changes, not for ordinary GPS updates.
  useEffect(() => {
    hasFitOnceRef.current = false;
  }, [routePhase]);

  useEffect(() => {
    if (hasFitOnceRef.current) return;
    if (isRideStarted) return;
    if (!mapReady || !driverCoord || !passengerLocation) return;

    hasFitOnceRef.current = true;
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        [driverCoord, {
          latitude: passengerLocation.lat,
          longitude: passengerLocation.lng,
        }],
        {
          edgePadding: { top: 80, right: 60, bottom: 300, left: 60 },
          animated: true,
        },
      );
    }, 600);
  }, [mapReady, driverCoord, passengerLocation, routePhase, isRideStarted]);

  useEffect(() => {
    if (!mapReady || !isRideStarted || !dropoffCoord) return;
    mapRef.current?.animateCamera(
      { center: dropoffCoord, zoom: 15 },
      { duration: 800 },
    );
  }, [
    mapReady,
    isRideStarted,
    dropoffCoord?.latitude,
    dropoffCoord?.longitude,
  ]);

  const handleRecenter = () => {
    if (!driverCoord || !passengerLocation) return;
    mapRef.current?.fitToCoordinates(
      [driverCoord, {
        latitude: passengerLocation.lat,
        longitude: passengerLocation.lng,
      }],
      {
        edgePadding: { top: 80, right: 60, bottom: 300, left: 60 },
        animated: true,
      },
    );
  };

  // ── Cancel ──────────────────────────────────────────────────────────────
  const handleCancel = () => {
    showAlert('Cancel Ride', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          if (!token || !tripId) return;
          setCancelling(true);
          try {
            const result = await cancelTrip(tripId as string, token);
            if (result.status === 'success') {
              router.replace('/(rider)/riderHome');
            } else {
              showAlert('Error', result.error ?? 'Failed to cancel');
            }
          } catch {
            showAlert('Error', 'Network error. Try again.');
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  const handleSOS = () =>
    showAlert('SOS', 'Emergency alert sent to security!');

  const handleCallDriver = () => {
    const phone = tripData?.driver?.phone;
    if (!phone || phone === 'N/A') {
      showAlert('Unavailable', 'The driver phone number is not available.');
      return;
    }

    showAlert(
      'Call driver?',
      'This will share your phone number with the driver through a normal phone call.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) },
      ],
    );
  };

  // ── Loading ─────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  if (tripData?.status === 'COMPLETED') {
    return <View style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* ── MAP ─────────────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={
          driverCoord
            ? {
                latitude: driverCoord.latitude,
                longitude: driverCoord.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }
            : YOLA_REGION
        }
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={true}
        onMapReady={() => setMapReady(true)}
      >
        {/* In-ride road route: driver/passenger group toward the dropoff. */}
        {isRideStarted && routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#0EA5E9"
            strokeWidth={5}
          />
        )}

        {/* Live connection line between the two people in the ride. */}
        {driverCoord && passengerLocation && (
          <Polyline
            coordinates={[driverCoord, {
              latitude: passengerLocation.lat,
              longitude: passengerLocation.lng,
            }]}
            strokeColor="#FF8C00"
            strokeWidth={5}
          />
        )}

        {/* Passenger's actual device position; this is independent of pickup. */}
        {passengerLocation && (
          <Marker
            coordinate={{
              latitude: passengerLocation.lat,
              longitude: passengerLocation.lng,
            }}
            title="Your live location"
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

        {/* Animated driver keke */}
        {driverCoord && (
          <DriverMarker
            coordinate={driverCoord}
            heading={driverLocation?.heading ?? 0}
          />
        )}
      </MapView>

      {/* Recenter button — replaces the old "auto re-fit on every update" */}
      <Pressable style={styles.recenterBtn} onPress={handleRecenter}>
        <LocateFixed size={20} color="#111827" />
      </Pressable>

      {/* Small, honest connection indicator instead of silent failure */}
      {!isConnected && (
        <View style={styles.connBanner}>
          <Text style={styles.connBannerText}>
            Reconnecting to live tracking…
          </Text>
        </View>
      )}

      {/* ── BOTTOM PANEL ────────────────────────────────────────────────── */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateY: panelOffset }] }]}
      >
        <View style={styles.panelHandleTouchTarget} {...panelPanResponder.panHandlers}>
          <View style={styles.panelHandle} />
        </View>

        {/* ETA + distance */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{eta || '--'}</Text>
            <Text style={styles.statLabel}>
              {isRideStarted ? 'Arrival ETA' : 'Driver ETA'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{distance || '--'}</Text>
            <Text style={styles.statLabel}>
              {isRideStarted ? 'Remaining' : 'Away'}
            </Text>
          </View>
          {tripData?.otp && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text
                  style={[
                    styles.statValue,
                    { color: '#FF8C00', letterSpacing: 4 },
                  ]}
                >
                  {tripData.otp}
                </Text>
                <Text style={styles.statLabel}>
                  {isRideStarted ? 'End PIN' : 'Start PIN'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Driver info */}
        {tripData?.driver && (
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(tripData.driver.name ?? 'D')[0].toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>
                {tripData.driver.name ?? 'Driver'}
              </Text>
              {tripData.driver.keke_plate ? (
                <View style={styles.plateBadge}>
                  <Text style={styles.plateText}>
                    {tripData.driver.keke_plate}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionBtn, styles.callBtn]}
            onPress={handleCallDriver}
          >
            <Phone size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Call</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.sosBtn]}
            onPress={handleSOS}
          >
            <Shield size={20} color="#fff" />
            <Text style={styles.actionBtnText}>SOS</Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionBtn,
              styles.cancelBtn,
              cancelling && styles.btnDisabled,
            ]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : (
              <>
                <XCircle size={20} color="#DC2626" />
                <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>
                  Cancel
                </Text>
              </>
            )}
          </Pressable>
        </View>
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
    right: 16,
    bottom: 260,
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

  connBanner: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  connBannerText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },

  // Panel
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
    gap: 20,
  },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },

  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAFAFA',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FF8C00', fontSize: 20, fontWeight: '700' },
  driverName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  plateBadge: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  plateText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },

  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callBtn: { backgroundColor: '#2563EB' },
  sosBtn: { backgroundColor: '#DC2626' },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  btnDisabled: { opacity: 0.5 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
