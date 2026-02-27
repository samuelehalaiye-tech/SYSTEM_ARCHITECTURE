import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { cancelRide, checkTripStatus } from '@/services/endpoints/rider';
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
        const result = await checkTripStatus(trip_id as string, token);
        
        if (result.status === 'ACCEPTED') {
          clearInterval(pollInterval);
          // Move to the active trip screen (Phase 3)
          
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
      await cancelRide(trip_id as string, token);
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
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#111827' },
  subtitle: { textAlign: 'center', color: '#6B7280', marginTop: 10, fontSize: 16 },
  cancelBtn: { marginTop: 50, padding: 15 },
  cancelText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 }
});