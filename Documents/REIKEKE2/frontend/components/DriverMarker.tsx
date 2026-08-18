import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';

interface DriverMarkerProps {
  coordinate: { latitude: number; longitude: number };
  heading?: number;
}

/**
 * Uber-style driver marker.
 * Uses AnimatedRegion so the keke glides smoothly between GPS updates
 * instead of teleporting.
 */
export default function DriverMarker({ coordinate, heading = 0 }: DriverMarkerProps) {
  const markerRef = useRef<any>(null);

  // AnimatedRegion keeps a native-side animated value for lat/lng
  const animatedCoord = useRef(
    new AnimatedRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  useEffect(() => {
    const newCoord = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };

    if (Platform.OS === 'android' && markerRef.current) {
      // On Android animateMarkerToCoordinate gives hardware-accelerated movement
      markerRef.current.animateMarkerToCoordinate(newCoord, 800);
    } else {
      // On iOS use AnimatedRegion timing
      animatedCoord
        // react-native-maps creates the per-coordinate `toValue` internally.
        // Its public type currently still requires callers to supply one.
        .timing({
          ...newCoord,
          duration: 800,
          useNativeDriver: false,
        } as Parameters<typeof animatedCoord.timing>[0])
        .start();
    }
  }, [coordinate.latitude, coordinate.longitude]);

  return (
    <Marker.Animated
      ref={markerRef}
      // AnimatedRegion is supported by Marker.Animated at runtime, although
      // the react-native-maps type declaration only lists a static LatLng.
      coordinate={animatedCoord as unknown as { latitude: number; longitude: number }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat={true}
      rotation={heading}
    >
      <View style={styles.markerContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.arrowContainer}>
            <View style={styles.arrow} />
          </View>
          <View style={styles.innerCircle}>
            <Text style={styles.emoji}>🛺</Text>
          </View>
        </View>
      </View>
    </Marker.Animated>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  arrowContainer: {
    position: 'absolute',
    top: -5,
    width: '100%',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF8C00',
  },
});
