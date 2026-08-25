import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="driverLogin" />
      <Stack.Screen name="driverHome" />
      <Stack.Screen name="vehicleInfo" />
      <Stack.Screen name="offers" />
    </Stack>
  );
}