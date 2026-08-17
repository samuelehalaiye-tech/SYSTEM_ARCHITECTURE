/**
 * driver.test.ts
 *
 * Tests for driver-facing API calls: getCurrentTrip, verifyTripOTP, acceptRide.
 * getCurrentTrip was the one with the wrong URL (/trips/current/ vs /rides/trips/current/).
 */
import { getCurrentTrip, verifyTripOTP, acceptRide } from '../../services/endpoints/driver';
import { BASE_URL } from '../../services/config';

const TOKEN = 'driver-token-abc';
const TRIP_ID = 'trip-uuid-789';

function mockFetch(body: object, ok = true, status = 200) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

beforeEach(() => {
  jest.resetAllMocks();
});

// ─── getCurrentTrip ──────────────────────────────────────────────────────────

describe('getCurrentTrip', () => {
  it('calls /rides/trips/current/ — not /trips/current/', async () => {
    // This was the critical URL bug — it used to call BASE_URL/trips/current/
    // which 404'd because backend mounts rides under /rides/
    global.fetch = mockFetch({ active: false });

    await getCurrentTrip(TOKEN);

    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/current/`);
    // Explicitly assert the OLD wrong URL is NOT used
    expect(url).not.toBe(`${BASE_URL}/trips/current/`);
  });

  it('uses GET method', async () => {
    global.fetch = mockFetch({ active: false });

    await getCurrentTrip(TOKEN);

    const [, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(opts.method).toBe('GET');
  });

  it('returns { active: false } when no trip', async () => {
    global.fetch = mockFetch({ active: false });

    const result = await getCurrentTrip(TOKEN);
    expect(result.active).toBe(false);
  });

  it('returns full trip data when ACCEPTED trip exists', async () => {
    const payload = {
      active: true,
      trip_id: TRIP_ID,
      status: 'ACCEPTED',
      rider_name: 'Fatima Bello',
      pickup_lat: '9.203500',
      pickup_lng: '12.495400',
      pickup_location_name: 'Jimeta Central Market',
      otp: '412837',
    };
    global.fetch = mockFetch(payload);

    const result = await getCurrentTrip(TOKEN);

    expect(result.active).toBe(true);
    expect(result.trip_id).toBe(TRIP_ID);
    expect(result.status).toBe('ACCEPTED');
    expect(result.pickup_location_name).toBe('Jimeta Central Market');
    // Decimal strings from Django should be coercible
    expect(Number(result.pickup_lat)).toBeCloseTo(9.2035, 3);
  });

  it('throws when response is not ok', async () => {
    global.fetch = mockFetch({ error: 'Server error' }, false, 500);

    await expect(getCurrentTrip(TOKEN)).rejects.toThrow('Failed to fetch current trip state');
  });
});

// ─── verifyTripOTP ───────────────────────────────────────────────────────────

describe('verifyTripOTP', () => {
  it('calls /rides/{tripId}/verify/ — not /{tripId}/verify/', async () => {
    // This was the second URL bug
    global.fetch = mockFetch({ message: 'Ride Started!' });

    await verifyTripOTP(TRIP_ID, '123456', 'start', TOKEN);

    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/${TRIP_ID}/verify/`);
    expect(url).not.toBe(`${BASE_URL}/${TRIP_ID}/verify/`);
  });

  it('sends otp and action in POST body', async () => {
    global.fetch = mockFetch({ message: 'Ride Started!' });

    await verifyTripOTP(TRIP_ID, '847291', 'start', TOKEN);

    const [, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.otp).toBe('847291');
    expect(body.action).toBe('start');
  });

  it('sends Authorization header', async () => {
    global.fetch = mockFetch({ message: 'ok' });

    await verifyTripOTP(TRIP_ID, '000000', 'end', TOKEN);

    const [, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('throws on invalid PIN (400)', async () => {
    global.fetch = mockFetch({ error: 'Invalid PIN.' }, false, 400);

    await expect(verifyTripOTP(TRIP_ID, '000000', 'start', TOKEN))
      .rejects.toThrow('Verification failed');
  });
});

// ─── acceptRide ──────────────────────────────────────────────────────────────

describe('acceptRide', () => {
  it('calls /rides/trips/{id}/accept/ with POST', async () => {
    global.fetch = mockFetch({ status: 'success', message: 'Ride secured!' });

    await acceptRide(TRIP_ID, TOKEN);

    const [url, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/rides/trips/${TRIP_ID}/accept/`);
    expect(opts.method).toBe('POST');
  });

  it('returns parsed JSON on success', async () => {
    global.fetch = mockFetch({
      status: 'success',
      message: 'Ride secured! Drive safely.',
      trip_details: { rider_name: 'Amina', pickup_lat: '9.2035', pickup_lng: '12.4954' },
    });

    const result = await acceptRide(TRIP_ID, TOKEN);
    expect(result.status).toBe('success');
    expect(result.trip_details.rider_name).toBe('Amina');
  });
});
