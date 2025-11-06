export type StoreCategory =
  | "CHICKEN"
  | "PIZZA"
  | "KOREAN"
  | "CHINESE"
  | "JAPANESE"
  | "FAST_FOOD"
  | "SNACK";

export type UserRole = "USER" | "OWNER" | "ADMIN";

export type Store = {
  id: number;
  name: string;
  description: string;
  contact: string;
  address: string;
  ownerName: String;
};

export type MenuItem = {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  category: string;
};

export type StoreEntryRequest = {
  name: string;
  description: string;
  contact: string;
  address: string;
};

export type StoreEditRequest = {
  name: string;
  description: string;
  contact: string;
  address: string;
};

export type MenuAddRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

export type MenuEditRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

export type OrderStatus =
  | "PENDING"
  | "CANCELLED"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

export type OrderItem = {
  id: number;
  menuId: number;
  menuName: string;
  qty: number;
  price: number;
};

export type Order = {
  id: number;
  storeId: number;
  storeName: string;
  customerId: number;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
  deliveryAddress: string;
  specialRequest: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  storeId: number;
};

export type JWTPayload = {
  sub: string; // userId (Long을 String으로)
  roles: UserRole[]; // ["USER", "OWNER", "ADMIN"] 배열
  jti: string; // JWT ID (UUID)
  iat: number; // Issued At (초 단위)
  exp: number; // Expiration (초 단위)
  [key: string]: unknown; // 기타 필드
};
