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
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  
  const [token, setToken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
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
          if (trip && trip.trip_id === tripId) {
            setTripData(trip);
          }
          
          const routeData = await getRouteToPickup(tripId as string, t);
          if (routeData.polyline) {
            setRouteCoords(decodePolyline(routeData.polyline));
          }
          if (routeData.eta) setEta(routeData.eta);
          if (routeData.distance) setDistance(routeData.distance);
        } catch (e) {
          console.error(e);
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
    // If backend returns pickup_lat/lng directly on trip:
    let plat = tripData?.pickup_lat;
    let plng = tripData?.pickup_lng;
    
    // Fallback: Last coordinate of the route
    if (!plat || !plng) {
        if (routeCoords.length > 0) {
            const lastCoord = routeCoords[routeCoords.length - 1];
            plat = lastCoord.latitude;
            plng = lastCoord.longitude;
        }
    }

    if (plat && plng) {
      Linking.openURL(`google.navigation:q=${plat},${plng}`);
    } else {
      Alert.alert('Error', 'Pickup location not available');
    }
  };

  const handleStartRide = () => {
    router.push({ pathname: '/(driver)/otp-verify', params: { tripId: tripId, action: 'start' } });
  };

  if (!tripData && !token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  // Derive pickup location for the pin
  let pLat = tripData?.pickup_lat;
  let pLng = tripData?.pickup_lng;
  if ((!pLat || !pLng) && routeCoords.length > 0) {
      const lastCoord = routeCoords[routeCoords.length - 1];
      pLat = lastCoord.latitude;
      pLng = lastCoord.longitude;
  }

  return (
    <View style={styles.container}>
      <MapComponent
        style={StyleSheet.absoluteFillObject}
        polylineCoords={routeCoords}
        showUserLocation={false}
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
        pickupName={tripData?.pickup_name || 'Pickup Location'}
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
