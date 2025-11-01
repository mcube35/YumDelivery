package com.mblob.yumdelivery.domain.orders.dto;


import com.mblob.yumdelivery.domain.orders.entity.Order;
import com.mblob.yumdelivery.domain.orders.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResponse(
        Long id,
        Long storeId,
        String storeName,
        Long customerId,
        String customerName,
        OrderStatus status,
        BigDecimal totalPrice,
        String deliveryAddress,
        String specialRequest,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(OrderItemResponse::from)
                .collect(Collectors.toList());
        
        return new OrderResponse(
                order.getId(),
                order.getStore().getId(),
                order.getStore().getName(),
                order.getCustomer().getId(),
                order.getCustomer().getUsername(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getDeliveryAddress(),
                order.getSpecialRequest(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items
        );
    }
}
