import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Car, User, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface RoleSelectionProps {
  onSelectRole: (role: 'driver' | 'passenger') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.eyebrow}>WELCOME TO REIKEKE</Text>
            <Text style={styles.title}>How will you ride today?</Text>
            <Text style={styles.subtitle}>
              Choose how you'd like to use the app.
            </Text>
          </View>

          {/* Options Section */}
          <View style={styles.optionContainer}>
            {/* Driver Option */}
            <Pressable
              onPress={() => {
                console.log("Driver Pressed");
                router.push('/(driver)/driverLogin');;
              }}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed
              ]}
            >
              <View style={styles.iconBadge}>
                <Car size={22} color="#FF8C00" />
              </View>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>I'm a Driver</Text>
                <Text style={styles.optionDescription}>
                  Accept rides and earn on your schedule
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </Pressable>

            {/* Passenger Option */}
            <Pressable
              onPress={() => {
                console.log("Passenger Pressed");
                router.replace('/riderLogin');
              }}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed
              ]}
            >
              <View style={styles.iconBadge}>
                <User size={22} color="#FF8C00" />
              </View>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>I'm a Passenger</Text>
                <Text style={styles.optionDescription}>
                  Book a keke and get where you're going
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
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
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    marginBottom: 40,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF8C00',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  optionContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  optionCardPressed: {
    backgroundColor: '#FFFAF3',
    borderColor: '#FFD9A8',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextGroup: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});