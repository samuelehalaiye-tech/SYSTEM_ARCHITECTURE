import { BASE_URL, API_HEADERS } from '../config';

export const updateDriverLocation = async (
  tripId: string,
  locationData: { lat: number; lng: number; heading?: number; speed?: number; accuracy?: number; timestamp: string },
  token: string
) => {
  const response = await fetch(`${BASE_URL}/trips/${tripId}/location/`, {
    method: 'POST',
    headers: {
      ...API_HEADERS,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(locationData)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update location: ${response.status}`);
  }
  
  return response.json();
};

export const getRouteToPickup = async (tripId: string, token: string) => {
  const response = await fetch(`${BASE_URL}/trips/${tripId}/route/`, {
    method: 'GET',
    headers: {
      ...API_HEADERS,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get route: ${response.status}`);
  }
  
  return response.json();
};

export const getDriverPosition = async (tripId: string, token: string) => {
  const response = await fetch(`${BASE_URL}/trips/${tripId}/location/`, {
    method: 'GET',
    headers: {
      ...API_HEADERS,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get driver position: ${response.status}`);
  }
  
  return response.json();
};
