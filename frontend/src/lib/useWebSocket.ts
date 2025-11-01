import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  reconnectInterval?: number;
}

export function useWebSocket<T = any>({
  url,
  onMessage,
  reconnectInterval = 3000,
}: UseWebSocketOptions<T>) {
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | undefined>();

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let shouldReconnect = true;

    const connect = () => {
      const token = useAuthStore.getState().token;
      const separator = url.includes("?") ? "&" : "?";
      const wsUrl = token ? `${url}${separator}token=${token}` : url;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setIsConnected(true);

      ws.onclose = () => {
        setIsConnected(false);
        if (shouldReconnect) {
          reconnectTimeoutRef.current = window.setTimeout(
            connect,
            reconnectInterval
          );
        }
      };

      ws.onerror = () => setIsConnected(false);

      ws.onmessage = (event) => {
        try {
          onMessageRef.current(JSON.parse(event.data));
        } catch (error) {
          console.error("메시지 파싱 오류:", error);
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, reconnectInterval]);

  return { isConnected };
}
