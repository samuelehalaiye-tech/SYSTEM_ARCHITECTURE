import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Car, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
// 1. Import the Root View
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface RoleSelectionProps {
  onSelectRole: (role: 'driver' | 'passenger') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const router = useRouter();

  return (
    // 2. Wrap the entire UI. flex: 1 is mandatory here.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>REIKEKE</Text>
            <Text style={styles.subtitle}>Select your role</Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            {/* Driver Button */}
            <Pressable 
              onPress={() => {
                console.log("Driver Pressed");
                router.push('/(driver)/driverLogin');;
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Car size={32} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>I'm a Driver</Text>
            </Pressable>

            {/* Passenger Button */}
            <Pressable 
              onPress={() => {
                console.log("Passenger Pressed");
                router.replace('/riderLogin');
              }}
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.outlineButtonPressed
              ]}
            >
              <User size={32} color="#FF8C00" />
              <Text style={styles.outlineButtonText}>I'm a Passenger</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16, 
  },
  primaryButton: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  outlineButtonText: {
    color: '#FF8C00',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonPressed: {
    backgroundColor: '#FF7700',
    opacity: 0.9,
  },
  outlineButtonPressed: {
    backgroundColor: '#FFF5E6',
  },
});