import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Marker } from 'react-native-maps';

import MapComponent from '@/components/MapComponent';
import DriverMarker from '@/components/DriverMarker';
import TripInfoPanel from '@/components/TripInfoPanel';
import { useDriverTracking } from '@/hooks/useDriverTracking';
import { cancelTrip, getTripStatus } from '@/services/endpoints/rider';

export default function DriverApproaching() {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  
  const [token, setToken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const init = async () => {
      const t = await AsyncStorage.getItem('userToken');
      setToken(t);
      if (t && tripId) {
        try {
          const trip = await getTripStatus(tripId as string, t);
          setTripData(trip);
        } catch (e) {
          console.error(e);
        }
      }
    };
    init();
  }, [tripId]);

  const { driverLocation, distance, eta, routeCoords, isLoading } = useDriverTracking({
    tripId: tripId as string,
    token,
    enabled: !!tripId && !!token
  });

  const handleCancel = async () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            if (!token || !tripId) return;
            try {
              setCancelling(true);
              const result = await cancelTrip(tripId as string, token);
              if (result.status === "success") {
                Alert.alert("Success", "Ride cancelled successfully");
                router.replace('/(rider)/riderHome');
              } else {
                Alert.alert("Error", result.error || "Failed to cancel ride");
              }
            } catch (error) {
              Alert.alert("Error", "Network error. Please try again.");
            } finally {
              setCancelling(false);
            }
          }
        }
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert("SOS", "Alerting Security...");
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
        showUserLocation={true}
      >
        {driverLocation && (
          <DriverMarker
            coordinate={{ latitude: driverLocation.lat, longitude: driverLocation.lng }}
            heading={driverLocation.heading || 0}
          />
        )}
        {pLat && pLng && (
          <Marker
            coordinate={{ latitude: pLat, longitude: pLng }}
            title="Pickup Location"
            pinColor="#FF8C00"
          />
        )}
      </MapComponent>

      <TripInfoPanel
        driverName={tripData?.driver?.name || 'Driver'}
        plateNumber={tripData?.driver?.keke_plate || '---'}
        otp={tripData?.otp || '----'}
        eta={eta}
        distance={distance}
        isDriver={false}
        onCancel={handleCancel}
        onSOS={handleSOS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
