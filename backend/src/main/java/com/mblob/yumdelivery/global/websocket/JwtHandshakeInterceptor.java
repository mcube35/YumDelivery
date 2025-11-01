package com.mblob.yumdelivery.global.websocket;

import com.mblob.yumdelivery.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

/**
 * WebSocket Handshake 시 JWT 인증 처리
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) throws Exception {
        
        URI uri = request.getURI();
        String query = uri.getQuery();
        
        if (query == null) {
            log.warn("❌ JWT 토큰이 없습니다");
            return false;
        }
        
        // ?token=xxx 파라미터에서 토큰 추출
        String token = null;
        for (String param : query.split("&")) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2 && "token".equals(keyValue[0])) {
                token = keyValue[1];
                break;
            }
        }
        
        if (token == null) {
            log.warn("❌ JWT 토큰 파라미터가 없습니다");
            return false;
        }
        
        // JWT 토큰 검증
        if (!jwtTokenProvider.validateToken(token)) {
            log.warn("❌ 유효하지 않은 JWT 토큰: {}", token);
            return false;
        }
        
        // 토큰에서 사용자 정보 추출하여 attributes에 저장
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        attributes.put("userId", userId);
        attributes.put("token", token);
        
        log.info("✅ JWT 인증 성공 - 사용자 ID: {}", userId);
        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        if (exception != null) {
            log.error("❌ Handshake 실패", exception);
        }
    }
}
