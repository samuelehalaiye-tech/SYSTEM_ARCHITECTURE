import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Pressable,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shield, XCircle, LocateFixed } from 'lucide-react-native';

import DriverMarker from '@/components/DriverMarker';
import { YOLA_REGION } from '@/components/MapComponent';
import { useDriverTracking } from '@/hooks/useDriverTracking';
import { cancelTrip, getTripStatus } from '@/services/endpoints/rider';

const TRIP_STATUS_REFRESH_MS = 5000;

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

  const [token, setToken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const [mapReady, setMapReady] = useState(false);

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
          Alert.alert('Ride completed', 'You have arrived at your destination.', [
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
  const targetLat = isRideStarted
    ? tripData?.dropoff_lat
    : tripData?.pickup_lat;
  const targetLng = isRideStarted
    ? tripData?.dropoff_lng
    : tripData?.pickup_lng;
  const targetCoord =
    targetLat != null && targetLng != null
      ? { latitude: Number(targetLat), longitude: Number(targetLng) }
      : null;
  const targetTitle = isRideStarted ? 'Your Destination' : 'Your Pickup';

  // ── One hook handles: WebSocket live updates, REST polling fallback
  //    when the socket is down, and a throttled (30s) route/ETA refresh
  //    from the backend — no per-tick Google Directions calls from the client.
  const { driverLocation, distance, eta, routeCoords, isConnected } =
    useDriverTracking({
      tripId: (tripId as string) ?? null,
      token,
      enabled: !!tripId && !!token,
      initialDriverLocation: seededDriverLoc,
      routePhase,
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
    if (!mapReady || !targetCoord || !driverCoord) return;

    hasFitOnceRef.current = true;
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        [driverCoord, targetCoord],
        {
          edgePadding: { top: 80, right: 60, bottom: 300, left: 60 },
          animated: true,
        },
      );
    }, 600);
  }, [mapReady, targetCoord, driverCoord, routePhase]);

  const handleRecenter = () => {
    if (!driverCoord || !targetCoord) return;
    mapRef.current?.fitToCoordinates(
      [driverCoord, targetCoord],
      {
        edgePadding: { top: 80, right: 60, bottom: 300, left: 60 },
        animated: true,
      },
    );
  };

  // ── Cancel ──────────────────────────────────────────────────────────────
  const handleCancel = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel?', [
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
              Alert.alert('Error', result.error ?? 'Failed to cancel');
            }
          } catch {
            Alert.alert('Error', 'Network error. Try again.');
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  const handleSOS = () =>
    Alert.alert('SOS', 'Emergency alert sent to security!');

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
          targetCoord
            ? {
                latitude: targetCoord.latitude,
                longitude: targetCoord.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }
            : YOLA_REGION
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        onMapReady={() => setMapReady(true)}
      >
        {/* Route polyline, decoded from the backend's traffic-aware
            Directions response — refreshed every 30s by the hook,
            NOT re-queried from Google on every GPS tick. */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#FF8C00"
            strokeWidth={5}
          />
        )}

        {/* Pickup before start; destination after start */}
        {targetCoord && (
          <Marker
            coordinate={targetCoord}
            title={targetTitle}
            pinColor={isRideStarted ? '#EF4444' : '#22C55E'}
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
      <View style={styles.panel}>
        <View style={styles.panelHandle} />

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
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <XCircle size={20} color="#EF4444" />
                <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>
                  Cancel
                </Text>
              </>
            )}
          </Pressable>
        </View>
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

  recenterBtn: {
    position: 'absolute',
    right: 16,
    bottom: 260,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },

  connBanner: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(17,24,39,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connBannerText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Panel
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
    gap: 20,
  },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#374151' },

  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1F2937',
    padding: 14,
    borderRadius: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  driverName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#111827',
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
    borderRadius: 14,
    gap: 8,
  },
  sosBtn: { backgroundColor: '#EF4444' },
  cancelBtn: {
    backgroundColor: '#1F2937',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  btnDisabled: { opacity: 0.5 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
