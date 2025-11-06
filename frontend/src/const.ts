const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

export const STORE_CATEGORIES = [
  "CHICKEN",
  "PIZZA",
  "KOREAN",
  "CHINESE",
  "JAPANESE",
  "FAST_FOOD",
  "SNACK",
] as const;

export const CATEGORY_LABELS: Record<
  (typeof STORE_CATEGORIES)[number],
  string
> = {
  CHICKEN: "치킨",
  PIZZA: "피자",
  KOREAN: "한식",
  CHINESE: "중식",
  JAPANESE: "일식",
  FAST_FOOD: "패스트푸드",
  SNACK: "분식",
};

export const API_URLS = {
  LOGIN: `${BASE_URL}/api/auth/login`,

  REGISTER: `${BASE_URL}/api/auth/register`,

  REFRESH: `${BASE_URL}/api/auth/refresh`,

  STORES: `${BASE_URL}/api/stores`,

  STORE: (storeId: number | string) => `${BASE_URL}/api/stores/${storeId}`,

  MENUS: (storeId: number | string) =>
    `${BASE_URL}/api/stores/${storeId}/menus`,

  ORDERS: `${BASE_URL}/api/orders`,

  STORES_OWNER: `${BASE_URL}/api/stores/owner`,

  STORE_ORDERS: (storeId: number | string) =>
    `${BASE_URL}/api/orders/stores/${storeId}`,

  ORDER_STATUS: (orderId: number | string) =>
    `${BASE_URL}/api/orders/${orderId}/status`,
};

export const WS_URLS = {
  ORDERS: `${WS_BASE_URL}/ws/orders/customer`,

  STORE_ORDERS: (storeId: number | string) =>
    `${WS_BASE_URL}/ws/orders/store?storeId=${storeId}`,
};
