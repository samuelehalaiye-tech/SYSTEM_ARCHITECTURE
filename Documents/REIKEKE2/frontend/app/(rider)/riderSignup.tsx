import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { registerUser } from '@/services/endpoints/auth';

export default function RiderSignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');

    // 1. Strict Validation
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
      // 2. The Rider Payload (Notice is_rider: true)
      const result = await registerUser({
        phone_number: phone,
        password: password,
        is_rider: true,
        is_driver: false,
      });

      // 3. Handle Token & Navigation
      const token = result.token || result.access;

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', 'rider');
        Alert.alert('Success', 'Welcome to Yola Keke!');
        router.replace('/riderHome'); // Send to RIDER home, not driver
      } else {
        setError(result.message || 'Registration failed. Try a different number.');
      }
    } catch (err) {
      // If it "just loads" and then hits here, it's a network/timeout issue
      setError('Cannot reach server. Check your connection.');
      console.error(err);
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
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Create your account to start booking rides</Text>
            </View>

            {/* Phone Input */}
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: '#FF8C00' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={[styles.submitButton, loading && styles.buttonPressed]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Join as Rider</Text>}
            </Pressable>

            <Pressable onPress={() => router.push('/riderLogin')} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Already have an account? <Text style={styles.toggleTextHighlight}>Login</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}