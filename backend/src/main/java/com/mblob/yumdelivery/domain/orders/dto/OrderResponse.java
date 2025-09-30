package com.mblob.yumdelivery.domain.orders.dto;


import com.mblob.yumdelivery.domain.orders.entity.Order;
import com.mblob.yumdelivery.domain.orders.entity.OrderStatus;

import java.math.BigDecimal;

public record OrderResponse(
        Long id,
        Long storeId,
        String customerName,
        OrderStatus status,
        BigDecimal totalPrice,
        String deliveryAddress,
        String specialRequest
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getStore().getId(),
                order.getCustomer().getUsername(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getDeliveryAddress(),
                order.getSpecialRequest()
        );
    }
}
