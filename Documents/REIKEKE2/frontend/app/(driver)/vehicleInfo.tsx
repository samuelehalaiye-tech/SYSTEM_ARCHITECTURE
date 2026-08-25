import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  SafeAreaView, ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Car, ArrowLeft } from 'lucide-react-native';
import { getDriverProfile, updateVehicleInfo } from '../../services/endpoints/driver';
import { useCustomAlert } from '@/contexts/AlertContext';

export default function VehicleInfoScreen() {
  const router = useRouter();
  const { firstTime } = useLocalSearchParams(); // 'true' when forced on first login
  const { showAlert } = useCustomAlert();

  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
        const profile = await getDriverProfile(token);
        if (profile?.plate_number) setPlate(profile.plate_number);
      } catch (e) {
        console.error("Failed to load existing plate number", e);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (plate.trim().length < 3) {
      showAlert("Invalid Plate", "Please enter a valid plate number.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        showAlert("Error", "Session expired. Please login again.");
        return;
      }
      const result = await updateVehicleInfo(plate.trim(), token);
      if (result?.plate_number) {
        showAlert("Saved", "Your plate number has been updated.");
        router.replace('/driverHome');
      } else {
        showAlert("Error", result?.plate_number?.[0] || "Could not save plate number.");
      }
    } catch (e) {
      showAlert("Network Error", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {!firstTime && (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#6B7280" />
          </Pressable>
        )}
        <Text style={styles.headerTitle}>Vehicle Info</Text>
      </View>

      <View style={styles.container}>
        <Car size={56} color="#FF8C00" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>
          {firstTime ? "Add your Keke's plate number" : "Update plate number"}
        </Text>
        <Text style={styles.subtitle}>
          Passengers will see this so they can identify your Keke when you arrive.
        </Text>

        <TextInput
          style={styles.input}
          value={plate}
          onChangeText={setPlate}
          placeholder="e.g. ADM-234-XY"
          autoCapitalize="characters"
          maxLength={20}
        />

        <Pressable
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Save</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  backButton: { paddingRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center', letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});