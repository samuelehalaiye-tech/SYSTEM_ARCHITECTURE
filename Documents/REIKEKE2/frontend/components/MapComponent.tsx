import React, { useRef, useEffect } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface MapMarker {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  pinColor?: string;
  children?: React.ReactNode;
}

interface MapComponentProps {
  markers?: MapMarker[];
  polylineCoords?: { latitude: number; longitude: number }[];
  polylineColor?: string;
  showUserLocation?: boolean;
  initialRegion?: Region;
  onMapReady?: () => void;
  style?: ViewStyle;
  fitToMarkers?: boolean;
  edgePadding?: { top: number; right: number; bottom: number; left: number };
  children?: React.ReactNode;
}

export default function MapComponent({
  markers = [],
  polylineCoords = [],
  polylineColor = '#FF8C00',
  showUserLocation = true,
  initialRegion,
  onMapReady,
  style,
  fitToMarkers = true,
  edgePadding = { top: 50, right: 50, bottom: 50, left: 50 },
  children,
}: MapComponentProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (fitToMarkers && mapRef.current && (markers.length > 0 || polylineCoords.length > 0)) {
      const coordinates = [
        ...markers.map(m => m.coordinate),
        ...polylineCoords
      ];

      if (coordinates.length > 0) {
        // Small delay to ensure map is rendered before fitting
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordinates, {
            edgePadding,
            animated: true,
          });
        }, 500);
      }
    }
  }, [markers, polylineCoords, fitToMarkers, edgePadding]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        onMapReady={onMapReady}
      >
        {polylineCoords.length > 0 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor={polylineColor}
            strokeWidth={4}
          />
        )}
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.pinColor}
          >
            {marker.children}
          </Marker>
        ))}
        {children}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
