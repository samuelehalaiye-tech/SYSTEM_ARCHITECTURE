import { ExpoRoot } from "expo-router";
import { BASE_URL, API_HEADERS } from "../config";

export const startRide= async(tripId:string,otp:string, token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/rides/${tripId}/start/`,{
            method:'POST',
            headers:{
                ...API_HEADERS,
                'Authorization':`Bearer${token}`
            },
            body: JSON.stringify({otp:otp})
        })
        return await response.json()
    } catch(error){
        console.error("Start Ride Error :", error)
        throw error
    }
}


export const finishRide= async(tripId:string,otp:string, token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/rides/${tripId}/finish/`,{
            method:'POST',
            headers:{
                ...API_HEADERS,
                'Authorization':`Bearer${token}`
            },
            body: JSON.stringify({otp:otp})
        })
        return await response.json()
    } catch(error){
        console.error("Finish  Ride Error :", error)
        throw error
    }
}


export const sendBreadcrumb =async(tripId:string, coords:{lat:number,lng:number},token:string)=>{
    try{
        const response =await fetch(`${BASE_URL}/rides/${tripId}/track`,{
            method:'POST',
            headers:{
                ...API_HEADERS,
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(coords)
        })
        return await response.json()
    } catch(error){
        console.log("Breadcrumb failed will retry at next interval")
    }
}