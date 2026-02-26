import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { ArrowLeft, MapPin, Navigation, Phone } from 'lucide-react-native';

interface RideOffer {
  id: string;
  passengerPhone: string;
  pickup: string;
  dropoff: string;
}

interface DriverOffersProps {
  onBack: () => void;
}

export default function DriverOffers({ onBack }: DriverOffersProps) {
  // Mock ride offers - In Phase 2, this will come from driver.ts getRideOffers()
  const offers: RideOffer[] = [
    {
      id: '1',
      passengerPhone: '+234 801 234 5678',
      pickup: 'Jimeta Central Market',
      dropoff: 'Modibbo Adama University',
    },
    {
      id: '2',
      passengerPhone: '+234 803 456 7890',
      pickup: 'Yola Town Post Office',
      dropoff: 'American University of Nigeria',
    },
  ];

  const handleAccept = (offerId: string) => {
    console.log(`Phase 3: Accepting ride ${offerId}`);
    // Next Step: Call acceptRide(offerId, token) from driver.ts
  };

  const handleReject = (offerId: string) => {
    console.log(`Rejecting ride ${offerId}`);
  };

  const renderOfferItem = ({ item }: { item: RideOffer }) => (
    <View style={styles.card}>
      <View style={styles.phoneRow}>
        <Phone size={16} color="#FF8C00" />
        <Text style={styles.phoneText}>{item.passengerPhone}</Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Navigation size={16} color="#FF8C00" style={styles.iconShift} />
          <View>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationValue}>{item.pickup}</Text>
          </View>
        </View>

        <View style={[styles.locationRow, { marginTop: 12 }]}>
          <MapPin size={16} color="#FF8C00" style={styles.iconShift} />
          <View>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationValue}>{item.dropoff}</Text>
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
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Ride Offers</Text>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderOfferItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No ride offers available nearby</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backText: { color: '#FFF', fontSize: 16, marginLeft: 8 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  listContent: { padding: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  phoneText: { marginLeft: 8, fontSize: 16, color: '#374151', fontWeight: '500' },
  locationContainer: { marginBottom: 20 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconShift: { marginTop: 4, marginRight: 10 },
  locationLabel: { fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase' },
  locationValue: { fontSize: 16, color: '#111827', fontWeight: '400' },
  actionRow: { flexDirection: 'row', gap: 12 },
  acceptButton: {
    flex: 1,
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  rejectButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectText: { color: '#4B5563', fontWeight: 'bold', fontSize: 16 },
  btnOpacity: { opacity: 0.8 },
  btnGreyed: { backgroundColor: '#F9FAFB' },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 16 },
});