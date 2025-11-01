import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getRolesFromJWT,
  getUserIdFromJWT,
  isOwnerOrAdmin,
  hasRole,
} from "@/lib/jwt";
import type { UserRole } from "@/lib/types";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearAuth: () => void;

  // JWT에서 자동으로 추출되는 값들 (계산된 속성)
  getUserId: () => string | null;
  getRoles: () => UserRole[];

  // 편의 메서드
  hasRole: (role: UserRole) => boolean;
  isOwner: () => boolean;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      setToken: (token) => set({ token }),
      clearAuth: () => set({ token: null }),

      // JWT에서 userId 추출
      getUserId: () => {
        const token = get().token;
        return getUserIdFromJWT(token);
      },

      // JWT에서 roles 배열 추출
      getRoles: () => {
        const token = get().token;
        return getRolesFromJWT(token);
      },

      // 특정 role 보유 여부
      hasRole: (role: UserRole) => {
        const token = get().token;
        return hasRole(token, role);
      },

      // 사장님 또는 관리자 여부 (roles에 OWNER 또는 ADMIN 포함)
      isOwner: () => {
        const token = get().token;
        return isOwnerOrAdmin(token);
      },

      // 관리자 여부
      isAdmin: () => {
        const token = get().token;
        return hasRole(token, "ADMIN");
      },

      // 인증 여부 (토큰이 있으면 인증됨, 만료는 API 레벨에서 처리)
      isAuthenticated: () => {
        const token = get().token;
        return !!token;
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
