package com.mblob.yumdelivery.global.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket 설정 (Raw WebSocket + Redis Pub/Sub)
 * - JWT 인증 추가
 * - CORS 설정
 */
@Slf4j
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final OrderWebSocketHandler orderWebSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 고객용 WebSocket 엔드포인트 (userId 기반 필터링)
        registry.addHandler(orderWebSocketHandler, "/ws/orders/customer")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOriginPatterns("*");
        
        // 점주용 WebSocket 엔드포인트 (storeId 기반 필터링)
        registry.addHandler(orderWebSocketHandler, "/ws/orders/store")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOriginPatterns("*");
        
        log.info("✅ WebSocket 엔드포인트 등록 완료");
    }
}
