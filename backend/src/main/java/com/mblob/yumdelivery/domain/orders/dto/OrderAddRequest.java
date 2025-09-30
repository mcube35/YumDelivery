package com.mblob.yumdelivery.domain.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record OrderAddRequest(
        @NotNull
        @Positive
        Long storeId,

        @NotBlank
        @Size(max = 255)
        String deliveryAddress,

        @Size(max = 500)
        String specialRequest,

        @NotEmpty
        @Valid
        List<OrderItemRequest> items
) {
    public record OrderItemRequest(
            @NotNull
            @Positive
            Long menuId,

            @NotNull
            @Positive
            Integer qty
    ) {}
}
