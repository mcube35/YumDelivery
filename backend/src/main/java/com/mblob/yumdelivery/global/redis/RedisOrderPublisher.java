package com.mblob.yumdelivery.global.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mblob.yumdelivery.domain.orders.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Redis Pub/Sub 발행자 (Lettuce 비동기 기반)
 * 주문 업데이트를 Redis 채널로 비동기 발행
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisOrderPublisher {

    private final RedisTemplate<String, String> redisTemplate;
    private final ChannelTopic orderTopic;
    private final ObjectMapper objectMapper;

    /**
     * 주문 업데이트를 Redis 채널로 비동기 발행
     * Lettuce는 자동으로 논블로킹 I/O 사용
     */
    @Async("redisTaskExecutor")
    public CompletableFuture<Void> publishOrderUpdate(OrderResponse orderResponse) {
        return CompletableFuture.runAsync(() -> {
            try {
                String message = objectMapper.writeValueAsString(orderResponse);
                
                // Lettuce의 비동기 convertAndSend 사용
                redisTemplate.convertAndSend(orderTopic.getTopic(), message);
                
                log.info("✅ Redis로 주문 업데이트 발행 완료 - 주문 ID: {}, 고객: {}, 매장: {}", 
                        orderResponse.id(), orderResponse.customerId(), orderResponse.storeId());
                        
            } catch (Exception e) {
                log.error("❌ Redis 메시지 발행 실패 - 주문 ID: {}", orderResponse.id(), e);
                throw new RuntimeException("Redis publish failed", e);
            }
        });
    }
}
