package com.mblob.yumdelivery.domain.stores.dto;

import com.mblob.yumdelivery.domain.stores.entity.Menu;

import java.math.BigDecimal;

public record MenuResponse(
        Long id,
        Long storeId,
        String name,
        String description,
        BigDecimal price,
        Integer stock
) {
    public static MenuResponse from(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getStore().getId(), // Store 엔티티의 id
                menu.getName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getStock()
        );
    }
}
