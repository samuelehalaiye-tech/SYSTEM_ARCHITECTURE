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