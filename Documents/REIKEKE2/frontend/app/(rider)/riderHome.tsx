import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin, Navigation } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { requestRide } from '@/services/endpoints/rider';
interface PlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PassengerHomeProps {
  onConfirmRide: (rideData: {
    pickup_location_name: string;
    dropoff_location_name: string;
    pickup_lat: number | null;
    pickup_lng: number | null;
    dropoff_lat: number | null;
    dropoff_lng: number | null;
  }) => void;
}

export default function PassengerHome() { // Remove { onConfirmRide }
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const router = useRouter();
  
  const [pickupCoords, setPickupCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [dropoffCoords, setDropoffCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });

  // 2. Updated handleConfirm to manage the trip logic internally
  const handleConfirm = async () => {
    // 1. Validate we have the "Brains" (Coordinates)
    if (pickupCoords.lat && pickupCoords.lng && dropoffCoords.lat && dropoffCoords.lng) {
      const trim = (num: number) => parseFloat(num.toFixed(6));
      // 2. Map State to the exact keys your 'requestRide' service expects
      const rideDataForService = {
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        pickupLat: trim(pickupCoords.lat),
        pickupLng: trim(pickupCoords.lng),
        dropoffLat: trim(dropoffCoords.lat),
        dropoffLng: trim(dropoffCoords.lng),
      };

      try {
        // 3. Get the "Gatekeeper" token
        const token = await AsyncStorage.getItem('userToken');
        
        if (!token) {
          Alert.alert("Authentication Error", "Please log in again to book a ride.");
          router.replace('/(auth)');
          return;
        }

        console.log("🚀 Dispatching request to Django...");

        // 4. Fire the API call
        const response = await requestRide(rideDataForService, token);

        // 5. Handle the Handshake (Phase 3)
        if (response && (response.id || response.pk)) {
          Alert.alert(
            "Ride Requested", 
            `Searching for Keke near ${pickup.split(',')[0]}...`
          );
          
          // Step 9: Active Trip Persistence (Move to the live tracking screen)
          // router.push(`/(rider)/trip/${response.id}`); 
        } else {
          Alert.alert("Backend Error", "Django received the request but failed to create a trip.");
        }

      } catch (error) {
        console.error("Critical Network Failure:", error);
        Alert.alert("Network Error", "Cannot reach the Keke server. Check your internet/IP.");
      }

    } else {
      Alert.alert("Selection Required", "Please select locations from the suggestions list.");
    }
  };
  // Good fix on this check—it's much safer now.
  const isButtonDisabled = !pickupCoords.lat || !dropoffCoords.lat;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keke Napep</Text>
        <Text style={styles.headerSubtitle}>Book your ride</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled" // Important so taps on suggestions register
        >
          <View style={styles.inputCard}>
            {/* Pickup Input Wrapper with Z-Index */}
            <View style={{ zIndex: 2, marginBottom: 10 }}>
              <GooglePlacesAutocomplete
                placeholder="Enter pickup location"
                fetchDetails={true}
                debounce={400}
                onPress={(data, details = null) => {
                  setPickup(data.description);
                  if (details) {
                    setPickupCoords({
                      lat: details.geometry.location.lat,
                      lng: details.geometry.location.lng
                    });
                  }
                }}
                query={{ 
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, 
                  language: 'en', 
                  components: 'country:ng' 
                }}
                enablePoweredByContainer={false}
                listEmptyComponent={<View />} 
        suppressDefaultStyles={true}
                styles={{ 
                  textInput: styles.input,
                  listView: { 
            backgroundColor: 'white', 
            position: 'absolute', 
            top: 50, 
            zIndex: 10,
            elevation: 5 
          }
                }}
              disableScroll={true}/>
            </View>

            {/* Dropoff Input Wrapper with lower Z-Index */}
            <View style={{ zIndex: 1 }}>
              <GooglePlacesAutocomplete
                placeholder="Enter dropoff location"
                fetchDetails={true}
                debounce={400}
                onPress={(data, details = null) => {
                  setDropoff(data.description);
                  if (details) {
                    setDropoffCoords({
                      lat: details.geometry.location.lat,
                      lng: details.geometry.location.lng
                    });
                  }
                }}
                query={{ 
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, 
                  language: 'en', 
                  components: 'country:ng' 
                }}
                enablePoweredByContainer={false}
                 listEmptyComponent={<View />} 
        suppressDefaultStyles={true}
                styles={{ 
                  textInput: styles.input,
                  listView: { 
            backgroundColor: 'white', 
            position: 'absolute', 
            top: 50, 
            zIndex: 10,
            elevation: 5 
          }
                }}
             disableScroll={true}/>
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable 
            onPress={handleConfirm}
            disabled={isButtonDisabled}
            style={({ pressed }) => [
              styles.confirmButton,
              isButtonDisabled ? styles.buttonDisabled : (pressed && styles.buttonPressed)
            ]}
          >
            <Text style={styles.confirmButtonText}>Confirm Ride</Text>
          </Pressable>

          {/* Temporary Logout Button for Debugging */}
          <Pressable 
            onPress={async () => {
              await AsyncStorage.removeItem('userToken');
              router.replace('/(auth)');
            }} 
            style={{
              backgroundColor: '#FF8C00',
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 12, 
              borderWidth: 2,
              borderColor: '#E57C00',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 3,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear Session & Logout</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  container: {
    padding: 24,
    gap: 24,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 180, // Added to ensure space for inputs
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  confirmButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: '#FF7700',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});