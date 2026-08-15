import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PlacesAutocompleteInput from '@/components/PlaceautocompleteInput';

export default function LocationSearch() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Determines whether we're selecting pickup or destination.
  const type = params.type === 'dropoff' ? 'dropoff' : 'pickup';

  const isPickup = type === 'pickup';

  const handleLocationSelect = async (place: {
  description: string;
  lat: number;
  lng: number;
}) => {
  try {
    const location = {
      description: place.description,
      lat: place.lat,
      lng: place.lng,
    };

    if (type === 'pickup') {
      await AsyncStorage.setItem(
        'reikeke_pickup_location',
        JSON.stringify(location)
      );
    } else {
      await AsyncStorage.setItem(
        'reikeke_dropoff_location',
        JSON.stringify(location)
      );
    }

    router.replace('/riderHome');
  } catch (error) {
    console.error('Failed to save location:', error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={10}
          >
            <ArrowLeft size={24} color="#111827" />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              {isPickup ? 'Pickup location' : 'Where to?'}
            </Text>

            <Text style={styles.subtitle}>
              {isPickup
                ? 'Choose where you want to be picked up'
                : 'Choose your destination'}
            </Text>
          </View>
        </View>

        {/* Search + Results */}
        <View style={styles.searchSection}>
          <View style={styles.searchHeader}>
            {isPickup ? (
              <MapPin size={20} color="#FF8C00" />
            ) : (
              <Navigation size={20} color="#10B981" />
            )}

            <Text style={styles.searchLabel}>
              {isPickup
                ? 'Search for your pickup location'
                : 'Search for your destination'}
            </Text>
          </View>

          <View style={styles.autocompleteContainer}>
            <PlacesAutocompleteInput
              placeholder={
                isPickup
                  ? 'Search pickup location'
                  : 'Search destination'
              }
              onSelect={handleLocationSelect}
              minLength={2}
              debounceMs={350}
              countryComponents="country:ng"
              inputStyle={styles.searchInput}
              listStyle={styles.resultsList}
            />
          </View>
        </View>

        {/* Bottom hint */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Select a location from the search results to continue.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    marginRight: 14,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },

  searchSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  searchLabel: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  autocompleteContainer: {
    flex: 1,
  },

  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#111827',
  },

  resultsList: {
  flex: 1,
  marginTop: 12,
  backgroundColor: '#FFFFFF',
},

  hintContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  hintText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
  },
});