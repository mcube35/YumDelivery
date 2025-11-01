package com.mblob.yumdelivery.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mblob.yumdelivery.domain.orders.dto.OrderResponse;

import java.util.concurrent.Executor;

/**
 * Redis 설정 (Lettuce 기반)
 * - 비동기 Pub/Sub
 * - 연결 풀링 최적화
 * - 논블로킹 I/O
 */
@Configuration
@EnableAsync(proxyTargetClass = true)
@RequiredArgsConstructor
public class RedisConfig {

    private final ObjectMapper objectMapper;

    @Bean
    public ChannelTopic orderTopic() {
        return new ChannelTopic("order:updates");
    }

    /**
     * Lettuce 연결 팩토리는 application.properties에서 자동 설정
     * spring.data.redis.lettuce.* 속성 사용
     */

    /**
     * Redis 메시지 리스너 컨테이너
     * - 비동기 메시지 처리
     * - 전용 스레드 풀 사용
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter listenerAdapter,
            ChannelTopic orderTopic,
            Executor redisTaskExecutor
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, orderTopic);
        container.setTaskExecutor(redisTaskExecutor); // 비동기 처리용 Executor
        return container;
    }

    /**
     * Redis 전용 스레드 풀
     * - Pub/Sub 메시지 처리를 메인 스레드에서 분리
     */
    @Bean(name = "redisTaskExecutor")
    public Executor redisTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("redis-pubsub-");
        executor.initialize();
        return executor;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(RedisOrderSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "onMessage");
    }

    /**
     * RedisTemplate - String 기반 (Pub/Sub용)
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        
        return template;
    }

    /**
     * RedisTemplate - OrderResponse 전용 (캐싱용)
     */
    @Bean
    public RedisTemplate<String, OrderResponse> orderRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, OrderResponse> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        Jackson2JsonRedisSerializer<OrderResponse> serializer = 
            new Jackson2JsonRedisSerializer<>(objectMapper, OrderResponse.class);
        
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        
        return template;
    }
}
