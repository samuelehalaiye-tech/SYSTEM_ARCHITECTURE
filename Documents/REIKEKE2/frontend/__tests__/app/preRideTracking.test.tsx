import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

jest.mock('../../hooks/useWebSocket', () => ({
  useWebSocket: jest.fn(() => ({
    sendMessage: jest.fn(),
    isConnected: false,
  })),
}));

jest.mock('../../hooks/useDriverLocation', () => ({
  useDriverLocation: jest.fn(() => ({
    location: null,
    isTracking: false,
    error: null,
  })),
}));

jest.mock('../../services/endpoints/driver', () => ({
  getCurrentTrip: jest.fn(),
}));

jest.mock('../../services/endpoints/tracking', () => ({
  getRouteToPickup: jest.fn(),
  updateDriverLocation: jest.fn(),
}));

jest.mock('../../components/DriverMarker', () => () => null);

import PreRideTracking from '../../app/(driver)/preRideTracking';
import { getCurrentTrip } from '../../services/endpoints/driver';
import {
  getRouteToPickup,
  updateDriverLocation,
} from '../../services/endpoints/tracking';
import { useDriverLocation } from '../../hooks/useDriverLocation';
import { useWebSocket } from '../../hooks/useWebSocket';

const trip = {
  active: true,
  trip_id: 'trip-123',
  pickup_lat: '9.203500',
  pickup_lng: '12.495400',
  pickup_location_name: 'Jimeta Main Market',
  rider_name: 'Rider One',
};

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage as any).__clearStore();
  (AsyncStorage as any).__setStore('userToken', 'driver-token');
  (useLocalSearchParams as jest.Mock).mockReturnValue({ tripId: 'trip-123' });
  (getCurrentTrip as jest.Mock).mockResolvedValue(trip);
  (updateDriverLocation as jest.Mock).mockResolvedValue({ success: true });
});

describe('PreRideTracking route feedback', () => {
  it('shows a clear route-unavailable message instead of silently leaving -- when the backend returns no route data', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: null,
      distance_text: null,
      duration_text: null,
    });

    const { getByText } = render(<PreRideTracking />);

    await waitFor(() => {
      expect(getRouteToPickup).toHaveBeenCalledWith('trip-123', 'driver-token');
    });

    await waitFor(() => {
      expect(
        getByText('Route unavailable. Waiting for GPS or Maps response.'),
      ).toBeTruthy();
    });
  });

  it('shows route distance and ETA when the backend returns valid route data', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: '_p~iF~ps|U',
      distance_text: '2.4 km',
      duration_text: '8 mins',
    });

    const { getByText, queryByText } = render(<PreRideTracking />);

    await waitFor(() => {
      expect(getByText('2.4 km')).toBeTruthy();
      expect(getByText('8 mins')).toBeTruthy();
    });

    expect(
      queryByText('Route unavailable. Waiting for GPS or Maps response.'),
    ).toBeNull();
  });

  it('saves a GPS update through REST when the WebSocket cannot send it', async () => {
    const sendMessage = jest.fn(() => false);
    (useWebSocket as jest.Mock).mockReturnValue({
      sendMessage,
      isConnected: false,
    });
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: null,
      distance_text: null,
      duration_text: null,
    });

    render(<PreRideTracking />);

    await waitFor(() => {
      expect(useDriverLocation).toHaveBeenCalled();
    });

    const driverLocationCalls = (useDriverLocation as jest.Mock).mock.calls;
    const onLocationUpdate =
      driverLocationCalls[driverLocationCalls.length - 1][0].onLocationUpdate;
    const location = {
      lat: 9.2035,
      lng: 12.4954,
      heading: 90,
      speed: 5,
      accuracy: 4,
      timestamp: '2026-08-18T12:00:00.000Z',
    };

    await act(async () => {
      onLocationUpdate(location);
    });

    await waitFor(() => {
      expect(updateDriverLocation).toHaveBeenCalledWith(
        'trip-123',
        { type: 'location', ...location },
        'driver-token',
      );
    });
    expect(sendMessage).toHaveBeenCalledWith({ type: 'location', ...location });
  });
});
