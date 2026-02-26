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

export const getRideOffers =async( token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/rides/offers/`, {
            method: 'GET',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            },
    

        })
        return await response.json()
    } catch (error){
        console.error("Status Toggle Error :", error);
        throw error;
    }
}


export const acceptRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/rides/${tripId}/accept/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        return await response.json()
    } catch (error){
        console.error("Accept Ride Error :", error);
        throw error;
    }
}

export const rejectRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/rides/${tripId}/reject/`, {
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
