import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { loginUser } from '@/services/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverLoginPage() {
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
        // 1. SAVE THE TOKEN FIRST
        await AsyncStorage.setItem('userToken', result.access);
        await AsyncStorage.setItem('userRole', result.is_driver ? 'driver' : 'rider');
        
        // 2. LOG FOR DEBUGGING
        console.log("Login Success. Token persisted.");

        // 3. NAVIGATE BASED ON ROLE
        // Since this is the DriverLoginPage, we should prioritize result.is_driver
        if (result.is_driver) {
          router.replace('/driverHome');
        } else {
          // If a rider tries to log in through the driver portal
          Alert.alert("Access Denied", "This account is not registered as a Driver.");
          await AsyncStorage.removeItem('userToken'); // Clean up
        }
      } else {
        setError(result.detail || "Invalid phone or password");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Check your connection to the Yola server.");
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
              <Text style={styles.title}>Driver Login</Text>
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
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={{ padding: 4 }}>
                  {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}