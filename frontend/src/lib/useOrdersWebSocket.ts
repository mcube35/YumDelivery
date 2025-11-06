import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "./useWebSocket";
import type { Order } from "./types";

interface UseOrdersWebSocketOptions {
  queryKey: string[];
  queryFn: () => Promise<Order[]>;
  wsUrl: string;
}

export function useOrdersWebSocket({
  queryKey,
  queryFn,
  wsUrl,
}: UseOrdersWebSocketOptions) {
  const [orders, setOrders] = useState<Order[]>([]);

  // 초기 데이터는 REST API로 가져오기
  const {
    data: initialOrders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey,
    queryFn,
    select: (data) => [...data].reverse(),
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (initialOrders) setOrders(initialOrders);
  }, [initialOrders]);

  // 웹소켓으로 실시간 업데이트
  const { isConnected } = useWebSocket<Order | Order[]>({
    url: wsUrl,
    onMessage: (data: Order | Order[]) => {
      if (Array.isArray(data)) {
        // 전체 주문 목록 업데이트
        setOrders([...data].reverse());
      } else {
        // 단일 주문 업데이트 (새 주문 추가 또는 기존 주문 업데이트)
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o.id === data.id);
          return idx >= 0
            ? prev.map((o, i) => (i === idx ? data : o))
            : [data, ...prev];
        });
      }
    },
  });

  return { orders, isLoading, error, isConnected };
}
