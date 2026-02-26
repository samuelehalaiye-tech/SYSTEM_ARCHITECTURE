import { BASE_URL, API_HEADERS } from "../config";
import { Alert } from "react-native";
import { router } from "expo-router";

export const requestRide = async (rideData: any, token: string) => {
    console.log("--- FRONTEND OUTBOUND LOG ---");
    const payload = {
    // Left side = Django Model Names | Right side = React Native State names
    pickup_location_name: rideData.pickupAddress, 
    dropoff_location_name: rideData.dropoffAddress,
    pickup_lat: rideData.pickupLat,
    pickup_lng: rideData.pickupLng,
    dropoff_lat: rideData.dropoffLat,
    dropoff_lng: rideData.dropoffLng
};
    console.log("Payload being sent to Django:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(`${BASE_URL}/trips/request/`, {
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
    // Force redirect to login
    router.replace("/(auth)/login"); 
    return null;
}
        console.log("--- BACKEND INBOUND RESPONSE ---");
        console.log(result);
        return result;

    } catch (error) {
        console.error("NETWORK ERROR:", error);
    }
};

export const cancelRide= async (tripId:string, token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/rides/${tripId}/cancel/`,{
            method:'POST',
            headers:{
                ...API_HEADERS,
                'Authorization':`Bearer ${token}`
            },
        })
        return await response.json()
    } catch(error){
        console.error("Cancel Ride Error", error);
        throw error;
    }
}

export const getRideStatus = async (tripId: string, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/rides/${tripId}/status/`, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Status Check Error:", error);
    throw error;
  }
};

