import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MapPin, Navigation, Shield, XCircle, Play } from 'lucide-react-native';

interface TripInfoPanelProps {
  driverName?: string;
  plateNumber?: string;
  distance?: string;
  eta?: string;
  pickupName?: string;
  otp?: string;
  onNavigate?: () => void;
  onStartRide?: () => void;
  onCancel?: () => void;
  onSOS?: () => void;
  isDriver?: boolean;
}

export default function TripInfoPanel({
  driverName,
  plateNumber,
  distance,
  eta,
  pickupName,
  otp,
  onNavigate,
  onStartRide,
  onCancel,
  onSOS,
  isDriver = false,
}: TripInfoPanelProps) {
  return (
    <View style={styles.container}>
      {/* Top Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Status Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.etaText}>{eta || '-- min'}</Text>
            <Text style={styles.distanceText}>{distance || '-- km'} away</Text>
          </View>
          {otp && (
            <View style={styles.otpContainer}>
              <Text style={styles.otpLabel}>PIN</Text>
              <Text style={styles.otpValue}>{otp}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* User / Vehicle Info */}
        <View style={styles.infoRow}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{driverName?.[0] || '?'}</Text>
            </View>
            <View>
              <Text style={styles.nameText}>{driverName || 'Driver'}</Text>
              {!isDriver && plateNumber && (
                <View style={styles.plateBadge}>
                  <Text style={styles.plateText}>{plateNumber}</Text>
                </View>
              )}
            </View>
          </View>
          {pickupName && (
            <View style={styles.pickupInfo}>
              <MapPin size={16} color="#FF8C00" />
              <Text style={styles.pickupText} numberOfLines={1}>
                {pickupName}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          {isDriver ? (
            <>
              <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={onNavigate}>
                <Navigation size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Navigate</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.successButton]} onPress={onStartRide}>
                <Play size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Start Ride</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={onSOS}>
                <Shield size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>SOS</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={onCancel}>
                <XCircle size={20} color="#EF4444" />
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32, // Safe area for bottom
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  content: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  distanceText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  otpContainer: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  otpValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  plateBadge: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  plateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '45%',
    gap: 6,
  },
  pickupText: {
    color: '#D1D5DB',
    fontSize: 12,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF8C00',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#22C55E',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  secondaryButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  secondaryButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
