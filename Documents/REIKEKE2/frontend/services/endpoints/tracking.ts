import { BASE_URL, API_HEADERS } from '../config';

export class TrackingApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'TrackingApiError';
  }
}

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const body = await response.json();
    const detail = body.error ?? body.detail;
    return detail ? `${fallback}: ${detail}` : fallback;
  } catch {
    return fallback;
  }
};

export const getRouteToPickup = async (tripId: string, token: string) => {
  const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/route/`, {
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
  const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/location/`, {
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

export const getPassengerPosition = async (tripId: string, token: string) => {
  const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/passenger-location/`, {
    method: 'GET',
    headers: {
      ...API_HEADERS,
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get passenger position: ${response.status}`);
  }

  return response.json();
};

export const updatePassengerLocation = async (
  tripId: string,
  locationData: { lat: number; lng: number; heading?: number; speed?: number; accuracy?: number; timestamp: string },
  token: string
) => {
  const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/passenger-location/`, {
    method: 'POST',
    headers: {
      ...API_HEADERS,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(locationData)
  });

  if (!response.ok) {
    throw new TrackingApiError(
      response.status,
      await getErrorMessage(response, `Failed to update passenger location: ${response.status}`),
    );
  }

  return response.json();
};

export const updateDriverLocation = async (
  tripId: string,
  locationData: { lat: number; lng: number; heading?: number; speed?: number; accuracy?: number; timestamp: string },
  token: string
) => {
  const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/location/`, {
    method: 'POST',
    headers: {
      ...API_HEADERS,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(locationData)
  });
  
  if (!response.ok) {
    throw new TrackingApiError(
      response.status,
      await getErrorMessage(response, `Failed to update location: ${response.status}`),
    );
  }
  
  return response.json();
};
