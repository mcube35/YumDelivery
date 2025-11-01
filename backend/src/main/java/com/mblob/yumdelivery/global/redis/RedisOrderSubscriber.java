package com.mblob.yumdelivery.global.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mblob.yumdelivery.domain.orders.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Redis Pub/Sub 구독자 (Lettuce 비동기 기반)
 * Redis로부터 주문 업데이트 메시지를 받아 WebSocket으로 전달
 * - 논블로킹 메시지 처리
 * - 전용 스레드 풀에서 실행
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisOrderSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final Map<String, WebSocketSessionHandler> sessionHandlers = new ConcurrentHashMap<>();

    /**
     * Redis 메시지 수신 (비동기)
     * RedisConfig의 redisTaskExecutor에서 자동으로 비동기 처리됨
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String messageBody = new String(message.getBody());
            log.debug("📨 Redis 메시지 수신: {}", messageBody);

            // JSON을 OrderResponse로 변환
            OrderResponse orderResponse = objectMapper.readValue(messageBody, OrderResponse.class);
            
            // WebSocket으로 메시지 브로드캐스트 (비동기)
            broadcastToWebSocketAsync(orderResponse);
            
        } catch (Exception e) {
            log.error("❌ Redis 메시지 처리 실패", e);
        }
    }

    /**
     * WebSocket으로 비동기 브로드캐스트
     */
    @Async("redisTaskExecutor")
    private void broadcastToWebSocketAsync(OrderResponse orderResponse) {
        int sentCount = 0;
        
        // 고객별 세션으로 전송
        String customerKey = "customer:" + orderResponse.customerId();
        WebSocketSessionHandler customerHandler = sessionHandlers.get(customerKey);
        if (customerHandler != null) {
            customerHandler.sendMessage(orderResponse);
            sentCount++;
        }

        // 매장별 세션으로 전송
        String storeKey = "store:" + orderResponse.storeId();
        WebSocketSessionHandler storeHandler = sessionHandlers.get(storeKey);
        if (storeHandler != null) {
            storeHandler.sendMessage(orderResponse);
            sentCount++;
        }

        if (sentCount > 0) {
            log.info("✅ WebSocket 브로드캐스트 완료 - 주문 ID: {}, 전송: {}개 세션", 
                    orderResponse.id(), sentCount);
        } else {
            log.debug("ℹ️ 활성 WebSocket 세션 없음 - 주문 ID: {}", orderResponse.id());
        }
    }

    /**
     * WebSocket 세션 핸들러 등록
     */
    public void registerSessionHandler(String key, WebSocketSessionHandler handler) {
        sessionHandlers.put(key, handler);
        log.info("🔗 WebSocket 세션 핸들러 등록: {} (총 {}개)", key, sessionHandlers.size());
    }

    /**
     * WebSocket 세션 핸들러 해제
     */
    public void unregisterSessionHandler(String key) {
        sessionHandlers.remove(key);
        log.info("🔌 WebSocket 세션 핸들러 해제: {} (남은 {}개)", key, sessionHandlers.size());
    }

    /**
     * 활성 세션 수 조회
     */
    public int getActiveSessionCount() {
        return sessionHandlers.size();
    }

    /**
     * WebSocket 세션 핸들러 인터페이스
     */
    public interface WebSocketSessionHandler {
        void sendMessage(OrderResponse message);
    }
}
