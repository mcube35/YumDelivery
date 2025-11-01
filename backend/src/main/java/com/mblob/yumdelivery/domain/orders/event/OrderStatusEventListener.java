package com.mblob.yumdelivery.domain.orders.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderStatusEventListener {

    @EventListener
    @Async
    @SuppressWarnings("incomplete-switch")
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {
        log.info("Order {} status changed from {} to {} for customer {} at store {}", 
                event.getOrderId(), 
                event.getOldStatus(), 
                event.getNewStatus(),
                event.getCustomerId(),
                event.getStoreId());
        
        switch (event.getNewStatus()) {
            case ACCEPTED -> handleOrderAccepted(event);
            case REJECTED -> handleOrderRejected(event);
            case COMPLETED -> handleOrderCompleted(event);
            case CANCELLED -> handleOrderCancelled(event);
        }
    }

    private void handleOrderAccepted(OrderStatusChangedEvent event) {
        log.info("Order accepted: {}", event.getOrderId());
    }

    private void handleOrderRejected(OrderStatusChangedEvent event) {
        log.info("Order rejected: {}", event.getOrderId());
    }

    private void handleOrderCompleted(OrderStatusChangedEvent event) {
        log.info("Order completed: {}", event.getOrderId());
    }

    private void handleOrderCancelled(OrderStatusChangedEvent event) {
        log.info("Order cancelled: {}", event.getOrderId());
    }
}