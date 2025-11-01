package com.mblob.yumdelivery.global.security.jwt;

import com.mblob.yumdelivery.domain.users.entity.Role;
import com.mblob.yumdelivery.domain.users.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {
    private final SecretKey key;
    private final long accessTokenValidityInMillis;
    private final long refreshTokenValidityInMillis;
    private final RedisTemplate<String, String> redisTemplate;

    public JwtTokenProvider(
            @Value("${jwt.secret-key}") String secretKey,
            @Value("${jwt.access-token-validity-in-minutes}") long accessTokenValidityInMinutes,
            @Value("${jwt.refresh-token-validity-in-days}") long refreshTokenValidityInDays,
            RedisTemplate<String, String> redisTemplate
    ) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidityInMillis = accessTokenValidityInMinutes * 60 * 1000;
        this.refreshTokenValidityInMillis = refreshTokenValidityInDays * 24 * 60 * 60 * 1000;
        this.redisTemplate = redisTemplate;
    }

    public String resolveToken(String header) {
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private Claims parseClaims(String token, boolean verifyExp) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            if (!verifyExp) {
                return e.getClaims(); // 만료 검증을 하지 않는 경우, 만료된 토큰의 클레임을 반환
            }
            throw e; // 만료 검증이 필요한 경우 예외를 다시 던짐
        }
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token, true);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    private String createToken(Map<String, Object> claims, long validityInMilliseconds, String jti) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .claims(claims)
                .id(jti)  // JTI 설정
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    public String createAccessToken(User user) {
        String jti = UUID.randomUUID().toString();
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", user.getId().toString());
        claims.put("roles", user.getRoles());

        return createToken(claims, accessTokenValidityInMillis, jti);
    }

    public String createRefreshToken(String accessToken) {
        // 1. Access Token에서 정보 추출
        Claims accessTokenClaims = parseClaims(accessToken, true);
        Long userId = Long.parseLong(accessTokenClaims.getSubject());
        String accessTokenJti = accessTokenClaims.getId();

        // 2. 새로운 Refresh Token 생성
        String refreshTokenJti = UUID.randomUUID().toString();
        Map<String, Object> claims = Map.of("sub", userId.toString());
        String refreshToken = createToken(claims, refreshTokenValidityInMillis, refreshTokenJti);

        // 3. Redis에 저장 (Access Token별 Refresh Token 관리)
        String redisKey = String.format("RT:%d:%s", userId, accessTokenJti);
        redisTemplate.opsForValue()
                .set(redisKey, refreshToken, refreshTokenValidityInMillis, TimeUnit.MILLISECONDS);

        // 4. Refresh Token 반환
        return refreshToken;
    }

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenValidityInMillis / 1000) // Convert to seconds
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void removeRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseClaims(token, true);
        return Long.parseLong(claims.getSubject());
    }

    public boolean validateRefreshToken(String refreshToken, String accessToken) {
        if (!validateToken(refreshToken)) {
            return false;
        }

        Claims claims = parseClaims(accessToken, false);
        Long userId = Long.parseLong(claims.getSubject());
        String accessTokenJti = claims.getId();

        String redisKey = String.format("RT:%d:%s", userId, accessTokenJti);
        String storedRefreshToken = redisTemplate.opsForValue().get(redisKey);

        return refreshToken.equals(storedRefreshToken);
    }

    public void deleteRefreshToken(String accessToken) {
        Claims claims = parseClaims(accessToken, false);
        long userId = Long.parseLong(claims.getSubject());
        String accessTokenJti = claims.getId();

        String key = String.format("RT:%d:%s", userId, accessTokenJti);
        redisTemplate.delete(key);
    }
}
