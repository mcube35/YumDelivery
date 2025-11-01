package com.mblob.yumdelivery.domain.orders.dto;

import com.mblob.yumdelivery.domain.orders.entity.OrderStatus;

public record OrderStatusRequest(
    OrderStatus status
) {
}
