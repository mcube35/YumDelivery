import { jwtDecode } from "jwt-decode";
import type { UserRole, JWTPayload } from "./types";

/**
 * JWT 토큰을 디코딩합니다 (검증하지 않음!)
 * jwt-decode 라이브러리를 사용하여 안전하게 디코딩합니다.
 *
 * 주의: 이 함수는 토큰의 서명을 검증하지 않습니다.
 * 실제 보안 검증은 백엔드에서 수행되어야 합니다.
 *
 * @param token - JWT 토큰 문자열
 * @returns 디코딩된 payload 또는 null (실패 시)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * JWT 토큰이 만료되었는지 확인합니다
 *
 * @param token - JWT 토큰 문자열
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export function isJWTExpired(token: string): boolean {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return true;
  }

  // exp는 초 단위, Date.now()는 밀리초 단위
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}

/**
 * JWT에서 사용자 ID를 추출합니다
 *
 * @param token - JWT 토큰 문자열
 * @returns 사용자 ID (Long을 String으로) 또는 null
 */
export function getUserIdFromJWT(token: string | null): string | null {
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.sub || null;
}

/**
 * JWT에서 roles 배열을 추출합니다
 * 백엔드는 roles를 배열로 저장 (예: ["USER", "OWNER"])
 *
 * @param token - JWT 토큰 문자열
 * @returns 역할 배열 또는 빈 배열
 */
export function getRolesFromJWT(token: string | null): UserRole[] {
  if (!token) return [];

  const payload = decodeJWT(token);
  return payload?.roles || [];
}

/**
 * 사용자가 특정 role을 가지고 있는지 확인합니다
 *
 * @param token - JWT 토큰 문자열
 * @param role - 확인할 역할
 * @returns role 포함 여부
 */
export function hasRole(token: string | null, role: UserRole): boolean {
  const roles = getRolesFromJWT(token);
  return roles.includes(role);
}

/**
 * 사용자가 OWNER 또는 ADMIN 권한을 가지고 있는지 확인합니다
 *
 * @param token - JWT 토큰 문자열
 * @returns OWNER 또는 ADMIN 여부
 */
export function isOwnerOrAdmin(token: string | null): boolean {
  const roles = getRolesFromJWT(token);
  return roles.includes("OWNER") || roles.includes("ADMIN");
}

/**
 * JWT 토큰의 JTI (JWT ID)를 추출합니다
 *
 * @param token - JWT 토큰 문자열
 * @returns JTI (UUID) 또는 null
 */
export function getJtiFromJWT(token: string | null): string | null {
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.jti || null;
}
