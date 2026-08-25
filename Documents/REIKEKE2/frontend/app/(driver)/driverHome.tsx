import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Switch, 
  SafeAreaView, 
  StatusBar,
  Alert ,
  ActivityIndicator
} from 'react-native';
import { Phone, List, Play, CheckCircle, XCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useRouter } from 'expo-router'; 
import { getDriverProfile } from '../../services/endpoints/driver';
import { getMyProfile } from '../../services/endpoints/auth';


// Make sure you import the new getCurrentTrip function!
import { updateDriverStatus, getCurrentTrip  } from '../../services/endpoints/driver'; 
import { cancelTrip } from '@/services/endpoints/rider';

interface DriverHomeProps {
  phone: string;
}

export default function DriverHome({ phone }: DriverHomeProps) {
  const [isOnline, setIsOnline] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [activeTrip, setActiveTrip] = useState<any>(null); // The new state for our trip
  const [phoneNumber, setPhoneNumber] = useState(phone || '');
  const router = useRouter(); 



  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
        const profile = await getMyProfile(token);
        setPhoneNumber(profile.phone_number || '');
      } catch (error) {
        console.error('Failed to load driver profile:', error);
      }
    };

    loadProfile();
  }, []);


  useEffect(() => {
  checkVehicleInfo();
}, []);

const checkVehicleInfo = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    const profile = await getDriverProfile(token);
    if (!profile?.plate_number) {
      router.push({ pathname: '/vehicleInfo', params: { firstTime: 'true' } });
    }
  } catch (e) {
    console.error("Vehicle info check failed", e);
  }
};
  
  // Polling Logic: Check for active trip when component mounts, and every 10 seconds
  useEffect(() => {
    checkActiveTrip();
    const interval = setInterval(checkActiveTrip, 10000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const checkActiveTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await getCurrentTrip(token);
      if (response && response.active) {
        if (response.status === 'ACCEPTED') {
          router.replace({ pathname: '/(driver)/preRideTracking' as any, params: { tripId: response.trip_id } });
          return;
        }
        setActiveTrip(response);
        // Force driver online if they have an active trip
        if (!isOnline) setIsOnline(true);
      } else {
        setActiveTrip(null);
      }
    } catch (error) {
      console.error("Failed to sync trip state", error);
    }
  };

  const handleLogout = async () => {
    setLoadingStatus(true);
    try {
      await AsyncStorage.removeItem('userToken'); 
      console.log("User logged out, token cleared.");
      router.replace('/(auth)'); 
    } catch (e) {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  const [cancelling, setCancelling] = useState(false);

  const handleCancelTrip = async () => {
  if (!activeTrip) return;

  Alert.alert(
    "Cancel Trip",
    "Are you sure you want to cancel this trip?",
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
              Alert.alert("Success", "Trip cancelled successfully");
              // Optionally refresh online status
              await checkActiveTrip();
            } else {
              Alert.alert("Error", result.error || "Failed to cancel trip");
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


  const toggleStatus = async (value: boolean) => {
    // Prevent going offline if there is an active ride
    if (activeTrip && !value) {
      Alert.alert("Action Denied", "You cannot go offline while on an active trip.");
      return;
    }

    const previousState = isOnline;
    setIsOnline(value);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Session expired. Please login again.');
        setIsOnline(previousState);
        return;
      }

      const result = await updateDriverStatus(value, token);
      if (result && !result.id && result.detail) {
        throw new Error(result.detail);
      }
    } catch (error) {
      setIsOnline(previousState);
      Alert.alert('Connection Error', 'Failed to update status. Check your internet.');
    }
    setLoadingStatus(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keke Napep Driver</Text>
        <View style={styles.phoneContainer}>
          <Phone size={16} color="#FFFFFF" />
          {/* Use short-circuiting to ensure string is never null */}
          <Text style={styles.phoneText}>{phoneNumber || '---'}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={[styles.statusValue, { color: isOnline ? '#22C55E' : '#EF4444' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
            thumbColor={isOnline ? '#22C55E' : '#9CA3AF'}
            onValueChange={toggleStatus}
            value={isOnline}
            style={styles.switchScale}
          />
        </View>

        {/* REFINED TERNARY: No comments inside the render branches */}
        {!activeTrip ? (
          <View>
            <Pressable 
              onPress={() => router.push('/offers')} 
              style={({ pressed }) => [
                styles.offersButton,
                pressed && styles.buttonPressed,
                !isOnline && styles.disabledButton 
              ]}
              disabled={!isOnline}
            >
              <List size={24} color="#FFFFFF" />
              <Text style={styles.offersButtonText}>View Ride Offers</Text>
            </Pressable>

            {!isOnline && (
              <Text style={styles.hintText}>
                Go online to start receiving ride requests in Yola.
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.activeTripCard}>
            <Text style={styles.activeTripTitle}>
              Current Trip: {activeTrip.rider_name || 'Rider'}
            </Text>
            
            <View style={styles.actionRow}>
              {activeTrip.status === 'ACCEPTED' ? (
                <Pressable 
                  style={[styles.actionButton, {backgroundColor: '#22C55E'}]} 
                  onPress={() => router.push({ pathname: '/otp-verify', params: { tripId: activeTrip.trip_id, action: 'start' }})}
                >
                  <Play size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Start Ride</Text>
                </Pressable>
              ) : (
                <Pressable 
                  style={[styles.actionButton, {backgroundColor: '#3B82F6'}]} 
                  onPress={() => router.push({ pathname: '/otp-verify', params: { tripId: activeTrip.trip_id, action: 'end' }})}
                >
                  <CheckCircle size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>End Ride</Text>
                </Pressable>
              )}

              <Pressable
  style={[styles.actionButton, { backgroundColor: '#EF4444', opacity: cancelling ? 0.7 : 1 }]}
  onPress={handleCancelTrip}
  disabled={cancelling}
>
  {cancelling ? (
    <ActivityIndicator size="small" color="#FFF" />
  ) : (
    <>
      <XCircle size={20} color="#FFF" />
      <Text style={styles.actionButtonText}>Cancel</Text>
    </>
  )}
</Pressable>
            </View>
          </View>
        )}
        
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => router.push('/vehicleInfo')} style={styles.vehicleInfoButton}>
  <Text style={{ color: '#FF8C00', fontWeight: '600', fontSize: 15 }}>Update Vehicle Info</Text>
</Pressable>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
  <Text style={{ color: '#DC2626', fontWeight: '600', fontSize: 15 }}>Logout</Text>
</Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  phoneText: {
    color: '#6B7280',
    fontSize: 14,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  switchScale: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  offersButton: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  offersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    backgroundColor: '#E67E00',
  },
  hintText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfoButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTripCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE8C7',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  activeTripTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});