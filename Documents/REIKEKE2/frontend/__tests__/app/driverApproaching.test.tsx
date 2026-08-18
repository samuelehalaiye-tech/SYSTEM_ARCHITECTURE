import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

jest.mock('../../hooks/useDriverTracking', () => ({
  useDriverTracking: jest.fn(() => ({
    driverLocation: { lat: 9.2035, lng: 12.4954, heading: 90 },
    distance: '2.4 km',
    eta: '9 mins',
    routeCoords: [],
    isConnected: true,
  })),
}));

jest.mock('../../services/endpoints/rider', () => ({
  getTripStatus: jest.fn(),
  cancelTrip: jest.fn(),
}));

jest.mock('../../components/DriverMarker', () => () => null);

import DriverApproaching from '../../app/(rider)/driverApproaching';
import { getTripStatus } from '../../services/endpoints/rider';
import { useDriverTracking } from '../../hooks/useDriverTracking';

const acceptedTrip = {
  trip_id: 'trip-123',
  status: 'ACCEPTED',
  otp: '111111',
  pickup_lat: '9.203500',
  pickup_lng: '12.495400',
  dropoff_lat: '9.220000',
  dropoff_lng: '12.490000',
};

const startedTrip = {
  ...acceptedTrip,
  status: 'STARTED',
  otp: '222222',
};

const completedTrip = {
  ...startedTrip,
  status: 'COMPLETED',
};

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage as any).__clearStore();
  (AsyncStorage as any).__setStore('userToken', 'rider-token');
  (useLocalSearchParams as jest.Mock).mockReturnValue({ tripId: 'trip-123' });
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  });
});

describe('DriverApproaching ride phases', () => {
  it('shows the end PIN and destination marker for a started ride', async () => {
    (getTripStatus as jest.Mock).mockResolvedValue(startedTrip);

    const screen = render(<DriverApproaching />);

    await waitFor(() => {
      expect(screen.getByText('222222')).toBeTruthy();
      expect(screen.getByText('End PIN')).toBeTruthy();
      expect(useDriverTracking).toHaveBeenLastCalledWith(
        expect.objectContaining({ routePhase: 'dropoff' }),
      );
    });

    const destinationMarker = screen
      .UNSAFE_getAllByType('Marker' as any)
      .find((marker) => marker.props.title === 'Your Destination');
    expect(destinationMarker?.props.coordinate).toEqual({
      latitude: 9.22,
      longitude: 12.49,
    });
  });

  it('refreshes status so the screen moves from start PIN to end PIN', async () => {
    jest.useFakeTimers();
    (getTripStatus as jest.Mock)
      .mockResolvedValueOnce(acceptedTrip)
      .mockResolvedValueOnce(startedTrip);

    const screen = render(<DriverApproaching />);

    await waitFor(() => {
      expect(screen.getByText('Start PIN')).toBeTruthy();
      expect(screen.getByText('111111')).toBeTruthy();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.getByText('End PIN')).toBeTruthy();
      expect(screen.getByText('222222')).toBeTruthy();
    });
    jest.useRealTimers();
  });

  it('tells the rider the ride is complete and returns them home', async () => {
    (getTripStatus as jest.Mock).mockResolvedValue(completedTrip);

    render(<DriverApproaching />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Ride completed',
        'You have arrived at your destination.',
        expect.any(Array),
      );
    });

    const [, , actions] = (Alert.alert as jest.Mock).mock.calls[0];
    await act(async () => {
      actions[0].onPress();
    });

    const routerResult = (useRouter as jest.Mock).mock.results.at(-1);
    expect(routerResult).toBeDefined();
    const router = routerResult!.value;
    expect(router.replace).toHaveBeenCalledWith('/(rider)/riderHome');
  });
});
