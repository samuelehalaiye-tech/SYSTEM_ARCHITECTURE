import { BASE_URL, API_HEADERS } from "../config";
import { Alert } from "react-native";
import { router } from "expo-router";

export const requestRide = async (rideData: any, token: string) => {
  const payload = {
    pickup_location_name: rideData.pickup_location_name,
    dropoff_location_name: rideData.dropoff_location_name,
    pickup_lat: rideData.pickup_lat,
    pickup_lng: rideData.pickup_lng,
    dropoff_lat: rideData.dropoff_lat,
    dropoff_lng: rideData.dropoff_lng,
    final_fare: rideData.estimated_fare,
  };

  try {
    const response = await fetch(`${BASE_URL}/rides/request/`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.code === "token_not_valid") {
      Alert.alert("Session Expired", "Please log in again to continue.");
      router.replace("/(auth)");
      return null;
    }

    return result;
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    throw error;
  }
};

export const getCurrentTrip = async (token: string) => {
    
  try {
    const response = await fetch(`${BASE_URL}/rides/trips/current/`, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch current trip (${response.status})`);
    return await response.json();
  } catch (error) {
    console.error("Status Check Error:", error);
    throw error;
  }
};

export const getTripStatus = async (tripId: string, token: string) => {
  if (!tripId) throw new Error("Missing Trip ID");
  try {
    const url = `${BASE_URL}/rides/trips/${tripId}/status/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Backend Error (${response.status}):`, body);
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Network/Service Error:", error);
    throw error;
  }
};

export const cancelRide = async (tripId: string, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/cancel/`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Cancel Ride Error:", error);
    throw error;
  }
};


