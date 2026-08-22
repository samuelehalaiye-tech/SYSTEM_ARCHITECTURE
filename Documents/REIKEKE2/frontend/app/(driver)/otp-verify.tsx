import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyTripOTP } from '../../services/endpoints/driver';
import { ShieldCheck, ArrowLeft } from 'lucide-react-native';

export default function OTPVerifyScreen() {
  const { tripId, action } = useLocalSearchParams();
  const router = useRouter();
  const actionValue = Array.isArray(action) ? action[0] : action;
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 'action' will be either 'start' or 'end'
  const isStarting = actionValue === 'start';
  const titleText = isStarting ? 'Start Ride Verification' : 'End Ride Verification';
  const subtitleText = isStarting 
    ? "Ask the passenger for their 6-digit Start PIN to begin the trip." 
    : "Ask the passenger for their 6-digit Completion PIN to end the trip.";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid Entry", "Please enter the complete 6-digit PIN.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !tripId) throw new Error("Missing authentication or trip data.");

      const response = await verifyTripOTP(tripId as string, otp, actionValue as string, token);
      
      // Verification Successful!
      Alert.alert("Success", response.message);
      
      router.replace(
        isStarting
          ? { pathname: '/(driver)/preRideTracking' as any, params: { tripId: String(tripId) } }
          : '/driverHome',
      );

    } catch (error: any) {
    
      Alert.alert("Verification Failed", error.message || "Incorrect PIN.");
      setOtp(''); // Clear the wrong PIN
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.container}>
        <ShieldCheck size={64} color="#FF8C00" style={styles.icon} />
        
        <Text style={styles.title}>{titleText}</Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))} // Numbers only
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#D1D5DB"
            autoFocus
          />
        </View>

        <Pressable 
          style={[
            styles.verifyButton, 
            otp.length === 6 ? styles.verifyButtonActive : styles.verifyButtonDisabled
          ]} 
          onPress={handleVerify}
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.verifyButtonText}>
              {isStarting ? "Confirm & Start Ride" : "Confirm & End Ride"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  backButton: { paddingRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  icon: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40, lineHeight: 24, paddingHorizontal: 10 },
  inputContainer: { width: '100%', alignItems: 'center', marginBottom: 40 },
  otpInput: { fontSize: 40, fontWeight: 'bold', color: '#111827', letterSpacing: 8, textAlign: 'center', borderBottomWidth: 2, borderColor: '#FF8C00', paddingVertical: 10, width: '80%' },
  verifyButton: { width: '100%', paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  verifyButtonActive: { backgroundColor: '#FF8C00', elevation: 3 },
  verifyButtonDisabled: { backgroundColor: '#F3F4F6' },
  verifyButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});