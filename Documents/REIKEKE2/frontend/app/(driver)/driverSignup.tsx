import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { registerUser } from '@/services/endpoints/auth'; // Using your register function

export default function DriverSignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');

    // 1. Validation Logic
    if (phone.length !== 11) {
      setError('Phone number must be 11 digits');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        phone_number: phone,
        password: password,
        is_rider: false,
        is_driver: true,
      });

      if (result.token) {
        // --- THE MISSING LINK ---
        // Save the token so the RootLayout Guard knows we are authenticated
        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('userRole', 'driver'); // Add this
        
        Alert.alert('Success', 'Account created!');
        router.replace('/driverHome'); 
      } 
      else if (result.phone_number) {
        // If the backend succeeded but didn't send a token for some reason
        Alert.alert('Success', 'Account created! Please log in.');
        router.replace('/driverLogin');
      } 
      else {
        setError('Registration failed. Please check the details.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Rider Sign Up</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Create your account to start Driving</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Create Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: '#FF8C00' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowConfirmPassword(v => !v)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: '#FF8C00' }}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.submitButton, 
                (pressed || loading) && styles.buttonPressed
              ]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Create Driver Account</Text>
              )}
            </Pressable>

            <Pressable 
              onPress={() => router.push('/driverLogin')} 
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                Already have an account? <Text style={styles.toggleTextHighlight}>Login</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}