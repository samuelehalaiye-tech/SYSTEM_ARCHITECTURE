/**
 * tracking.test.ts
 *
 * Tests for the tracking endpoint service functions.
 * Verifies correct URL construction, HTTP methods, auth headers,
 * and error handling — the exact issues that caused "pickup not available".
 */
import { getRouteToPickup, getDriverPosition, updateDriverLocation } from '../../services/endpoints/tracking';
import { BASE_URL } from '../../services/config';

const TOKEN = 'test-bearer-token';
const TRIP_ID = 'abc123-trip-uuid';

// Helper: build a fetch mock that returns a given JSON body
function mockFetch(body: object, ok = true, status = 200) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  jest.resetAllMocks();
});

// ─── getRouteToPickup ────────────────────────────────────────────────────────

describe('getRouteToPickup', () => {
  it('calls the correct /rides/trips/{id}/route/ URL', async () => {
    global.fetch = mockFetch({ polyline: 'abc', distance_text: '2.4 km', duration_text: '8 mins' });

    await getRouteToPickup(TRIP_ID, TOKEN);

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/${TRIP_ID}/route/`);
  });

  it('uses GET method', async () => {
    global.fetch = mockFetch({ polyline: '' });

    await getRouteToPickup(TRIP_ID, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('GET');
  });

  it('sends Authorization Bearer header', async () => {
    global.fetch = mockFetch({ polyline: '' });

    await getRouteToPickup(TRIP_ID, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('returns the parsed JSON body on success', async () => {
    const payload = { polyline: 'xyz', distance_text: '3 km', duration_text: '10 mins', pickup_lat: 9.2035, pickup_lng: 12.4954 };
    global.fetch = mockFetch(payload);

    const result = await getRouteToPickup(TRIP_ID, TOKEN);

    expect(result).toEqual(payload);
  });

  it('throws on non-ok response', async () => {
    global.fetch = mockFetch({ detail: 'not found' }, false, 404);

    await expect(getRouteToPickup(TRIP_ID, TOKEN)).rejects.toThrow('Failed to get route: 404');
  });
});

// ─── getDriverPosition ───────────────────────────────────────────────────────

describe('getDriverPosition', () => {
  it('calls the correct /rides/trips/{id}/location/ URL', async () => {
    global.fetch = mockFetch({ driver_lat: '9.21', driver_lng: '12.50' });

    await getDriverPosition(TRIP_ID, TOKEN);

    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/${TRIP_ID}/location/`);
  });

  it('uses GET method', async () => {
    global.fetch = mockFetch({ driver_lat: '9.21', driver_lng: '12.50' });

    await getDriverPosition(TRIP_ID, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('GET');
  });

  it('sends Authorization header', async () => {
    global.fetch = mockFetch({ driver_lat: '9.21', driver_lng: '12.50' });

    await getDriverPosition(TRIP_ID, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('returns driver_lat and driver_lng fields', async () => {
    const payload = { driver_lat: '9.2100', driver_lng: '12.4800' };
    global.fetch = mockFetch(payload);

    const result = await getDriverPosition(TRIP_ID, TOKEN);

    expect(result.driver_lat).toBe('9.2100');
    expect(result.driver_lng).toBe('12.4800');
  });

  it('throws on 401 Unauthorized', async () => {
    global.fetch = mockFetch({ detail: 'Authentication credentials not provided.' }, false, 401);

    await expect(getDriverPosition(TRIP_ID, TOKEN)).rejects.toThrow('Failed to get driver position: 401');
  });
});

// ─── updateDriverLocation ────────────────────────────────────────────────────

describe('updateDriverLocation', () => {
  const locationData = {
    lat: 9.21,
    lng: 12.50,
    heading: 180,
    speed: 25,
    accuracy: 3,
    timestamp: new Date().toISOString(),
  };

  it('calls the correct /rides/trips/{id}/location/ URL', async () => {
    global.fetch = mockFetch({ status: 'success' });

    await updateDriverLocation(TRIP_ID, locationData, TOKEN);

    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/${TRIP_ID}/location/`);
  });

  it('uses POST method', async () => {
    global.fetch = mockFetch({ status: 'success' });

    await updateDriverLocation(TRIP_ID, locationData, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('POST');
  });

  it('sends the location payload as JSON in the body', async () => {
    global.fetch = mockFetch({ status: 'success' });

    await updateDriverLocation(TRIP_ID, locationData, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.lat).toBe(locationData.lat);
    expect(body.lng).toBe(locationData.lng);
    expect(body.heading).toBe(locationData.heading);
    expect(body.timestamp).toBe(locationData.timestamp);
  });

  it('sends Authorization header', async () => {
    global.fetch = mockFetch({ status: 'success' });

    await updateDriverLocation(TRIP_ID, locationData, TOKEN);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('throws on server error', async () => {
    global.fetch = mockFetch({ error: 'trip not found' }, false, 404);

    await expect(updateDriverLocation(TRIP_ID, locationData, TOKEN)).rejects.toThrow('Failed to update location: 404');
  });
});
