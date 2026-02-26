import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Switch, 
  SafeAreaView, 
  StatusBar ,
  Button,
  Alert // Added for better UX
} from 'react-native';
import { Phone, List } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // MUST IMPORT
import { useRouter } from 'expo-router'; // MUST IMPORT

import { updateDriverStatus } from '../../services/endpoints/driver'; // Ensure path is correct
interface DriverHomeProps {
  phone: string;
  onViewOffers: () => void;
}

export default function DriverHome({ phone, onViewOffers }: DriverHomeProps) {
  const [isOnline, setIsOnline] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleLogout = async () => {
    setLoadingStatus(true);
    try {
      // 1. Clear the token
      await AsyncStorage.removeItem('userToken'); 
      
      // 2. Log it for your senior dev records
      console.log("User logged out, token cleared.");

      // 3. Redirect to Auth group
      // This works now because RootLayout will see hasToken = false
      router.replace('/(auth)'); 
    } catch (e) {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };
  // Phase 2, Step 5: The "Online/Offline" API
  const toggleStatus = async (value: boolean) => {
  // 1. Save previous state in case API fails
  const previousState = isOnline;
  
  // 2. Optimistic Update: Change UI immediately
  setIsOnline(value);

  try {
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      Alert.alert('Error', 'Session expired. Please login again.');
      setIsOnline(previousState);
      return;
    }

    // 3. Call the API
    const result = await updateDriverStatus(value, token);

    if (result && !result.id && result.detail) {
      // Backend returned an error (like token invalid)
      throw new Error(result.detail);
    }

    console.log(`Backend Updated: Driver is now ${value ? 'ONLINE' : 'OFFLINE'}`);
  } catch (error) {
    // 4. Rollback: If network fails, flip the switch back
    setIsOnline(previousState);
    Alert.alert('Connection Error', 'Failed to update status. Check your internet.');
    console.error("Status Toggle Error:", error);
  }
  setLoadingStatus(false);
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keke Napep Driver</Text>
        <View style={styles.phoneContainer}>
          <Phone size={16} color="#FFFFFF" />
          <Text style={styles.phoneText}>{phone}</Text>
        </View>
      </View>

      <View style={styles.container}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={[
              styles.statusValue, 
              { color: isOnline ? '#22C55E' : '#EF4444' }
            ]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
            thumbColor={isOnline ? '#22C55E' : '#9CA3AF'}
            ios_backgroundColor="#D1D5DB"
            onValueChange={toggleStatus}
            value={isOnline}
            style={styles.switchScale}
          />
        </View>

        {/* View Offers Button */}
        <Pressable 
          onPress={onViewOffers}
          style={({ pressed }) => [
            styles.offersButton,
            pressed && styles.buttonPressed,
            !isOnline && styles.disabledButton // Visual hint that you should be online
          ]}
        >
          <List size={24} color="#FFFFFF" />
          <Text style={styles.offersButtonText}>View Ride Offers</Text>
        </Pressable>

        {!isOnline && (
          <Text style={styles.hintText}>
            Go online to start receiving ride requests in Yola.
          </Text>
        )}
        <Pressable  onPress={handleLogout} style={{
    backgroundColor: '#FF8C00', // Yola Keke Orange
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12, 
              // Your "normal styling" now works!
    borderWidth: 2,
    borderColor: '#E57C00',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,              // Shadow for Android
  }} ><Text style={{color: '#FFFFFF'}}>Logout</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF8C00',
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  phoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  statusCard: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  switchScale: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Make it easier to tap
  },
  offersButton: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  offersButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPressed: {
    backgroundColor: '#FF7700',
  },
  hintText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 10,
  }
});