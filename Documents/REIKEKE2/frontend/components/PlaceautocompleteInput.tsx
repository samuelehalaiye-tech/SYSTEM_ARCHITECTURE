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