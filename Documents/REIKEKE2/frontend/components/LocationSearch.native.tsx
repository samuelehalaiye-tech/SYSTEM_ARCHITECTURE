import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Props = {
  label?: string;
  onSelect: (loc: { description: string; lat: number; lng: number }) => void;
};

export default function LocationSearch({ label = 'Search', onSelect }: Props) {
  return (
    <GooglePlacesAutocomplete
      placeholder={label}
      fetchDetails={true}
      onPress={(data, details = null) => {
        if (details?.geometry?.location) {
          onSelect({
            description: data.description,
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      query={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, language: 'en', components: 'country:ng' }}
      enablePoweredByContainer={false}
      suppressDefaultStyles={true}
      styles={{ textInput: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: 16 }, listView: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1000 } }}
    />
  );
}
