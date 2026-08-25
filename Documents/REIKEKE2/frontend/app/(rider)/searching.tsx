import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { cancelTrip, getTripStatus } from '@/services/endpoints/rider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchingForDriver() {
  const router = useRouter();
  const { trip_id } = useLocalSearchParams();
  const [dots, setDots] = useState('.');

  useEffect(() => {
    // 1. Simple animation for the "Searching..." text
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 500);

    // 2. Start Polling the status
    const pollInterval = setInterval(async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token && trip_id) {
        const result = await getTripStatus(trip_id as string, token);
        
        if (result.status === 'ACCEPTED') {
  clearInterval(pollInterval);
      router.replace({
        pathname: '/(rider)/driverApproaching' as any,
    params: { tripId: trip_id }
  });
}
      }
    }, 5000); // Poll every 5 seconds for Yola network resilience

    return () => {
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, [trip_id]);

  const handleCancel = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token && trip_id) {
      await cancelTrip(trip_id as string, token);
      router.replace('/(rider)/riderHome');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF8C00" />
      <Text style={styles.title}>Looking for a Keke{dots}</Text>
      <Text style={styles.subtitle}>Connecting you with the nearest Private Keke in Jimeta...</Text>
      
      <Pressable style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel Request</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 20, color: '#111827', letterSpacing: -0.4 },
  subtitle: { textAlign: 'center', color: '#6B7280', marginTop: 10, fontSize: 15 },
  cancelBtn: {
    marginTop: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  cancelText: { color: '#DC2626', fontWeight: '600', fontSize: 16 }
});