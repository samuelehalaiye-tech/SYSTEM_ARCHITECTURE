import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Marker } from 'react-native-maps';

import MapComponent from '@/components/MapComponent';
import DriverMarker from '@/components/DriverMarker';
import TripInfoPanel from '@/components/TripInfoPanel';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDriverLocation } from '@/hooks/useDriverLocation';
import { getRouteToPickup } from '@/services/endpoints/tracking';
import { getCurrentTrip } from '@/services/endpoints/driver';
import { decodePolyline } from '@/services/polylineUtils';

export default function PreRideTracking() {
  const params = useLocalSearchParams();
  const tripId = Array.isArray(params.tripId) ? params.tripId[0] : params.tripId;
  const router = useRouter();
  
  const [token, setToken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [eta, setEta] = useState<string>('');
  const [distance, setDistance] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const t = await AsyncStorage.getItem('userToken');
      setToken(t);
      if (t && tripId) {
        try {
          const trip = await getCurrentTrip(t);
          // getCurrentTrip returns the active trip — accept it regardless of id match
          // (driver only has one active trip at a time)
          if (trip && trip.active !== false) {
            setTripData(trip);
          }
          
          const rd = await getRouteToPickup(tripId as string, t);
          setRouteData(rd);
          if (rd.polyline) {
            setRouteCoords(decodePolyline(rd.polyline));
          }
          // Backend field names from Google Directions: distance_text / duration_text
          if (rd.duration_text) setEta(rd.duration_text);
          else if (rd.eta) setEta(rd.eta);
          if (rd.distance_text) setDistance(rd.distance_text);
          else if (rd.distance) setDistance(rd.distance);
        } catch (e) {
          console.error('PreRideTracking init error:', e);
        }
      }
    };
    init();
  }, [tripId]);

  const { sendMessage } = useWebSocket({
    url: tripId ? `/ws/tracking/${tripId}/` : '',
    token,
    enabled: !!tripId && !!token
  });

  const { location } = useDriverLocation({
    enabled: true,
    onLocationUpdate: (loc) => {
      sendMessage({
        type: 'location',
        lat: loc.lat,
        lng: loc.lng,
        heading: loc.heading,
        speed: loc.speed,
        accuracy: loc.accuracy,
        timestamp: loc.timestamp
      });
    }
  });

  const handleNavigate = () => {
    // Primary: pickup_lat/lng on the tripData object (from getCurrentTrip)
    let plat: number | null = tripData?.pickup_lat ? Number(tripData.pickup_lat) : null;
    let plng: number | null = tripData?.pickup_lng ? Number(tripData.pickup_lng) : null;

    // Fallback: pickup coords returned by the route endpoint
    if ((!plat || !plng) && routeData?.pickup_lat) {
      plat = Number(routeData.pickup_lat);
      plng = Number(routeData.pickup_lng);
    }

    // Last resort: first coord in the route (destination of the route to pickup)
    if ((!plat || !plng) && routeCoords.length > 0) {
      const last = routeCoords[routeCoords.length - 1];
      plat = last.latitude;
      plng = last.longitude;
    }

    if (plat && plng) {
      Linking.openURL(`google.navigation:q=${plat},${plng}`);
    } else {
      Alert.alert('Error', 'Pickup location not available yet. Make sure your GPS is on.');
    }
  };

  const handleStartRide = () => {
    router.push({ pathname: '/(driver)/otp-verify', params: { tripId: tripId, action: 'start' } });
  };

  if (!token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  // Derive pickup location — coerce Decimal strings from Django to numbers
  const pLat = tripData?.pickup_lat ? Number(tripData.pickup_lat) : (routeData?.pickup_lat ? Number(routeData.pickup_lat) : null);
  const pLng = tripData?.pickup_lng ? Number(tripData.pickup_lng) : (routeData?.pickup_lng ? Number(routeData.pickup_lng) : null);

  // Give the map an initial region centred on the pickup so it's not blank
  const mapInitialRegion = pLat && pLng ? {
    latitude: pLat,
    longitude: pLng,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  } : undefined;

  return (
    <View style={styles.container}>
      <MapComponent
        style={StyleSheet.absoluteFillObject}
        polylineCoords={routeCoords}
        showUserLocation={false}
        initialRegion={mapInitialRegion}
      >
        {location && (
          <DriverMarker
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            heading={location.heading || 0}
          />
        )}
        {pLat && pLng && (
          <Marker
            coordinate={{ latitude: pLat, longitude: pLng }}
            title="Pickup Location"
            pinColor="#22C55E"
          />
        )}
      </MapComponent>

      <TripInfoPanel
        driverName={tripData?.rider_name || 'Rider'}
        pickupName={tripData?.pickup_location_name || tripData?.pickup_name || 'Pickup Location'}
        eta={eta}
        distance={distance}
        isDriver={true}
        onNavigate={handleNavigate}
        onStartRide={handleStartRide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
