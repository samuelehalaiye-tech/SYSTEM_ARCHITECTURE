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
  const router = useRouter(); 
  
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
          <Text style={styles.phoneText}>{phone || '---'}</Text>
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

        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FF8C00', padding: 24, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  phoneText: { color: '#FFFFFF', fontSize: 16, opacity: 0.9 },
  container: { flex: 1, padding: 24, gap: 20 },
  statusCard: { backgroundColor: '#F9FAFB', padding: 24, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F3F4F6' },
  statusLabel: { fontSize: 14, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  statusValue: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  switchScale: { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] },
  offersButton: { backgroundColor: '#FF8C00', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, gap: 12, elevation: 3 },
  disabledButton: { opacity: 0.7 },
  offersButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  buttonPressed: { backgroundColor: '#FF7700' },
  hintText: { textAlign: 'center', color: '#9CA3AF', fontSize: 14, marginTop: 10 },
  logoutButton: { backgroundColor: '#FF8C00', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12, borderWidth: 2, borderColor: '#E57C00', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  
  // NEW STYLES FOR THE TRIP CARD
  activeTripCard: { backgroundColor: '#FFFBEB', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#FEF3C7', gap: 15 },
  activeTripTitle: { fontSize: 18, fontWeight: 'bold', color: '#92400E' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10, gap: 8 },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});