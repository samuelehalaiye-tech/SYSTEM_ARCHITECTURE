import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="riderLogin" />
      <Stack.Screen name="riderSignup" />
      
      <Stack.Screen name="SearchingForDriver" />
      <Stack.Screen name="riderConfirm" />
      

    </Stack>
  );
}