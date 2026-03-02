import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { loginUser } from '@/services/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RiderLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
  setLoading(true);
  setError('');

  try {
    const result = await loginUser({ 
      phone_number: phone, 
      password: password 
    });

    if (result.access) {
  // 1. Only allow login if they ARE a rider
  if (result.is_rider) {
    await AsyncStorage.setItem('userToken', result.access);
    await AsyncStorage.setItem('userRole', 'rider');
    
    console.log("Rider Login Success.");
    router.replace('/riderHome');
  } 
  // 2. If they are a driver trying to use the Rider login
  else if (result.is_driver) {
    Alert.alert(
      "Wrong Login", 
      "This is the Passenger login. Please use the Driver login page to start working."
    );
    // We do NOT save the token here, we make them go to the right page
  } else {
    Alert.alert("Account Error", "No role assigned to this account.");
  }
}
  } catch (err) {
    Alert.alert("Network Error", "Could not reach the Yola server.");
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
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Rider Login</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Welcome back to your Keke app</Text>
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
              <Text style={styles.label}>Password</Text>
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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.submitButton, 
                (pressed || loading) && styles.buttonPressed
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable 
              onPress={() => router.push('/riderSignup')} 
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                Don't have an account? <Text style={styles.toggleTextHighlight}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}