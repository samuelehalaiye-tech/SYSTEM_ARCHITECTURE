import React, { forwardRef } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region, MapViewProps } from 'react-native-maps';
import { StyleSheet } from 'react-native';

// Jimeta / Yola, Adamawa State — default map centre
export const YOLA_REGION: Region = {
  latitude: 9.2035,
  longitude: 12.4954,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface MapMarker {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  pinColor?: string;
}

interface MapComponentProps extends Omit<MapViewProps, 'provider' | 'style'> {
  markers?: MapMarker[];
  polylineCoords?: { latitude: number; longitude: number }[];
  polylineColor?: string;
  children?: React.ReactNode;
}

/**
 * Thin wrapper around MapView.
 * - Always uses PROVIDER_GOOGLE
 * - Fills its parent absolutely (use flex:1 on the parent container)
 * - Forwards the ref so callers can call mapRef.current.animateCamera() etc.
 */
const MapComponent = forwardRef<MapView, MapComponentProps>(function MapComponent(
  {
    markers = [],
    polylineCoords = [],
    polylineColor = '#FF8C00',
    initialRegion,
    children,
    ...rest
  },
  ref
) {
  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      initialRegion={initialRegion ?? YOLA_REGION}
      showsMyLocationButton={false}
      showsCompass={true}
      rotateEnabled={true}
      {...rest}
    >
      {polylineCoords.length > 0 && (
        <Polyline
          coordinates={polylineCoords}
          strokeColor={polylineColor}
          strokeWidth={5}
          lineDashPattern={undefined}
        />
      )}

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          pinColor={marker.pinColor}
        />
      ))}

      {children}
    </MapView>
  );
});

export default MapComponent;

const styles = StyleSheet.create({});
