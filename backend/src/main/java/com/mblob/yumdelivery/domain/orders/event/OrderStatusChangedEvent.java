package com.mblob.yumdelivery.domain.orders.event;

import com.mblob.yumdelivery.domain.orders.entity.OrderStatus;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OrderStatusChangedEvent extends ApplicationEvent {
    private final Long orderId;
    private final OrderStatus oldStatus;
    private final OrderStatus newStatus;
    private final Long customerId;
    private final Long storeId;

    public OrderStatusChangedEvent(Object source, Long orderId, OrderStatus oldStatus, 
                                   OrderStatus newStatus, Long customerId, Long storeId) {
        super(source);
        this.orderId = orderId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.customerId = customerId;
        this.storeId = storeId;
    }
}