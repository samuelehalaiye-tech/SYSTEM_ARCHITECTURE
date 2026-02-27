import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, ArrowRight, Navigation, Banknote } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestRide } from '@/services/endpoints/rider';

export default function ConfirmRide() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
    
  // Extract params (sent from riderHome)
  const { pickup, dropoff, pLat, pLng, dLat, dLng, price, distance } = params;

  const handleFinalAccept = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/(auth)');
        return;
      }

      // Re-map the params back to the format your service expects
      const rideData = {
  pickup_location_name: pickup,
  dropoff_location_name: dropoff,
  // Round these here too so the Trip Model doesn't reject the save!
  pickup_lat: parseFloat(parseFloat(pLat as string).toFixed(6)),
  pickup_lng: parseFloat(parseFloat(pLng as string).toFixed(6)),
  dropoff_lat: parseFloat(parseFloat(dLat as string).toFixed(6)),
  dropoff_lng: parseFloat(parseFloat(dLng as string).toFixed(6)),
  estimated_fare: parseFloat(price as string), 
};

      
      const response = await requestRide(rideData, token);

if (response && response.trip_id) {
  // Navigate to searching screen with the new trip ID
  router.replace({
   pathname: '/searching', // REMOVE the /(rider)/ part
   params: { trip_id: response.trip_id }
 });
}
    } catch (error) {
      Alert.alert("Network Error", "Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirm Your Ride</Text>
        
        {/* Route Summary */}
        <View style={styles.routeContainer}>
          <View style={styles.point}>
            <MapPin size={20} color="#FF8C00" />
            <Text style={styles.locationText} numberOfLines={1}>{pickup}</Text>
          </View>
          
          <View style={styles.line} />
          
          <View style={styles.point}>
            <Navigation size={20} color="#10B981" />
            <Text style={styles.locationText} numberOfLines={1}>{dropoff}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
              <Banknote size={20} color="#FF8C00" />
              <Text style={styles.infoLabel}>Estimated Fare</Text>
              {/* NOW IT SHOWS THE REAL PRICE */}
              <Text style={styles.infoValue}>₦{price || "---"}</Text> 
          </View>
          
          <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{distance || "0"} km</Text>
          </View>
      </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable 
            style={[styles.btn, styles.cancelBtn]} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable 
            style={[styles.btn, styles.confirmBtn]} 
            onPress={handleFinalAccept}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.confirmText}>Request Keke</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 24, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  routeContainer: { marginBottom: 24 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  locationText: { fontSize: 16, color: '#374151', flex: 1 },
  line: { width: 2, height: 20, backgroundColor: '#E5E7EB', marginLeft: 10 },
  infoRow: { borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 20, marginBottom: 24 },
  infoBox: { alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#6B7280' },
  infoValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  buttonGroup: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  confirmBtn: { backgroundColor: '#FF8C00' },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  confirmText: { color: 'white', fontWeight: 'bold' },
});