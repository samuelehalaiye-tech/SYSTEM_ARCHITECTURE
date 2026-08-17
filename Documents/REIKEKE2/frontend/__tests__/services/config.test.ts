/**
 * config.test.ts
 *
 * Validates BASE_URL format and API header generation.
 * This tests the foundation that every API call depends on.
 */
import { BASE_URL, getApiHeaders, API_HEADERS } from '../../services/config';

describe('BASE_URL', () => {
  it('points to the production Render server', () => {
    expect(BASE_URL).toBe('https://system-architecture-uu9i.onrender.com/api/v1');
  });

  it('does not have a trailing slash', () => {
    expect(BASE_URL.endsWith('/')).toBe(false);
  });

  it('includes /api/v1 versioning path', () => {
    expect(BASE_URL).toContain('/api/v1');
  });

  it('uses HTTPS not HTTP', () => {
    expect(BASE_URL.startsWith('https://')).toBe(true);
  });
});

describe('getApiHeaders', () => {
  it('returns Content-Type and Accept headers without a token', () => {
    const headers = getApiHeaders();
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Accept']).toBe('application/json');
    expect(headers['Authorization']).toBeUndefined();
  });

  it('includes Authorization Bearer header when token is provided', () => {
    const headers = getApiHeaders('test-token-123');
    expect(headers['Authorization']).toBe('Bearer test-token-123');
  });

  it('does not include Authorization when token is null', () => {
    const headers = getApiHeaders(null);
    expect(headers['Authorization']).toBeUndefined();
  });

  it('does not include Authorization when token is empty string', () => {
    // Empty string is falsy — should not add header
    const headers = getApiHeaders('');
    expect(headers['Authorization']).toBeUndefined();
  });

  it('returns a plain object (not a Headers instance)', () => {
    const headers = getApiHeaders('tok');
    expect(typeof headers).toBe('object');
    expect(headers).not.toBeInstanceOf(Headers);
  });
});

describe('API_HEADERS (static export)', () => {
  it('is defined', () => {
    expect(API_HEADERS).toBeDefined();
  });

  it('has Content-Type set', () => {
    expect(API_HEADERS['Content-Type']).toBe('application/json');
  });

  it('has no Authorization (unauthenticated default)', () => {
    expect(API_HEADERS['Authorization']).toBeUndefined();
  });
});
