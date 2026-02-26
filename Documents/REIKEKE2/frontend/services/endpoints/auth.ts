 import { createNavigationContainerRef } from '@react-navigation/native';
import {BASE_URL, API_HEADERS} from '../config'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

 export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            // If Django sends 400/500, throw the message so 'catch' handles it
            throw new Error(data.message || data.detail || JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error; // Re-throw so the UI can show the error
    }
};

 export const loginUser= async(credentaials:any)=>{
    const response = await fetch(`${BASE_URL}/auth/login/`,{
        method:"POST",
        headers:API_HEADERS,
        body:JSON.stringify(credentaials)
    })
    return await response.json()
 }

export const getMyProfile= async(token: string)=>{
    const response=await fetch(`${BASE_URL}/auth/users/me`,{
        method:'GET',
        headers:{
            ...API_HEADERS,
            'Authorization':`Bearer ${token}`,

        }
    })
    return await response.json()
}

