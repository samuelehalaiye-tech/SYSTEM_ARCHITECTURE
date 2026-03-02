import React, { useState, useEffect } from 'react';
import { 
  View, Text, Pressable, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
// Use the modern Safe Area context
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getTripStatus } from '@/services/endpoints/rider'; 
import { BASE_URL } from '@/services/config';

export default function PassengerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { active_trip_id } = useLocalSearchParams();
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [dropoffCoords, setDropoffCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const handleConfirm = async () => {
  if (!pickupCoords.lat || !dropoffCoords.lat) {
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
        pathname: "/(rider)/riderConfirm",
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
          setActiveTrip(result);
          if (result.status === 'COMPLETED') {
            clearInterval(pollInterval);
            setTimeout(() => { setActiveTrip(null); router.setParams({ active_trip_id: '' }); }, 5000);
          }
        } catch (e) { console.error("Polling error:", e); }
      }
    };

    if (active_trip_id || activeTrip) {
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

              {/* LOGIC FIX: Show OTP for both ACCEPTED and STARTED */}
              {(activeTrip.status === 'ACCEPTED' || activeTrip.status === 'STARTED') && (
                <View>
                  <Text style={styles.mainStatusText}>
                    {activeTrip.status === 'ACCEPTED' ? "🚕 Driver is arriving" : "✅ Trip in Progress"}
                  </Text>
                  
                  <View style={styles.otpContainer}>
                    <Text style={styles.otpLabel}>
                      {activeTrip.status === 'ACCEPTED' 
                        ? "GIVE PIN TO DRIVER TO START:" 
                        : "GIVE PIN TO DRIVER TO END:"}
                    </Text>
                    <Text style={styles.otpValue}>{activeTrip.otp || "----"}</Text>
                  </View>
                </View>
              )}

              {activeTrip.status === 'COMPLETED' && (
                <Text style={styles.successText}>✨ Trip Finished. Thank you!</Text>
              )}
            </View>
          )}

          {/* INPUTS - Only show if no active trip */}
          {!activeTrip && (
            <View style={styles.inputCard}>
               <GooglePlacesAutocomplete
                  placeholder="Pickup Location"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setPickup(data.description);
                    if (details) setPickupCoords({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }}
                  query={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, language: 'en', components: 'country:ng' }}
                  enablePoweredByContainer={false}
                  suppressDefaultStyles={true}
                  styles={{ textInput: styles.input, listView: styles.listView }}
                />
                <View style={{ height: 15 }} />
                <GooglePlacesAutocomplete
                  placeholder="Where to?"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setDropoff(data.description);
                    if (details) setDropoffCoords({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }}
                  query={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, language: 'en', components: 'country:ng' }}
                  enablePoweredByContainer={false}
                  suppressDefaultStyles={true}
                  styles={{ textInput: styles.input, listView: styles.listView }}
                />
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
  successText: { color: '#10B981', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }
});