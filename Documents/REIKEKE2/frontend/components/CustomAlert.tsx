import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { AlertButton } from '../contexts/AlertContext';

const { height } = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  options: { title: string; message?: string; buttons?: AlertButton[] } | null;
  onClose: () => void;
  onButtonPress: (onPress?: () => void) => void;
}

export default function CustomAlert({ visible, options, onClose, onButtonPress }: CustomAlertProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  if (!visible && !options) return null;

  const buttons = options?.buttons || [{ text: 'OK' }];

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents={visible ? 'auto' : 'none'}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      <Animated.View style={[styles.alertBox, { transform: [{ translateY }] }]}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{options?.title}</Text>
          {options?.message && <Text style={styles.message}>{options.message}</Text>}
        </View>
        
        <View style={[styles.buttonContainer, buttons.length > 2 && styles.buttonContainerVertical]}>
          {buttons.map((btn, index) => {
            const isDestructive = btn.style === 'destructive';
            const isCancel = btn.style === 'cancel';
            
            return (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.button,
                  buttons.length > 2 && styles.buttonVertical,
                  buttons.length === 2 && index === 0 && styles.buttonLeft,
                  buttons.length === 2 && index === 1 && styles.buttonRight,
                  isDestructive && styles.buttonDestructive,
                  isCancel && styles.buttonCancel,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => onButtonPress(btn.onPress)}
              >
                <Text style={[
                  styles.buttonText,
                  isDestructive && styles.buttonTextDestructive,
                  isCancel && styles.buttonTextCancel,
                ]}>
                  {btn.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  alertBox: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  buttonContainerVertical: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonVertical: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  buttonLeft: {
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
  },
  buttonRight: {
  },
  buttonPressed: {
    backgroundColor: '#F9FAFB',
  },
  buttonDestructive: {
    backgroundColor: '#FEF2F2',
  },
  buttonCancel: {
    backgroundColor: '#F9FAFB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  buttonTextDestructive: {
    color: '#DC2626',
  },
  buttonTextCancel: {
    color: '#6B7280',
    fontWeight: '500',
  },
});
