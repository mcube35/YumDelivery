const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

export const API_URLS = {
  LOGIN: `${BASE_URL}/api/auth/login`,

  REGISTER: `${BASE_URL}/api/auth/register`,

  REFRESH: `${BASE_URL}/api/auth/refresh`,

  STORES: `${BASE_URL}/api/stores`,

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
