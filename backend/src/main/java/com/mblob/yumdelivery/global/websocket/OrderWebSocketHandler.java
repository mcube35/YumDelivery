package com.mblob.yumdelivery.global.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mblob.yumdelivery.domain.orders.dto.OrderResponse;
import com.mblob.yumdelivery.global.redis.RedisOrderSubscriber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket 핸들러 (Lettuce + Redis Pub/Sub)
 * Redis로부터 메시지를 받아 WebSocket 세션으로 전송
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderWebSocketHandler extends TextWebSocketHandler 
        implements RedisOrderSubscriber.WebSocketSessionHandler {

    private final RedisOrderSubscriber redisOrderSubscriber;
    private final ObjectMapper objectMapper;
    
    // 세션 관리: key = "customer:{customerId}" or "store:{storeId}", value = WebSocket sessions
    private final Map<String, Map<String, WebSocketSession>> sessionGroups = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("🔗 WebSocket 연결 시작: {}", session.getId());
        
        // Interceptor에서 검증된 사용자 정보 가져오기
        Long userId = (Long) session.getAttributes().get("userId");
        if (userId == null) {
            log.warn("❌ 사용자 ID가 없습니다");
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        
        String path = session.getUri().getPath();
        String query = session.getUri().getQuery();
        
        // URL 경로에 따라 세션 그룹 결정
        String groupKey;
        if (path.contains("/store")) {
            // /ws/orders/store?storeId=xxx
            String storeId = extractQueryParam(query, "storeId");
            if (storeId == null) {
                log.warn("❌ storeId가 없습니다");
                session.close(CloseStatus.NOT_ACCEPTABLE);
                return;
            }
            groupKey = "store:" + storeId;
            log.info("📦 점주용 WebSocket - storeId: {}, userId: {}", storeId, userId);
        } else {
            // /ws/orders/customer - 고객용
            groupKey = "customer:" + userId;
            log.info("👤 고객용 WebSocket - userId: {}", userId);
        }
        
        // 세션 그룹에 추가
        sessionGroups.computeIfAbsent(groupKey, k -> new ConcurrentHashMap<>())
                     .put(session.getId(), session);
        
        // Redis 구독자에 핸들러 등록
        redisOrderSubscriber.registerSessionHandler(groupKey, this);
        
        log.info("✅ WebSocket 연결 완료 - 그룹: {}, 세션: {}, 사용자: {}", groupKey, session.getId(), userId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("WebSocket 연결 종료: {}, 상태: {}", session.getId(), status);
        
        // 모든 그룹에서 세션 제거
        sessionGroups.forEach((groupKey, sessions) -> {
            if (sessions.remove(session.getId()) != null) {
                log.info("세션 제거 - 그룹: {}, 세션: {}", groupKey, session.getId());
                
                // 그룹에 세션이 없으면 핸들러 등록 해제
                if (sessions.isEmpty()) {
                    sessionGroups.remove(groupKey);
                    redisOrderSubscriber.unregisterSessionHandler(groupKey);
                }
            }
        });
    }

    @Override
    public void sendMessage(OrderResponse message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            TextMessage textMessage = new TextMessage(json);
            
            // 고객에게 전송
            String customerKey = "customer:" + message.customerId();
            sendToGroup(customerKey, textMessage);
            
            // 매장에게 전송
            String storeKey = "store:" + message.storeId();
            sendToGroup(storeKey, textMessage);
            
        } catch (Exception e) {
            log.error("메시지 전송 실패", e);
        }
    }

    private void sendToGroup(String groupKey, TextMessage message) {
        Map<String, WebSocketSession> sessions = sessionGroups.get(groupKey);
        if (sessions != null) {
            sessions.values().forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(message);
                    }
                } catch (IOException e) {
                    log.error("메시지 전송 실패 - 세션: {}", session.getId(), e);
                }
            });
        }
    }

    private String extractQueryParam(String query, String paramName) {
        if (query == null) return null;
        
        // query = "token=xxx&storeId=2"
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2 && keyValue[0].equals(paramName)) {
                return keyValue[1];
            }
        }
        return null;
    }
}
