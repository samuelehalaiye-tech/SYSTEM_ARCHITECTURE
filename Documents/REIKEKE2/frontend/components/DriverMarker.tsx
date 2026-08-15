import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Marker } from 'react-native-maps';

interface DriverMarkerProps {
  coordinate: { latitude: number; longitude: number };
  heading?: number;
}

export default function DriverMarker({ coordinate, heading = 0 }: DriverMarkerProps) {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} flat={true}>
      <View style={[styles.markerContainer, { transform: [{ rotate: `${heading}deg` }] }]}>
        <View style={styles.outerCircle}>
          <View style={styles.arrowContainer}>
            <View style={styles.arrow} />
          </View>
          <View style={styles.innerCircle}>
            <Text style={styles.emoji}>🛺</Text>
          </View>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 16,
  },
  arrowContainer: {
    position: 'absolute',
    top: -4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF8C00',
  },
});
