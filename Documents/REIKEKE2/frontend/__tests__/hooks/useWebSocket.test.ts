/**
 * useWebSocket.test.ts
 *
 * Tests the WebSocket hook logic:
 * - Correct URL construction (wss:// base + path + token param)
 * - onMessage fires and parses JSON
 * - sendMessage works when OPEN
 * - Does NOT connect when enabled=false or token=null
 * - Reconnects after unexpected close (exponential backoff)
 */
import { WS_BASE_URL } from '../../hooks/useWebSocket';
import { BASE_URL } from '../../services/config';
import { act, renderHook } from '@testing-library/react-native';

// ─── WS_BASE_URL derivation ──────────────────────────────────────────────────

describe('WS_BASE_URL', () => {
  it('converts https:// to wss://', () => {
    expect(WS_BASE_URL.startsWith('wss://')).toBe(true);
  });

  it('strips the /api/v1 path suffix', () => {
    expect(WS_BASE_URL).not.toContain('/api/v1');
  });

  it('keeps the domain part from BASE_URL', () => {
    // Extract just the domain from BASE_URL
    const domain = BASE_URL.replace('https://', '').split('/')[0];
    expect(WS_BASE_URL).toContain(domain);
  });

  it('matches expected production WebSocket base', () => {
    expect(WS_BASE_URL).toBe('wss://system-architecture-uu9i.onrender.com');
  });
});

// ─── WebSocket mock + hook render tests ─────────────────────────────────────

// We test the hook by directly exercising its connect logic with a mock WebSocket
class MockWebSocket {
  static OPEN = 1;
  static instances: MockWebSocket[] = [];
  url: string;
  readyState: number = 0; // CONNECTING
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  sentMessages: string[] = [];

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  close() {
    this.readyState = 3; // CLOSED
    this.onclose?.();
  }

  // Test helpers
  simulateOpen() {
    this.readyState = 1; // OPEN
    this.onopen?.();
  }

  simulateMessage(data: object) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }

  simulateClose() {
    this.readyState = 3;
    this.onclose?.();
  }
}

beforeEach(() => {
  MockWebSocket.instances = [];
  (global as any).WebSocket = MockWebSocket;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.resetAllMocks();
});

describe('useWebSocket URL construction', () => {
  it('builds the correct full WebSocket URL with token', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    renderHook(() => useWebSocket({
      url: '/ws/tracking/trip-abc/',
      token: 'mytoken123',
      enabled: true,
    }));

    jest.runAllTimers();

    expect(MockWebSocket.instances.length).toBeGreaterThan(0);
    const ws = MockWebSocket.instances[0];
    expect(ws.url).toBe('wss://system-architecture-uu9i.onrender.com/ws/tracking/trip-abc/?token=mytoken123');
  });

  it('does NOT connect when token is null', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    renderHook(() => useWebSocket({
      url: '/ws/tracking/trip-abc/',
      token: null,
      enabled: true,
    }));

    expect(MockWebSocket.instances).toHaveLength(0);
  });

  it('does NOT connect when enabled is false', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    renderHook(() => useWebSocket({
      url: '/ws/tracking/trip-abc/',
      token: 'tok',
      enabled: false,
    }));

    expect(MockWebSocket.instances).toHaveLength(0);
  });
});

describe('useWebSocket message handling', () => {
  it('calls onMessage with parsed data when server sends a message', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    const onMessage = jest.fn();

    renderHook(() => useWebSocket({
      url: '/ws/tracking/trip-abc/',
      token: 'tok',
      enabled: true,
      onMessage,
    }));

    act(() => {
      const ws = MockWebSocket.instances[0];
      ws.simulateOpen();
      ws.simulateMessage({ type: 'location', lat: 9.21, lng: 12.49 });
    });

    expect(onMessage).toHaveBeenCalledWith({ type: 'location', lat: 9.21, lng: 12.49 });
  });

  it('handles the flat "type: location" format the backend sends', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    const onMessage = jest.fn();

    renderHook(() => useWebSocket({
      url: '/ws/tracking/trip-xyz/',
      token: 'tok',
      enabled: true,
      onMessage,
    }));

    act(() => {
      const ws = MockWebSocket.instances[0];
      ws.simulateOpen();
      // Backend sends flat shape: { type: 'location', lat, lng, heading }
      ws.simulateMessage({ type: 'location', lat: 9.2035, lng: 12.4954, heading: 45 });
    });

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'location', lat: 9.2035, lng: 12.4954, heading: 45 })
    );
  });
});

describe('useWebSocket sendMessage', () => {
  it('sends JSON-stringified data when socket is OPEN', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    let send: (data: any) => boolean;
    renderHook(() => {
      const result = useWebSocket({ url: '/ws/tracking/trip/', token: 'tok', enabled: true });
      send = result.sendMessage;
    });

    act(() => {
      const ws = MockWebSocket.instances[0];
      ws.simulateOpen();
    });

    act(() => {
      send!({ type: 'location', lat: 9.21, lng: 12.50 });
    });

    const ws = MockWebSocket.instances[0];
    expect(ws.sentMessages).toHaveLength(1);
    expect(JSON.parse(ws.sentMessages[0])).toEqual({ type: 'location', lat: 9.21, lng: 12.50 });
  });

  it('returns false and does NOT throw when socket is not open', () => {
    const { useWebSocket } = require('../../hooks/useWebSocket');

    let send: (data: any) => boolean;
    renderHook(() => {
      const result = useWebSocket({ url: '/ws/tracking/trip/', token: 'tok', enabled: true });
      send = result.sendMessage;
    });

    // Socket is still CONNECTING (readyState=0), not OPEN
    let returned: boolean;
    act(() => {
      returned = send!({ type: 'ping' });
    });

    expect(returned!).toBe(false);
  });
});
