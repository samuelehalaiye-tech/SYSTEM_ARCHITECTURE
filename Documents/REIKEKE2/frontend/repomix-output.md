This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
app/
  (auth)/
    index.tsx
  (driver)/
    _layout.tsx
    driverHome.tsx
    driverLogin.tsx
    offers.tsx
    otp-verify.tsx
  (rider)/
    _layout.tsx
    riderConfirm.tsx
    riderHome.tsx
    riderLogin.tsx
    riderSignup.tsx
    searching.tsx
  _layout.tsx
assets/
  images/
    android-icon-background.png
    android-icon-foreground.png
    android-icon-monochrome.png
    favicon.png
    icon.png
    partial-react-logo.png
    react-logo.png
    react-logo@2x.png
    react-logo@3x.png
    splash-icon.png
components/
  ui/
    collapsible.tsx
    icon-symbol.ios.tsx
    icon-symbol.tsx
  external-link.tsx
  haptic-tab.tsx
  hello-wave.tsx
  LocationSearch.native.tsx
  parallax-scroll-view.tsx
  PlaceautocompleteInput.tsx
  themed-text.tsx
  themed-view.tsx
constants/
  theme.ts
context/
  AuthContext.tsx
hooks/
  use-color-scheme.ts
  use-color-scheme.web.ts
  use-theme-color.ts
scripts/
  reset-project.js
services/
  endpoints/
    auth.ts
    driver.ts
    rider.ts
    trips.ts
  config.ts
src/
  styles.ts
.gitignore
app.json
eas.json
eslint.config.js
package.json
README.md
tsconfig.json
````

# Files

## File: app/(auth)/index.tsx
````typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Car, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
// 1. Import the Root View
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface RoleSelectionProps {
  onSelectRole: (role: 'driver' | 'passenger') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const router = useRouter();

  return (
    // 2. Wrap the entire UI. flex: 1 is mandatory here.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>REIKEKE</Text>
            <Text style={styles.subtitle}>Select your role</Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            {/* Driver Button */}
            <Pressable 
              onPress={() => {
                console.log("Driver Pressed");
                router.push('/(driver)/driverLogin');;
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Car size={32} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>I'm a Driver</Text>
            </Pressable>

            {/* Passenger Button */}
            <Pressable 
              onPress={() => {
                console.log("Passenger Pressed");
                router.replace('/riderLogin');
              }}
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.outlineButtonPressed
              ]}
            >
              <User size={32} color="#FF8C00" />
              <Text style={styles.outlineButtonText}>I'm a Passenger</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16, 
  },
  primaryButton: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  outlineButtonText: {
    color: '#FF8C00',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonPressed: {
    backgroundColor: '#FF7700',
    opacity: 0.9,
  },
  outlineButtonPressed: {
    backgroundColor: '#FFF5E6',
  },
});
````

## File: app/(driver)/_layout.tsx
````typescript
import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="driverLogin" />
      <Stack.Screen name="driverSignup" />
      <Stack.Screen name="driverHome" />
      <Stack.Screen name="offers" />
    </Stack>
  );
}
````

## File: app/(driver)/driverHome.tsx
````typescript
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
````

## File: app/(driver)/driverLogin.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { loginUser } from '@/services/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ 
        phone_number: phone, 
        password: password 
      });

      if (result.access) {
        // 1. SAVE THE TOKEN FIRST
        await AsyncStorage.setItem('userToken', result.access);
        await AsyncStorage.setItem('userRole', result.is_driver ? 'driver' : 'rider');
        
        // 2. LOG FOR DEBUGGING
        console.log("Login Success. Token persisted.");

        // 3. NAVIGATE BASED ON ROLE
        // Since this is the DriverLoginPage, we should prioritize result.is_driver
        if (result.is_driver) {
          router.replace('/driverHome');
        } else {
          // If a rider tries to log in through the driver portal
          Alert.alert("Access Denied", "This account is not registered as a Driver.");
          await AsyncStorage.removeItem('userToken'); // Clean up
        }
      } else {
        setError(result.detail || "Invalid phone or password");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Check your connection to the Yola server.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Driver Login</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Welcome back to your Keke app</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={{ marginLeft: 8, padding: 4 }}>
                  {showPassword ? <EyeOff size={20} color="#FF8C00" /> : <Eye size={20} color="#FF8C00" />}
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.submitButton, 
                (pressed || loading) && styles.buttonPressed
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
````

## File: app/(driver)/offers.tsx
````typescript
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Pressable, StyleSheet, 
  SafeAreaView, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import { ArrowLeft, MapPin, Navigation, Phone, Banknote } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRideOffers, acceptRide, rejectRide } from '@/services/endpoints/driver';

export default function DriverOffers({ onBack }: { onBack: () => void }) {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live offers from Yola Keke Engine
  const fetchOffers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const data = await getRideOffers(token);
        // Ensure data is an array before setting
        setOffers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // Poll for new offers every 10 seconds
    const interval = setInterval(fetchOffers, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (tripId: string) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      const result = await acceptRide(tripId, token);
      if (result.status === 'success') {
        Alert.alert("Success", "Trip Accepted! Head to pickup.");
        // Redirect to Phase 4: Tracking/Map screen
        // router.push({ pathname: '/(driver)/activeTrip', params: { tripId } });
      } else {
        Alert.alert("Error", result.error || "Could not accept ride.");
        fetchOffers(); // Refresh list to remove taken ride
      }
    } catch (error) {
      Alert.alert("Network Error", "Check your internet connection.");
    }
  };

  const handleReject = async (tripId: string) => {
    // 🔥 OPTIMISTIC UI: Remove it from the screen immediately!
    // No waiting for AsyncStorage or the network.
    setOffers(prev => prev.filter(offer => offer.id !== tripId));

    // Now handle the backend sync silently in the background
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      await rejectRide(tripId, token);
    } catch (error) {
      console.error("Reject Error:", error);
    }
  };

  const renderOfferItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.phoneRow}>
          <Phone size={16} color="#FF8C00" />
          <Text style={styles.phoneText}>{item.rider_phone || "Hidden Number"}</Text>
        </View>
        {/* Added Fare Display - Vital for Driver Decision */}
        <View style={styles.fareBadge}>
          <Banknote size={16} color="#10B981" />
          <Text style={styles.fareText}>₦{item.final_fare}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Navigation size={16} color="#FF8C00" style={styles.iconShift} />
          <View>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationValue}>{item.pickup_location_name}</Text>
          </View>
        </View>

        <View style={[styles.locationRow, { marginTop: 12 }]}>
          <MapPin size={16} color="#FF8C00" style={styles.iconShift} />
          <View>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationValue}>{item.dropoff_location_name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable 
          onPress={() => handleAccept(item.id)}
          style={({ pressed }) => [styles.acceptButton, pressed && styles.btnOpacity]}
        >
          <Text style={styles.acceptText}>Accept</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => handleReject(item.id)}
          style={({ pressed }) => [styles.rejectButton, pressed && styles.btnGreyed]}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Ride Offers</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOfferItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No ride offers available in Jimeta right now</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  backText: { 
    color: '#FFF', 
    fontSize: 16, 
    marginLeft: 8 
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  listContent: { 
    padding: 20 
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16, // Softer corners for a premium feel
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  phoneRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  phoneText: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: '#374151', 
    fontWeight: '600' 
  },
  fareBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ECFDF5', // Light green background
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    gap: 4 
  },
  fareText: { 
    color: '#059669', // Deep green text
    fontWeight: 'bold', 
    fontSize: 18 
  },
  locationContainer: { 
    marginBottom: 20,
    paddingLeft: 4 // Alignment tweak
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  iconShift: { 
    marginTop: 4, 
    marginRight: 12 
  },
  locationLabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  locationValue: { 
    fontSize: 15, 
    color: '#111827', 
    fontWeight: '400',
    marginTop: 2
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16
  },
  acceptButton: {
    flex: 1.5, // Accept button is wider/more prominent
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectText: { 
    color: '#6B7280', 
    fontWeight: '600', 
    fontSize: 16 
  },
  btnOpacity: { 
    opacity: 0.8 
  },
  btnGreyed: { 
    backgroundColor: '#E5E7EB' 
  },
  emptyContainer: { 
    marginTop: 100, 
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyText: { 
    color: '#9CA3AF', 
    fontSize: 16, 
    textAlign: 'center',
    lineHeight: 22
  },
});
````

## File: app/(driver)/otp-verify.tsx
````typescript
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
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 'action' will be either 'start' or 'end'
  const isStarting = action === 'start';
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

      const response = await verifyTripOTP(tripId as string, otp, action as string, token);
      
      // Verification Successful!
      Alert.alert("Success", response.message);
      
      // Push them back to the Home page. 
      // The polling hook there will automatically pick up the new database state!
      router.replace('/driverHome');

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
````

## File: app/(rider)/_layout.tsx
````typescript
import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="riderLogin" />
      <Stack.Screen name="riderSignup" />
      
      
      <Stack.Screen name="riderConfirm" />
      

    </Stack>
  );
}
````

## File: app/(rider)/riderConfirm.tsx
````typescript
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
````

## File: app/(rider)/riderHome.tsx
````typescript
import React, { useState, useEffect } from 'react';
import { 
  View, Text, Pressable, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform,ActivityIndicator
} from 'react-native';
// Use the modern Safe Area context
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PlacesAutocompleteInput from '@/components/PlaceautocompleteInput'
import { getTripStatus, cancelTrip } from '@/services/endpoints/rider'; 
import { BASE_URL } from '@/services/config';

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
        if (result.status === 'CANCELLED') {
          setActiveTrip(null);
          router.setParams({ active_trip_id: '' });
          clearInterval(pollInterval);
        } else {
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
    <PlacesAutocompleteInput
      placeholder="Pickup Location"
      onSelect={(place) => {
        setPickup(place.description);
        setPickupCoords({ lat: place.lat, lng: place.lng });
      }}
    />
    <View style={{ height: 15 }} />
    <PlacesAutocompleteInput
      placeholder="Where to?"
      onSelect={(place) => {
        setDropoff(place.description);
        setDropoffCoords({ lat: place.lat, lng: place.lng });
      }}
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
````

## File: app/(rider)/riderLogin.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { loginUser } from '@/services/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RiderLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
  setLoading(true);
  setError('');

  try {
    const result = await loginUser({ 
      phone_number: phone, 
      password: password 
    });

    if (result.access) {
  // 1. Only allow login if they ARE a rider
  if (result.is_rider) {
    await AsyncStorage.setItem('userToken', result.access);
    await AsyncStorage.setItem('userRole', 'rider');
    
    console.log("Rider Login Success.");
    router.replace('/riderHome');
  } 
  // 2. If they are a driver trying to use the Rider login
  else if (result.is_driver) {
    Alert.alert(
      "Wrong Login", 
      "This is the Passenger login. Please use the Driver login page to start working."
    );
    // We do NOT save the token here, we make them go to the right page
  } else {
    Alert.alert("Account Error", "No role assigned to this account.");
  }
}
  } catch (err) {
    Alert.alert("Network Error", "Could not reach the Yola server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Rider Login</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Welcome back to your Keke app</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={{ marginLeft: 8, padding: 4 }}>
                  {showPassword ? <EyeOff size={20} color="#FF8C00" /> : <Eye size={20} color="#FF8C00" />}
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.submitButton, 
                (pressed || loading) && styles.buttonPressed
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable 
              onPress={() => router.push('/riderSignup')} 
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                Don't have an account? <Text style={styles.toggleTextHighlight}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
````

## File: app/(rider)/riderSignup.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { registerUser } from '@/services/endpoints/auth';

export default function RiderSignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');

    // 1. Strict Validation
    if (phone.length !== 11) {
      setError('Phone number must be 11 digits');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // 2. The Rider Payload (Notice is_rider: true)
      const result = await registerUser({
        phone_number: phone,
        password: password,
        is_rider: true,
        is_driver: false,
      });

      // 3. Handle Token & Navigation
      const token = result.token || result.access;

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', 'rider');
        Alert.alert('Success', 'Welcome to Yola Keke!');
        router.replace('/riderHome'); // Send to RIDER home, not driver
      } else {
        setError(result.message || 'Registration failed. Try a different number.');
      }
    } catch (err) {
      // If it "just loads" and then hits here, it's a network/timeout issue
      setError('Cannot reach server. Check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Rider Sign Up</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Create your account to start booking rides</Text>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8, padding: 4 }}>
                  {showPassword ? <EyeOff size={20} color="#FF8C00" /> : <Eye size={20} color="#FF8C00" />}
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8, padding: 4 }}>
                  {showPassword ? <EyeOff size={20} color="#FF8C00" /> : <Eye size={20} color="#FF8C00" />}
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={[styles.submitButton, loading && styles.buttonPressed]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Join as Rider</Text>}
            </Pressable>

            <Pressable onPress={() => router.push('/riderLogin')} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Already have an account? <Text style={styles.toggleTextHighlight}>Login</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
````

## File: app/(rider)/searching.tsx
````typescript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { cancelRide, getTripStatus } from '@/services/endpoints/rider';
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
  // Send them back home with the Trip ID as a parameter
  router.replace({
    pathname: '/(rider)/riderHome',
    params: { active_trip_id: trip_id }
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
````

## File: app/_layout.tsx
````typescript
import { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState, Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. Navigation Readiness Check
  useEffect(() => {
    if (navigationState?.key) {
      setIsReady(true);
    }
  }, [navigationState?.key]);

  // 2. Auth & Role Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        setHasToken(!!token);
        setUserRole(role);
      } catch (e) {
        setHasToken(false);
      }
    };
    checkAuth();
  }, [segments]);

  // 3. The Bouncer (Guard) Logic
  useEffect(() => {
    // Stop if navigation isn't ready or we haven't finished the storage check
    if (!isReady || hasToken === null) return;

    const rootGroup = segments[0]; 
    const inAuthGroup = rootGroup === '(auth)';
    
    // MOVE THIS INSIDE THE EFFECT so it's always in scope
    const isAccessingPublicRoute = 
      segments.includes('driverLogin') || 
      segments.includes('riderLogin') ||
      segments.includes('riderSignup') || 
      segments.includes('driverSignup');

    if (!hasToken) {
      // If no token and not in auth/public pages, force to Role Selection
      if (!inAuthGroup && !isAccessingPublicRoute) {
        console.log("Guard: No token. Redirecting to Role Selection.");
        router.replace('/(auth)');
      }
    } else {
      // If HAS token and trying to go back to Login/Signup
      if (inAuthGroup || isAccessingPublicRoute) {
        console.log(`Guard: Token found (${userRole}). Redirecting to Home.`);
        
        if (userRole === 'driver') {
          router.replace('/driverHome');
        } else {
          router.replace('/riderHome');
        }
      }
    }
  }, [isReady, segments, hasToken, userRole]);

  // Show nothing while loading to avoid "ReferenceError" flash
  if (!isReady || hasToken === null) return null;

  return <Slot />;
}
````

## File: components/ui/collapsible.tsx
````typescript
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
````

## File: components/ui/icon-symbol.ios.tsx
````typescript
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
````

## File: components/ui/icon-symbol.tsx
````typescript
// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
````

## File: components/external-link.tsx
````typescript
import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
````

## File: components/haptic-tab.tsx
````typescript
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
````

## File: components/hello-wave.tsx
````typescript
import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
````

## File: components/LocationSearch.native.tsx
````typescript
import React from 'react';
import PlacesAutocompleteInput from './PlaceautocompleteInput';

type Props = {
  label?: string;
  onSelect: (loc: { description: string; lat: number; lng: number }) => void;
};

export default function LocationSearch({ label = 'Search', onSelect }: Props) {
  return (
    <PlacesAutocompleteInput
      placeholder={label}
      onSelect={onSelect}
    />
  );
}
````

## File: components/parallax-scroll-view.tsx
````typescript
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
````

## File: components/PlaceautocompleteInput.tsx
````typescript
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type Prediction = {
  place_id: string;
  description: string;
};

type SelectedPlace = {
  description: string;
  lat: number;
  lng: number;
};

type Props = {
  placeholder?: string;
  onSelect: (place: SelectedPlace) => void;
  inputStyle?: TextStyle;
  listStyle?: ViewStyle;
  minLength?: number;
  debounceMs?: number;
  countryComponents?: string; // e.g. 'country:ng'
};

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PlacesAutocompleteInput({
  placeholder = 'Search location',
  onSelect,
  inputStyle,
  listStyle,
  minLength = 2,
  debounceMs = 350,
  countryComponents = 'country:ng',
}: Props) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPredictions = useCallback(
    async (text: string) => {
      if (!GOOGLE_KEY) {
        console.warn('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is missing at runtime');
        return;
      }
      setLoading(true);
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
          `?input=${encodeURIComponent(text)}` +
          `&language=en` +
          `&components=${encodeURIComponent(countryComponents)}` +
          `&key=${GOOGLE_KEY}`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
          // Surfaces the exact Google rejection reason instead of failing silently
          console.warn('Places Autocomplete error:', json.status, json.error_message);
        }

        setPredictions(json.predictions || []);
        setShowList(true);
      } catch (error) {
        console.error('Places Autocomplete network error:', error);
      } finally {
        setLoading(false);
      }
    },
    [countryComponents]
  );

  const handleChangeText = (text: string) => {
    setQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < minLength) {
      setPredictions([]);
      setShowList(false);
      return;
    }

    debounceRef.current = setTimeout(() => fetchPredictions(text), debounceMs);
  };

  const handleSelect = async (prediction: Prediction) => {
    setQuery(prediction.description);
    setShowList(false);
    setPredictions([]);

    if (!GOOGLE_KEY) return;

    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${prediction.place_id}` +
        `&fields=geometry` +
        `&key=${GOOGLE_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== 'OK') {
        console.warn('Place Details error:', json.status, json.error_message);
        return;
      }

      const location = json.result?.geometry?.location;
      if (location) {
        onSelect({
          description: prediction.description,
          lat: location.lat,
          lng: location.lng,
        });
      }
    } catch (error) {
      console.error('Place Details network error:', error);
    }
  };

  return (
    <View style={{ position: 'relative', zIndex: 1000 }}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={query}
        onChangeText={handleChangeText}
        onFocus={() => predictions.length > 0 && setShowList(true)}
      />

      {loading && (
        <ActivityIndicator style={styles.loadingIndicator} size="small" color="#FF8C00" />
      )}

      {showList && predictions.length > 0 && (
        <View style={[styles.listView, listStyle]}>
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => handleSelect(item)}>
                <Text style={styles.rowText}>{item.description}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  listView: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 220,
    zIndex: 1000,
    elevation: 5,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowText: {
    fontSize: 15,
    color: '#111827',
  },
});
````

## File: components/themed-text.tsx
````typescript
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
````

## File: components/themed-view.tsx
````typescript
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
````

## File: constants/theme.ts
````typescript
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
````

## File: context/AuthContext.tsx
````typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMyProfile } from '../services/endpoints/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // 'driver' or 'passenger'
  const [isLoading, setIsLoading] = useState(true);

  const loadStorageData = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync('userToken');
    let storedRole = await SecureStore.getItemAsync('userRole');

    // If we have a token but no role, try to fetch it, 
    // but put a timeout on it or wrap it in another try/catch
    if (storedToken && !storedRole) {
      try {
        const profile = await getMyProfile(storedToken);
        storedRole = profile.is_driver ? 'driver' : 'passenger';
        await SecureStore.setItemAsync('userRole', storedRole);
      } catch (profileError) {
        console.warn("Could not fetch profile, but continuing to app...");
        // If profile fetch fails, we don't set a role, 
        // which forces the user back to login anyway.
      }
    }

    setToken(storedToken);
    setRole(storedRole);
  } catch (e) {
    console.error("Storage Error", e);
  } finally {
    // This MUST run regardless of network success
    setIsLoading(false); 
  }
};

  useEffect(() => { loadStorageData(); }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
````

## File: hooks/use-color-scheme.ts
````typescript
export { useColorScheme } from 'react-native';
````

## File: hooks/use-color-scheme.web.ts
````typescript
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
````

## File: hooks/use-theme-color.ts
````typescript
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
````

## File: scripts/reset-project.js
````javascript
#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
````

## File: services/endpoints/auth.ts
````typescript
import { createNavigationContainerRef } from '@react-navigation/native';
import {BASE_URL, API_HEADERS} from '../config'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

 export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            // If Django sends 400/500, throw the message so 'catch' handles it
            throw new Error(data.message || data.detail || JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error; // Re-throw so the UI can show the error
    }
};

 export const loginUser= async(credentaials:any)=>{
    const response = await fetch(`${BASE_URL}/auth/login/`,{
        method:"POST",
        headers:API_HEADERS,
        body:JSON.stringify(credentaials)
    })
    return await response.json()
 }

export const getMyProfile= async(token: string)=>{
    const response=await fetch(`${BASE_URL}/auth/users/me`,{
        method:'GET',
        headers:{
            ...API_HEADERS,
            'Authorization':`Bearer ${token}`,

        }
    })
    return await response.json()
}
````

## File: services/endpoints/driver.ts
````typescript
import { BASE_URL,API_HEADERS } from "../config";



export const updateDriverStatus =async(isOnline:boolean, token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/auth/users/me/driver/`, {
            method: 'PATCH',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({is_online:isOnline})

        })
        return await response.json()
    } catch (error){
        console.error("Status Toggle Error :", error);
        throw error;
    }
}



export const getRideOffers = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/offers/`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Offers Fetch Failed (${response.status}):`, errorText);
            return []; 
        }

        const data = await response.json();
        const rawOffers = Array.isArray(data) ? data : (data.results || []);
        
        // SAFETY NET: Filter out anything older than 30 mins (1800000 ms)
        // This ensures the frontend drops it immediately even if the backend lagged
        const thirtyMinsAgo = Date.now() - (30 * 60 * 1000);
        const validOffers = rawOffers.filter((offer: any) => {
             const offerTime = new Date(offer.created_at).getTime();
             return offerTime > thirtyMinsAgo;
        });

        return validOffers;
        
    } catch (error) {
        console.error("Fetch Ride Offers Error:", error);
        return []; 
    }
}
export const acceptRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/rides/trips/${tripId}/accept/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            // Handle non-JSON or error responses gracefully
            const errorText = await response.text();
            console.warn("Server returned non-JSON:", errorText);
            return { success: response.ok, status: response.status };
        }
    } catch (error) {
        console.error("Accept Ride Network Error:", error);
        throw error;
    }
}
// Add this new export to your existing file

export const getCurrentTrip = async (token: string) => {
  try {
    // Make sure API_BASE_URL matches whatever you use in this file
    const response = await fetch(`${BASE_URL}/trips/current/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    

    if (!response.ok) {
      throw new Error('Failed to fetch current trip state');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching current trip:", error);
    throw error;
  }
};

export const verifyTripOTP = async (tripId: string, otp: string, action: string, token: string) => {
    console.log("Trip ID:", tripId);
  try {
    const response = await fetch(`${BASE_URL}/${tripId}/verify/`, { // Added api/v1
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, action })
    });

    const text = await response.text();

    if (!response.ok) {
        // This will now catch the HTML and tell you why it failed
        console.error("Server Error Response:", text);
        throw new Error("Verification failed. Check console.");
    }

    return JSON.parse(text); // Semicolon here
  } catch (error) { // Line 133
    console.error("OTP Verification Error:", error);
    throw error;
  }
};
export const rejectRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/trips/${tripId}/reject/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        return await response.json()
    } catch (error){
        console.error("Reject Ride Error :", error);
        throw error;
    }
}
````

## File: services/endpoints/rider.ts
````typescript
import { BASE_URL, API_HEADERS } from "../config";
import { Alert } from "react-native";
import { router } from "expo-router";

export const requestRide = async (rideData: any, token: string) => {
  const payload = {
    pickup_location_name: rideData.pickup_location_name,
    dropoff_location_name: rideData.dropoff_location_name,
    pickup_lat: rideData.pickup_lat,
    pickup_lng: rideData.pickup_lng,
    dropoff_lat: rideData.dropoff_lat,
    dropoff_lng: rideData.dropoff_lng,
    final_fare: rideData.estimated_fare,
  };

  try {
    const response = await fetch(`${BASE_URL}/rides/request/`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.code === "token_not_valid") {
      Alert.alert("Session Expired", "Please log in again to continue.");
      router.replace("/(auth)");
      return null;
    }

    return result;
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    throw error;
  }
};

export const getCurrentTrip = async (token: string) => {
    
  try {
    const response = await fetch(`${BASE_URL}/rides/trips/current/`, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch current trip (${response.status})`);
    return await response.json();
  } catch (error) {
    console.error("Status Check Error:", error);
    throw error;
  }
};

export const getTripStatus = async (tripId: string, token: string) => {
  if (!tripId) throw new Error("Missing Trip ID");
  try {
    const url = `${BASE_URL}/rides/trips/${tripId}/status/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Backend Error (${response.status}):`, body);
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Network/Service Error:", error);
    throw error;
  }
};

export const cancelTrip = async (tripId: string, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/cancel/`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Cancel Trip Error:", error);
    throw error;
  }
};
````

## File: services/endpoints/trips.ts
````typescript
import { BASE_URL, API_HEADERS } from "../config";

export const startRide = async (tripId: string, otp: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/start/`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ otp }),
        });

        return await response.json();
    } catch (error) {
        console.error("Start Ride Error:", error);
        throw error;
    }
};

export const finishRide = async (tripId: string, otp: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/end/`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ otp }),
        });

        return await response.json();
    } catch (error) {
        console.error("Finish Ride Error:", error);
        throw error;
    }
};

export const sendBreadcrumb = async (
    tripId: string,
    coords: { lat: number; lng: number },
    token: string
) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/track/`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(coords),
        });

        return await response.json();
    } catch (error) {
        console.log("Breadcrumb failed will retry at next interval");
    }
};
````

## File: services/config.ts
````typescript
// 1. No trailing slash — includes the versioned API path Django's urls.py actually expects
export const BASE_URL = "https://system-architecture-chi.vercel.app/api/v1";

// 2. Dynamic header generator for JWT support
export const getApiHeaders = (token: string | null = null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// 3. Static export so existing imports of API_HEADERS (auth.ts, rider.ts, driver.ts, trips.ts)
// stop pulling `undefined`. This gives unauthenticated headers by default; files that need
// an authenticated request already add 'Authorization' manually after spreading this.
export const API_HEADERS = getApiHeaders();
````

## File: src/styles.ts
````typescript
import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: { padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center',marginTop:70 },
  backText: { color: '#FF8C00', fontSize: 16, marginLeft: 8 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  formWrapper: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  titleSection: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF8C00' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, color: '#374151', marginBottom: 8 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA'
  },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 16 },
  submitButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  buttonPressed: { backgroundColor: '#FF7700', opacity: 0.9 },
  toggleContainer: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#4B5563', fontSize: 14 },
  toggleTextHighlight: { color: '#FF8C00', fontWeight: 'bold' },
});
````

## File: .gitignore
````
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android
````

## File: app.json
````json
{
  "expo": {
    "name": "frontend",
    "slug": "frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "frontend",
    "userInterfaceStyle": "automatic",
    "newArchEnabled":true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.onaopemipoehalaiye.frontend"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "8a70b363-c14b-4ae9-a29b-5b7c2da2980f"
      }
    }
  }
}
````

## File: eas.json
````json
{
  "cli": {
    "version": ">= 21.4.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
````

## File: eslint.config.js
````javascript
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
````

## File: package.json
````json
{
  "name": "frontend",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-location": "~19.0.8",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-task-manager": "~14.0.9",
    "expo-web-browser": "~15.0.10",
    "lucide-react-native": "^0.575.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-google-places-autocomplete": "^2.6.4",
    "react-native-maps": "1.20.1",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}
````

## File: README.md
````markdown
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
````

## File: tsconfig.json
````json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
````
