/**
 * useDriverTracking.test.ts
 *
 * Tests the passenger-side tracking hook:
 * - Correctly reads the flat driver_lat/driver_lng response (backend shape)
 * - Correctly handles WS type:'location' (not type:'location_update')
 * - Seeds initial location from REST data before WS arrives
 * - Distance/ETA set from distance_text/duration_text (Google Directions field names)
 */

// Mock the tracking service functions before imports
jest.mock('../../services/endpoints/tracking', () => ({
  getRouteToPickup: jest.fn(),
  getDriverPosition: jest.fn(),
}));

jest.mock('../../hooks/useWebSocket', () => ({
  useWebSocket: jest.fn(() => ({ isConnected: false, sendMessage: jest.fn(), lastMessage: null, reconnect: jest.fn() })),
  WS_BASE_URL: 'wss://system-architecture-uu9i.onrender.com',
}));

jest.mock('../../services/polylineUtils', () => ({
  decodePolyline: jest.fn((enc: string) => [
    { latitude: 9.21, longitude: 12.49 },
    { latitude: 9.20, longitude: 12.50 },
  ]),
}));

import { useDriverTracking } from '../../hooks/useDriverTracking';
import { getRouteToPickup, getDriverPosition } from '../../services/endpoints/tracking';
import { useWebSocket } from '../../hooks/useWebSocket';

const { renderHook, act, waitFor } = require('@testing-library/react-native');

const TRIP_ID = 'trip-123';
const TOKEN = 'tok-abc';

beforeEach(() => {
  jest.clearAllMocks();
  // Default: useWebSocket returns disconnected
  (useWebSocket as jest.Mock).mockReturnValue({
    isConnected: false,
    sendMessage: jest.fn(),
    lastMessage: null,
    reconnect: jest.fn(),
  });
  (getDriverPosition as jest.Mock).mockResolvedValue({});
});

// ─── Initial location seed ───────────────────────────────────────────────────

describe('initialDriverLocation', () => {
  it('starts with null when no initialDriverLocation given', () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    expect(result.current.driverLocation).toBeNull();
  });

  it('seeds driverLocation immediately from initialDriverLocation', () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });

    const initial = { lat: 9.21, lng: 12.49 };
    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true, initialDriverLocation: initial })
    );

    expect(result.current.driverLocation).not.toBeNull();
    expect(result.current.driverLocation?.lat).toBe(9.21);
    expect(result.current.driverLocation?.lng).toBe(12.49);
  });
});

// ─── Route fetch ─────────────────────────────────────────────────────────────

describe('route fetching', () => {
  it('calls getRouteToPickup on mount when enabled', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: '_p~iF~ps|U',
      distance_text: '2.4 km',
      duration_text: '8 mins',
    });

    renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    await waitFor(() => {
      expect(getRouteToPickup).toHaveBeenCalledWith(TRIP_ID, TOKEN);
    });
  });

  it('sets distance from distance_text field (Google Directions naming)', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: '_p~iF~ps|U',
      distance_text: '3.1 km',
      duration_text: '11 mins',
    });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.distance).toBe('3.1 km');
    });
  });

  it('sets eta from duration_text field', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: '_p~iF~ps|U',
      distance_text: '2 km',
      duration_text: '7 mins',
    });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.eta).toBe('7 mins');
    });
  });

  it('decodes polyline into routeCoords', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({
      polyline: '_p~iF~ps|U',
      distance_text: '2 km',
      duration_text: '7 mins',
    });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.routeCoords.length).toBeGreaterThan(0);
    });
  });

  it('does NOT call getRouteToPickup when enabled=false', () => {
    renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: false })
    );

    expect(getRouteToPickup).not.toHaveBeenCalled();
  });
});

// ─── REST polling fallback ───────────────────────────────────────────────────

describe('REST polling when WebSocket disconnected', () => {
  it('calls getDriverPosition when WebSocket is not connected', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });
    (getDriverPosition as jest.Mock).mockResolvedValue({
      driver_lat: '9.2100',
      driver_lng: '12.4900',
    });

    // WS is disconnected (default mock)
    renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    await waitFor(() => {
      expect(getDriverPosition).toHaveBeenCalledWith(TRIP_ID, TOKEN);
    });
  });

  it('reads driver_lat / driver_lng from top-level (not nested .location)', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });
    // Backend returns flat shape
    (getDriverPosition as jest.Mock).mockResolvedValue({
      driver_lat: '9.2135',
      driver_lng: '12.4867',
    });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    await waitFor(() => {
      expect(result.current.driverLocation).not.toBeNull();
      expect(result.current.driverLocation?.lat).toBeCloseTo(9.2135, 3);
      expect(result.current.driverLocation?.lng).toBeCloseTo(12.4867, 3);
    });
  });

  it('does NOT poll when WebSocket IS connected', async () => {
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });
    // Override: WS is connected
    (useWebSocket as jest.Mock).mockReturnValue({
      isConnected: true,
      sendMessage: jest.fn(),
      lastMessage: null,
      reconnect: jest.fn(),
    });

    renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    // Give time for any async calls
    await new Promise(r => setTimeout(r, 50));
    expect(getDriverPosition).not.toHaveBeenCalled();
  });
});

// ─── WebSocket message handling ──────────────────────────────────────────────

describe('WebSocket location updates', () => {
  it('handles flat { type: "location", lat, lng } shape from backend', async () => {
    let capturedOnMessage: ((data: any) => void) | undefined;

    (useWebSocket as jest.Mock).mockImplementation(({ onMessage }) => {
      capturedOnMessage = onMessage;
      return { isConnected: true, sendMessage: jest.fn(), lastMessage: null, reconnect: jest.fn() };
    });
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    act(() => {
      capturedOnMessage?.({ type: 'location', lat: 9.22, lng: 12.51, heading: 90 });
    });

    expect(result.current.driverLocation?.lat).toBe(9.22);
    expect(result.current.driverLocation?.lng).toBe(12.51);
    expect(result.current.driverLocation?.heading).toBe(90);
  });

  it('also handles { type: "location_update", location: { lat, lng } } nested shape', async () => {
    let capturedOnMessage: ((data: any) => void) | undefined;

    (useWebSocket as jest.Mock).mockImplementation(({ onMessage }) => {
      capturedOnMessage = onMessage;
      return { isConnected: true, sendMessage: jest.fn(), lastMessage: null, reconnect: jest.fn() };
    });
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    act(() => {
      capturedOnMessage?.({ type: 'location_update', location: { lat: 9.23, lng: 12.52, heading: 180 } });
    });

    expect(result.current.driverLocation?.lat).toBe(9.23);
    expect(result.current.driverLocation?.lng).toBe(12.52);
  });

  it('converts string lat/lng from Django Decimal to Number', async () => {
    let capturedOnMessage: ((data: any) => void) | undefined;

    (useWebSocket as jest.Mock).mockImplementation(({ onMessage }) => {
      capturedOnMessage = onMessage;
      return { isConnected: true, sendMessage: jest.fn(), lastMessage: null, reconnect: jest.fn() };
    });
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true })
    );

    act(() => {
      // Django Decimal fields sometimes come as strings
      capturedOnMessage?.({ type: 'location', lat: '9.203500', lng: '12.495400' });
    });

    expect(typeof result.current.driverLocation?.lat).toBe('number');
    expect(result.current.driverLocation?.lat).toBeCloseTo(9.2035, 4);
  });

  it('ignores messages with missing lat or lng', async () => {
    let capturedOnMessage: ((data: any) => void) | undefined;

    (useWebSocket as jest.Mock).mockImplementation(({ onMessage }) => {
      capturedOnMessage = onMessage;
      return { isConnected: true, sendMessage: jest.fn(), lastMessage: null, reconnect: jest.fn() };
    });
    (getRouteToPickup as jest.Mock).mockResolvedValue({ polyline: null });

    const { result } = renderHook(() =>
      useDriverTracking({ tripId: TRIP_ID, token: TOKEN, enabled: true, initialDriverLocation: { lat: 9.20, lng: 12.49 } })
    );

    act(() => {
      // Bad message — no lat/lng
      capturedOnMessage?.({ type: 'location', heading: 90 });
    });

    // Should still have the initial location, not null
    expect(result.current.driverLocation?.lat).toBe(9.20);
  });
});
