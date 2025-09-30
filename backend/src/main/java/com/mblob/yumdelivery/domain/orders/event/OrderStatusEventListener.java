package com.mblob.yumdelivery.domain.orders.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
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
        
        // Add your business logic here:
        // - Send notifications
        // - Update analytics
        // - Send emails/SMS
        // - Update external systems
        
        switch (event.getNewStatus()) {
            case ACCEPTED -> handleOrderAccepted(event);
            case REJECTED -> handleOrderRejected(event);
            case COMPLETED -> handleOrderCompleted(event);
            case CANCELLED -> handleOrderCancelled(event);
        }
    }

    private void handleOrderAccepted(OrderStatusChangedEvent event) {
        // Send notification to customer
        log.info("Sending acceptance notification for order {}", event.getOrderId());
    }

    private void handleOrderRejected(OrderStatusChangedEvent event) {
        // Send rejection notification and process refund
        log.info("Processing rejection for order {}", event.getOrderId());
    }

    private void handleOrderCompleted(OrderStatusChangedEvent event) {
        // Send completion notification and request review
        log.info("Processing completion for order {}", event.getOrderId());
    }

    private void handleOrderCancelled(OrderStatusChangedEvent event) {
        // Process cancellation and refund
        log.info("Processing cancellation for order {}", event.getOrderId());
    }
}