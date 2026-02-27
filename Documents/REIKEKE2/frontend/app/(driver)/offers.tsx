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
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      await rejectRide(tripId, token);
      // Optimistic UI update: remove it immediately
      setOffers(prev => prev.filter(offer => offer.id !== tripId));
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