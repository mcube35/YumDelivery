package com.mblob.yumdelivery.domain.orders.dto;

import com.mblob.yumdelivery.domain.orders.entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long menuId,
        String menuName,
        Integer qty,
        BigDecimal price
) {
    public static OrderItemResponse from(OrderItem orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getMenu().getId(),
                orderItem.getMenu().getName(),
                orderItem.getQty(),
                orderItem.getMenu().getPrice()
        );
    }
}
