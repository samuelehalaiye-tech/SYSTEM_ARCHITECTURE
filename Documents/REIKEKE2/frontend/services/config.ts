// 1. No trailing slash — includes the versioned API path Django's urls.py actually expects
export const BASE_URL = "https://system-architecture-uu9i.onrender.com/api/v1";

// 2. Dynamic header generator for JWT support
export const getApiHeaders = (token: string | null = null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// 3. Static export so existing imports of API_HEADERS (auth.ts, rider.ts, driver.ts, trips.ts)
// stop pulling `undefined`. This gives unauthenticated headers by default; files that need
// an authenticated request already add 'Authorization' manually after spreading this.
export const API_HEADERS = getApiHeaders();