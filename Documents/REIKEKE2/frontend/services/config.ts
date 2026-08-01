// 1. No trailing slash
export const BASE_URL = "https://system-architecture-chi.vercel.app"; 

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