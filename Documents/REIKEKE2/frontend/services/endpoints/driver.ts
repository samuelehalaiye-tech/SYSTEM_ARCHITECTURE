import { BASE_URL,API_HEADERS } from "../config";



export const updateDriverStatus =async(isOnline:boolean, token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/auth/users/me/driver/`, {
            method: 'PATCH',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({is_online:isOnline})

        })
        return await response.json()
    } catch (error){
        console.error("Status Toggle Error :", error);
        throw error;
    }
}


export const getDriverProfile = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/users/me/driver/`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to fetch driver profile');
        return await response.json();
    } catch (error) {
        console.error("Get Driver Profile Error:", error);
        throw error;
    }
};

export const updateVehicleInfo = async (plateNumber: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/users/me/driver/`, {
            method: 'PATCH',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ plate_number: plateNumber })
        });
        return await response.json();
    } catch (error) {
        console.error("Update Vehicle Info Error:", error);
        throw error;
    }
};

export const getRideOffers = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/offers/`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Offers Fetch Failed (${response.status}):`, errorText);
            return []; 
        }

        const data = await response.json();
        const rawOffers = Array.isArray(data) ? data : (data.results || []);
        
        // SAFETY NET: Filter out anything older than 30 mins (1800000 ms)
        // This ensures the frontend drops it immediately even if the backend lagged
        const thirtyMinsAgo = Date.now() - (30 * 60 * 1000);
        const validOffers = rawOffers.filter((offer: any) => {
             const offerTime = new Date(offer.created_at).getTime();
             return offerTime > thirtyMinsAgo;
        });

        return validOffers;
        
    } catch (error) {
        console.error("Fetch Ride Offers Error:", error);
        return []; 
    }
}
export const acceptRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/rides/trips/${tripId}/accept/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            // Handle non-JSON or error responses gracefully
            const errorText = await response.text();
            console.warn("Server returned non-JSON:", errorText);
            return { success: response.ok, status: response.status };
        }
    } catch (error) {
        console.error("Accept Ride Network Error:", error);
        throw error;
    }
}
// Add this new export to your existing file

export const getCurrentTrip = async (token: string) => {
  try {
    // Make sure API_BASE_URL matches whatever you use in this file
    const response = await fetch(`${BASE_URL}/trips/current/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    

    if (!response.ok) {
      throw new Error('Failed to fetch current trip state');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching current trip:", error);
    throw error;
  }
};

export const verifyTripOTP = async (tripId: string, otp: string, action: string, token: string) => {
    console.log("Trip ID:", tripId);
  try {
    const response = await fetch(`${BASE_URL}/${tripId}/verify/`, { // Added api/v1
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, action })
    });

    const text = await response.text();

    if (!response.ok) {
        // This will now catch the HTML and tell you why it failed
        console.error("Server Error Response:", text);
        throw new Error("Verification failed. Check console.");
    }

    return JSON.parse(text); // Semicolon here
  } catch (error) { // Line 133
    console.error("OTP Verification Error:", error);
    throw error;
  }
};
export const rejectRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/trips/${tripId}/reject/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        return await response.json()
    } catch (error){
        console.error("Reject Ride Error :", error);
        throw error;
    }
}
