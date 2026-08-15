import React, { useState, useEffect } from 'react';
import { 
  View, Text, Pressable, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform,ActivityIndicator
} from 'react-native';
// Use the modern Safe Area context
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getTripStatus, cancelTrip } from '@/services/endpoints/rider'; 
import { BASE_URL } from '@/services/config';
import {
  MapPin,
  Navigation,
} from 'lucide-react-native';

export default function PassengerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { active_trip_id } = useLocalSearchParams();


  const [cancelling, setCancelling] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [dropoffCoords, setDropoffCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [activeTrip, setActiveTrip] = useState<any>(null);

useEffect(() => {
  const loadLocations = async () => {
    try {
      const pickupData = await AsyncStorage.getItem(
        'reikeke_pickup_location'
      );

      const dropoffData = await AsyncStorage.getItem(
        'reikeke_dropoff_location'
      );

      if (pickupData) {
        const location = JSON.parse(pickupData);

        setPickup(location.description);
        setPickupCoords({
          lat: location.lat,
          lng: location.lng,
        });
      }

      if (dropoffData) {
        const location = JSON.parse(dropoffData);

        setDropoff(location.description);
        setDropoffCoords({
          lat: location.lat,
          lng: location.lng,
        });
      }
    } catch (error) {
      console.error('Failed to load saved locations:', error);
    }
  };

  loadLocations();
}, []);



  const handleCancelRide = async () => {
  if (!activeTrip) return;

  Alert.alert(
    "Cancel Ride",
    "Are you sure you want to cancel this ride?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            setCancelling(true);
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
              Alert.alert("Error", "Please login again");
              return;
            }

            const result = await cancelTrip(activeTrip.trip_id, token);

            if (result.status === "success") {
              setActiveTrip(null);
              router.setParams({ active_trip_id: '' });
              Alert.alert("Success", "Ride cancelled successfully");
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

  const handleConfirm = async () => {
  if (
  pickupCoords.lat === null ||
  pickupCoords.lng === null ||
  dropoffCoords.lat === null ||
  dropoffCoords.lng === null
) {
    Alert.alert("Error", "Please select valid locations.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch(`${BASE_URL}/rides/estimate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        pickup_lat: pickupCoords.lat,
        pickup_lng: pickupCoords.lng,
        dropoff_lat: dropoffCoords.lat,
        dropoff_lng: dropoffCoords.lng,
      }),
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      router.push({
        pathname: "/riderConfirm",
        params: {
          pickup,
          dropoff,
          price: result.estimate.estimated_fare.toString(),
          distance: result.estimate.distance_km.toString(),
          pLat: pickupCoords.lat?.toString() ?? '',
          pLng: pickupCoords.lng?.toString() ?? '',
          dLat: dropoffCoords.lat?.toString() ?? '',
          dLng: dropoffCoords.lng?.toString() ?? '',
        }
      });
    } else {
      Alert.alert("Error", result.error || "Could not calculate fare.");
    }
  } catch (error) {
    Alert.alert("Connection Error", "Check your server.");
  }
};
  // Polling Logic
  useEffect(() => {
  let pollInterval: any;
  const runPolling = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const tripId = active_trip_id || (activeTrip?.id);
    if (token && tripId) {
      try {
        const result = await getTripStatus(tripId as string, token);
        if (result.status === 'CANCELLED') {
          setActiveTrip(null);
          router.setParams({ active_trip_id: '' });
          clearInterval(pollInterval);
        } else {
          if (result.status === 'ACCEPTED') {
            clearInterval(pollInterval);
            router.replace({ pathname: '/(rider)/driverApproaching' as any, params: { tripId: tripId } });
            return;
          }
          setActiveTrip(result);
          if (result.status === 'COMPLETED') {
            clearInterval(pollInterval);
            setTimeout(() => { setActiveTrip(null); router.setParams({ active_trip_id: '' }); }, 5000);
          }
        }
      } catch (e) { console.error("Polling error:", e); }
    }
  };

  if (active_trip_id || activeTrip?.id) {
    runPolling();
    pollInterval = setInterval(runPolling, 5000);
  }
  return () => clearInterval(pollInterval);
}, [active_trip_id, activeTrip?.id]);

  const isButtonDisabled = !pickupCoords.lat || !dropoffCoords.lat || !!activeTrip;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      
      {/* Dynamic Header padding based on device notch */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Keke Napep</Text>
        <Text style={styles.headerSubtitle}>Yola Private Engine</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/* LIVE DASHBOARD */}
          {activeTrip && (
  <View style={styles.statusCard}>
    <View style={styles.dashboardHeader}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{activeTrip.status}</Text>
      </View>
      <Pressable onPress={() => Alert.alert("SOS", "Alerting Security...")} style={styles.sosButton}>
        <Text style={styles.sosText}>SOS</Text>
      </Pressable>
    </View>

    {activeTrip.status !== 'COMPLETED' ? (
      <View>
        <Text style={styles.mainStatusText}>
          {activeTrip.status === 'ACCEPTED' ? "🚕 Driver is arriving" : 
           activeTrip.status === 'STARTED' ? "✅ Trip in Progress" : 
           "🔍 Searching for nearby Keke..."}
        </Text>


        {(activeTrip.status === 'ACCEPTED' || activeTrip.status === 'STARTED') && activeTrip.driver && (
  <View style={styles.driverInfoBox}>
    <Text style={styles.driverInfoName}>{activeTrip.driver.name}</Text>
    <View style={styles.plateBadge}>
      <Text style={styles.plateBadgeText}>{activeTrip.driver.keke_plate || 'No plate on file'}</Text>
    </View>
  </View>
)}
        
        {/* OTP Section: Only shows once a driver is involved */}
        {(activeTrip.status === 'ACCEPTED' || activeTrip.status === 'STARTED') && (
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>
              {activeTrip.status === 'ACCEPTED' 
                ? "GIVE PIN TO DRIVER TO START:" 
                : "GIVE PIN TO DRIVER TO END:"}
            </Text>
            <Text style={styles.otpValue}>{activeTrip.otp || "----"}</Text>
          </View>
        )}

        {/* Cancel Button: Now visible for all active states */}
        <Pressable
          onPress={handleCancelRide}
          style={[styles.cancelButton, cancelling && styles.buttonDisabled2]}
          disabled={cancelling}
        >
          {cancelling ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          )}
        </Pressable>
      </View>
    ) : (
      /* Completion Message */
      <Text style={styles.successText}>✨ Trip Finished. Thank you!</Text>
    )}
  </View>
)}

          {/* INPUTS - Only show if no active trip */}

{!activeTrip && (
  <View style={styles.inputCard}>

    {/* Pickup */}
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/locationSearch',
          params: {
            type: 'pickup',
          },
        });
      }}
      style={styles.locationButton}
    >
      <View style={styles.locationIconPickup}>
        <MapPin size={20} color="#FF8C00" />
      </View>

      <View style={styles.locationTextContainer}>
        <Text style={styles.locationLabel}>
          Pickup location
        </Text>

        <Text
          style={[
            styles.locationValue,
            !pickup && styles.locationPlaceholder,
          ]}
          numberOfLines={1}
        >
          {pickup || 'Choose pickup location'}
        </Text>
      </View>
    </Pressable>

    {/* Connector */}
    <View style={styles.locationConnector}>
      <View style={styles.connectorLine} />
    </View>

    {/* Dropoff */}
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/locationSearch',
          params: {
            type: 'dropoff',
          },
        });
      }}
      style={styles.locationButton}
    >
      <View style={styles.locationIconDropoff}>
        <Navigation size={20} color="#10B981" />
      </View>

      <View style={styles.locationTextContainer}>
        <Text style={styles.locationLabel}>
          Destination
        </Text>

        <Text
          style={[
            styles.locationValue,
            !dropoff && styles.locationPlaceholder,
          ]}
          numberOfLines={1}
        >
          {dropoff || 'Where are you going?'}
        </Text>
      </View>
    </Pressable>

  </View>
)}


          <Pressable 
            onPress={handleConfirm}
            disabled={isButtonDisabled}
            style={[styles.confirmButton, isButtonDisabled && styles.buttonDisabled]}
          >
            <Text style={styles.confirmButtonText}>
              {activeTrip ? 'Active Trip' : 'Confirm Ride'}
            </Text>
          </Pressable>
          <Pressable 
  onPress={async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/(auth)');
  }}
  style={{
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    Logout
  </Text>
</Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
  backgroundColor: '#EF4444',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10
},
cancelButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 16
},
buttonDisabled2: {
  opacity: 0.5
},
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    backgroundColor: '#FF8C00', 
    paddingHorizontal: 24, 
    paddingBottom: 30, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 16, color: '#FFFFFF', opacity: 0.9 },
  container: { flex: 1, padding: 20 },
  inputCard: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  driverInfoBox: {
  marginTop: 16,
  padding: 14,
  backgroundColor: '#1F2937',
  borderRadius: 12,
  alignItems: 'center',
  gap: 8,
},
driverInfoName: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
},
plateBadge: {
  backgroundColor: '#FF8C00',
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 8,
},
plateBadgeText: {
  color: '#111827',
  fontWeight: 'bold',
  fontSize: 16,
  letterSpacing: 1,
},
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: 16 },
  listView: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: 'white', zIndex: 1000, elevation: 5 },
  confirmButton: { backgroundColor: '#FF8C00', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  buttonDisabled: { backgroundColor: '#D1D5DB' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  statusCard: { backgroundColor: '#111827', padding: 20, borderRadius: 20 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: { backgroundColor: '#FF8C00', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  statusBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  sosButton: { backgroundColor: '#EF4444', padding: 10, borderRadius: 10 },
  sosText: { color: 'white', fontWeight: 'bold' },
  mainStatusText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  otpContainer: { marginTop: 20, padding: 20, backgroundColor: '#1F2937', borderRadius: 15, alignItems: 'center' },
  otpLabel: { color: '#9CA3AF', fontSize: 11, marginBottom: 10 },
  otpValue: { color: '#FF8C00', fontSize: 48, fontWeight: 'bold', letterSpacing: 10 },
  successText: { color: '#10B981', textAlign: 'center', fontWeight: 'bold', fontSize: 18 },



locationButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, },
locationIconPickup: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#FFF7ED',
  alignItems: 'center',
  justifyContent: 'center',
},

locationIconDropoff: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#ECFDF5',
  alignItems: 'center',
  justifyContent: 'center',
},

locationTextContainer: {
  flex: 1,
  marginLeft: 12,
},

locationLabel: {
  fontSize: 12,
  color: '#6B7280',
  marginBottom: 3,
},

locationValue: {
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
},

locationPlaceholder: {
  color: '#9CA3AF',
  fontWeight: '400',
},

locationConnector: {
  height: 10,
  marginLeft: 20,
  justifyContent: 'center',
},

connectorLine: {
  width: 2,
  height: 10,
  backgroundColor: '#D1D5DB',
},


});