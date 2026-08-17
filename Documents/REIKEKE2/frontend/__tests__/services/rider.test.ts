/**
 * rider.test.ts
 *
 * Tests for rider-facing API calls: getTripStatus, cancelTrip, requestRide.
 * These are the calls that gate the whole passenger flow.
 */
import { getTripStatus, cancelTrip } from '../../services/endpoints/rider';
import { BASE_URL } from '../../services/config';

const TOKEN = 'rider-token-xyz';
const TRIP_ID = 'trip-uuid-456';

function mockFetch(body: object, ok = true, status = 200) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

beforeEach(() => {
  jest.resetAllMocks();
});

// ─── getTripStatus ───────────────────────────────────────────────────────────

describe('getTripStatus', () => {
  it('calls correct status URL', async () => {
    global.fetch = mockFetch({ trip_id: TRIP_ID, status: 'ACCEPTED' });

    await getTripStatus(TRIP_ID, TOKEN);

    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/${TRIP_ID}/status/`);
  });

  it('sends Authorization header', async () => {
    global.fetch = mockFetch({ status: 'SEARCHING' });

    await getTripStatus(TRIP_ID, TOKEN);

    const [, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('returns SEARCHING status correctly', async () => {
    global.fetch = mockFetch({ trip_id: TRIP_ID, status: 'SEARCHING' });

    const result = await getTripStatus(TRIP_ID, TOKEN);
    expect(result.status).toBe('SEARCHING');
  });

  it('returns ACCEPTED with driver and pickup coords', async () => {
    const payload = {
      trip_id: TRIP_ID,
      status: 'ACCEPTED',
      driver: { name: 'Musa Adamu', keke_plate: 'ADA-123' },
      otp: '847291',
      pickup_lat: '9.203500',
      pickup_lng: '12.495400',
      driver_lat: '9.210000',
      driver_lng: '12.490000',
    };
    global.fetch = mockFetch(payload);

    const result = await getTripStatus(TRIP_ID, TOKEN);

    expect(result.status).toBe('ACCEPTED');
    expect(result.driver.name).toBe('Musa Adamu');
    expect(result.driver.keke_plate).toBe('ADA-123');
    expect(result.otp).toBe('847291');
    // Coercing Decimal strings to Number should work
    expect(Number(result.pickup_lat)).toBeCloseTo(9.2035, 3);
    expect(Number(result.pickup_lng)).toBeCloseTo(12.4954, 3);
    expect(Number(result.driver_lat)).toBeCloseTo(9.21, 3);
  });

  it('throws when trip ID is missing', async () => {
    await expect(getTripStatus('', TOKEN)).rejects.toThrow('Missing Trip ID');
  });

  it('throws on 404 not found', async () => {
    global.fetch = mockFetch({ error: 'Trip not found' }, false, 404);

    await expect(getTripStatus(TRIP_ID, TOKEN)).rejects.toThrow('Server returned 404');
  });

  it('throws on 401 unauthorized', async () => {
    global.fetch = mockFetch({ detail: 'Authentication credentials not provided.' }, false, 401);

    await expect(getTripStatus(TRIP_ID, TOKEN)).rejects.toThrow('Server returned 401');
  });
});

// ─── cancelTrip ─────────────────────────────────────────────────────────────

describe('cancelTrip', () => {
  it('calls correct cancel URL with POST', async () => {
    global.fetch = mockFetch({ status: 'success', message: 'Trip cancelled by rider.' });

    await cancelTrip(TRIP_ID, TOKEN);

    const [url, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/${TRIP_ID}/cancel/`);
    expect(opts.method).toBe('POST');
  });

  it('sends Authorization header', async () => {
    global.fetch = mockFetch({ status: 'success' });

    await cancelTrip(TRIP_ID, TOKEN);

    const [, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('returns success status when cancelled', async () => {
    global.fetch = mockFetch({ status: 'success', message: 'Trip cancelled by rider.' });

    const result = await cancelTrip(TRIP_ID, TOKEN);
    expect(result.status).toBe('success');
  });

  it('returns error info when trip already started', async () => {
    global.fetch = mockFetch({ error: 'You cannot cancel a trip that has already started.' }, false, 400);
    // cancelTrip does NOT throw — it returns the parsed body
    const result = await cancelTrip(TRIP_ID, TOKEN);
    expect(result.error).toBeDefined();
  });
});
