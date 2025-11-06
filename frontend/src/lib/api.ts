import { API_URLS } from "@/const";
import { useAuthStore } from "@/store/useAuthStore";

// 토큰 리프레시 중복 방지를 위한 Promise 캐시
let refreshPromise: Promise<string> | null = null;

async function refreshToken(currentToken: string): Promise<string> {
  // 이미 리프레시 중이면 기존 Promise 반환
  if (refreshPromise) {
    return refreshPromise;
  }

  // 새로운 리프레시 시작
  refreshPromise = (async () => {
    try {
      const refreshRes = await fetch(API_URLS.REFRESH, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        credentials: "include",
      });

      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        useAuthStore.getState().setToken(accessToken);
        return accessToken;
      } else {
        throw new Error("Token refresh failed");
      }
    } finally {
      // 리프레시 완료 후 캐시 초기화
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// 인증된 요청을 수행하는 헬퍼 함수 (403 에러 시 자동 refresh & retry)
async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const makeRequest = (token: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

  const token = useAuthStore.getState().token!;
  const res = await makeRequest(token);

  // 403 에러 시 토큰 갱신 후 재시도
  if (res.status === 403) {
    try {
      const newToken = await refreshToken(token);
      return makeRequest(newToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      // 갱신 실패 시 로그아웃
      useAuthStore.getState().clearAuth();
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  return res;
}

// 인증 관련 API
export async function loginUser(username: string, password: string) {
  const res = await fetch(API_URLS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!res.ok) {
    const errorMsg = "로그인에 실패했습니다.";
    throw new Error(errorMsg);
  }

  const data = await res.json();
  return data;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const res = await fetch(API_URLS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const errorMsg = "회원가입에 실패했습니다.";
    throw new Error(errorMsg);
  }

  return res.json();
}

// 매장 관련 API
export async function fetchStoreList() {
  const res = await authenticatedFetch(API_URLS.STORES, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchMenuList(storeId: number | string) {
  const res = await authenticatedFetch(API_URLS.MENUS(storeId), {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function createOrder(orderData: {
  storeId: number;
  items: Array<{
    menuId: number;
    qty: number;
  }>;
  deliveryAddress: string;
  specialRequests: string;
}) {
  const res = await authenticatedFetch(API_URLS.ORDERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchOrders() {
  const res = await authenticatedFetch(API_URLS.ORDERS, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// 사장님 전용 API
export async function fetchOwnerStores() {
  const res = await authenticatedFetch(API_URLS.STORES_OWNER, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchOwnerOrders(storeId: number | string) {
  const res = await authenticatedFetch(API_URLS.STORE_ORDERS(storeId), {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function updateOrderStatus(
  orderId: number | string,
  status: "ACCEPTED" | "REJECTED" | "COMPLETED"
) {
  const res = await authenticatedFetch(API_URLS.ORDER_STATUS(orderId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function applyStoreEntry(storeData: {
  name: string;
  description: string;
  contact: string;
  address: string;
}) {
  const res = await authenticatedFetch(API_URLS.STORES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storeData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function updateStore(
  storeId: number | string,
  storeData: {
    name: string;
    description: string;
    contact: string;
    address: string;
  }
) {
  const res = await authenticatedFetch(API_URLS.STORE(storeId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storeData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function addMenu(
  storeId: number | string,
  menuData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }
) {
  const res = await authenticatedFetch(API_URLS.MENUS(storeId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function editMenu(
  storeId: number | string,
  menuId: number | string,
  menuData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }
) {
  const res = await authenticatedFetch(`${API_URLS.MENUS(storeId)}/${menuId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteMenu(
  storeId: number | string,
  menuId: number | string
) {
  const res = await authenticatedFetch(`${API_URLS.MENUS(storeId)}/${menuId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return;
}
