import { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState, Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. Navigation Readiness Check
  useEffect(() => {
    if (navigationState?.key) {
      setIsReady(true);
    }
  }, [navigationState?.key]);

  // 2. Auth & Role Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        setHasToken(!!token);
        setUserRole(role);
      } catch (e) {
        setHasToken(false);
      }
    };
    checkAuth();
  }, [segments]);

  // 3. The Bouncer (Guard) Logic
  useEffect(() => {
    // Stop if navigation isn't ready or we haven't finished the storage check
    if (!isReady || hasToken === null) return;

    const rootGroup = segments[0]; 
    const inAuthGroup = rootGroup === '(auth)';
    
    // MOVE THIS INSIDE THE EFFECT so it's always in scope
    const isAccessingPublicRoute = 
      (segments as string[]).includes('driverLogin') || 
      (segments as string[]).includes('riderLogin') ||
      (segments as string[]).includes('riderSignup') || 
      (segments as string[]).includes('driverSignup');

    if (!hasToken) {
      // If no token and not in auth/public pages, force to Role Selection
      if (!inAuthGroup && !isAccessingPublicRoute) {
        console.log("Guard: No token. Redirecting to Role Selection.");
        router.replace('/(auth)');
      }
    } else {
      // If HAS token and trying to go back to Login/Signup
      if (inAuthGroup || isAccessingPublicRoute) {
        console.log(`Guard: Token found (${userRole}). Redirecting to Home.`);
        
        if (userRole === 'driver') {
          router.replace('/driverHome');
        } else {
          router.replace('/riderHome');
        }
      }
    }
  }, [isReady, segments, hasToken, userRole]);

  // Show nothing while loading to avoid "ReferenceError" flash
  if (!isReady || hasToken === null) return null;

  return <Slot />;
}