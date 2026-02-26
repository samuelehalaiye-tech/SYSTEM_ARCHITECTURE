import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMyProfile } from '../services/endpoints/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // 'driver' or 'passenger'
  const [isLoading, setIsLoading] = useState(true);

  const loadStorageData = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync('userToken');
    let storedRole = await SecureStore.getItemAsync('userRole');

    // If we have a token but no role, try to fetch it, 
    // but put a timeout on it or wrap it in another try/catch
    if (storedToken && !storedRole) {
      try {
        const profile = await getMyProfile(storedToken);
        storedRole = profile.is_driver ? 'driver' : 'passenger';
        await SecureStore.setItemAsync('userRole', storedRole);
      } catch (profileError) {
        console.warn("Could not fetch profile, but continuing to app...");
        // If profile fetch fails, we don't set a role, 
        // which forces the user back to login anyway.
      }
    }

    setToken(storedToken);
    setRole(storedRole);
  } catch (e) {
    console.error("Storage Error", e);
  } finally {
    // This MUST run regardless of network success
    setIsLoading(false); 
  }
};

  useEffect(() => { loadStorageData(); }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);