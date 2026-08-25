import { shouldUpdateMapLocation } from '../../hooks/useDriverLocation';

const base = {
  lat: 9.2035,
  lng: 12.4954,
  heading: 90,
  speed: 5,
  accuracy: 4,
  timestamp: '2026-08-18T12:00:00.000Z',
};

describe('shouldUpdateMapLocation', () => {
  it('always publishes the first location', () => {
    expect(shouldUpdateMapLocation(null, base)).toBe(true);
  });

  it('ignores GPS jitter of a few meters', () => {
    expect(
      shouldUpdateMapLocation(base, {
        ...base,
        lat: 9.20352,
        lng: 12.49541,
        heading: 92,
      }),
    ).toBe(false);
  });

  it('updates after a real move', () => {
    expect(
      shouldUpdateMapLocation(base, {
        ...base,
        lat: 9.2045,
      }),
    ).toBe(true);
  });

  it('updates after a meaningful heading change', () => {
    expect(
      shouldUpdateMapLocation(base, {
        ...base,
        heading: 130,
      }),
    ).toBe(true);
  });
});
