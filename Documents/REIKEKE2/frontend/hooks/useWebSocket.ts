import { useState, useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../services/config';

export const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_URL || BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://').replace('/api/v1', '');

interface UseWebSocketOptions {
  url: string;
  token: string | null;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  enabled?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const { url, token, onMessage, onConnect, onDisconnect, enabled = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxAttempts = 5;
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store the latest callbacks in refs so the connect closure always sees them
  const callbacksRef = useRef({ onMessage, onConnect, onDisconnect });
  useEffect(() => {
    callbacksRef.current = { onMessage, onConnect, onDisconnect };
  }, [onMessage, onConnect, onDisconnect]);

  const connect = useCallback(() => {
    if (!enabled || !token) return;
    
    if (wsRef.current) {
      // Need to avoid triggering normal reconnect logic on manual close
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    
    const fullUrl = `${WS_BASE_URL}${url}?token=${token}`;
    
    try {
      const ws = new WebSocket(fullUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        callbacksRef.current.onConnect?.();
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          callbacksRef.current.onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        callbacksRef.current.onDisconnect?.();
        
        if (enabled && reconnectAttempts.current < maxAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimerRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, timeout);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('Failed to initialize WebSocket:', e);
    }
  }, [url, token, enabled]);
  
  useEffect(() => {
    if (enabled && token) {
      connect();
    } else {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    }
    
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, enabled, token]);
  
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);
  
  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);
  
  return { sendMessage, lastMessage, isConnected, reconnect };
}
