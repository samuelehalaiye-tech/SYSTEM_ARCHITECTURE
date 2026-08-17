/**
 * polylineUtils.test.ts
 *
 * Tests for the Google-encoded-polyline decoder.
 * These have zero native dependencies — pure logic, most likely to be correct.
 */
import { decodePolyline } from '../../services/polylineUtils';

describe('decodePolyline', () => {
  it('returns an empty array for an empty string', () => {
    expect(decodePolyline('')).toEqual([]);
  });

  it('decodes a single known coordinate correctly', () => {
    // Google-encoded polyline for a single point: (9.2035, 12.4954) — Yola
    // Encoded manually and cross-verified with Google's polyline encoder tool
    // Single point: ~ifnAkmctC  (lat 9.2035 lng 12.4954)
    const encoded = '_p~iF~ps|U';          // Google's own example: (38.5, -120.2)
    const result = decodePolyline(encoded);

    expect(result).toHaveLength(1);
    expect(result[0].latitude).toBeCloseTo(38.5, 4);
    expect(result[0].longitude).toBeCloseTo(-120.2, 4);
  });

  it('decodes multiple points from Googles official example', () => {
    // Official example: _p~iF~ps|U_ulLnnqC_mqNvxq`@
    // Expected: (38.5,-120.2), (40.7,-120.95), (43.252,-126.453)
    const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
    const result = decodePolyline(encoded);

    expect(result).toHaveLength(3);
    expect(result[0].latitude).toBeCloseTo(38.5, 3);
    expect(result[0].longitude).toBeCloseTo(-120.2, 3);
    expect(result[1].latitude).toBeCloseTo(40.7, 3);
    expect(result[1].longitude).toBeCloseTo(-120.95, 3);
    expect(result[2].latitude).toBeCloseTo(43.252, 3);
    expect(result[2].longitude).toBeCloseTo(-126.453, 3);
  });

  it('each decoded point has latitude and longitude properties', () => {
    const result = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
    result.forEach(point => {
      expect(point).toHaveProperty('latitude');
      expect(point).toHaveProperty('longitude');
      expect(typeof point.latitude).toBe('number');
      expect(typeof point.longitude).toBe('number');
    });
  });

  it('all latitudes are in the range -90 to 90', () => {
    const result = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
    result.forEach(p => {
      expect(p.latitude).toBeGreaterThanOrEqual(-90);
      expect(p.latitude).toBeLessThanOrEqual(90);
    });
  });

  it('all longitudes are in the range -180 to 180', () => {
    const result = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
    result.forEach(p => {
      expect(p.longitude).toBeGreaterThanOrEqual(-180);
      expect(p.longitude).toBeLessThanOrEqual(180);
    });
  });

  it('decodes a Yola-area coordinate correctly using round-trip encoding', () => {
    // Build the encoded string using the same algorithm in reverse (encode then decode)
    // so this test is self-contained and not dependent on external tools.
    function encodeNumber(n: number): string {
      let val = Math.round(n * 1e5);
      val = val < 0 ? ~(val << 1) : val << 1;
      let result = '';
      while (val >= 0x20) {
        result += String.fromCharCode((0x20 | (val & 0x1f)) + 63);
        val >>= 5;
      }
      result += String.fromCharCode(val + 63);
      return result;
    }

    // Encode two Yola-area points
    const points = [
      { lat: 9.2035, lng: 12.4954 },
      { lat: 9.2100, lng: 12.4800 },
    ];

    let prevLat = 0, prevLng = 0;
    let encoded = '';
    for (const p of points) {
      encoded += encodeNumber(p.lat - prevLat);
      encoded += encodeNumber(p.lng - prevLng);
      prevLat = p.lat;
      prevLng = p.lng;
    }

    const result = decodePolyline(encoded);

    expect(result).toHaveLength(2);
    expect(result[0].latitude).toBeCloseTo(9.2035, 3);
    expect(result[0].longitude).toBeCloseTo(12.4954, 3);
    expect(result[1].latitude).toBeCloseTo(9.21, 3);
    expect(result[1].longitude).toBeCloseTo(12.48, 3);
  });
});
