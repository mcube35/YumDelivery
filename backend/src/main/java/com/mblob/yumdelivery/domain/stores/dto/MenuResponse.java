package com.mblob.yumdelivery.domain.stores.dto;

import com.mblob.yumdelivery.domain.stores.entity.Menu;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record MenuResponse(
        Long id,
        Long storeId,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        String category,
        String imageUrl
) {
    public static MenuResponse from(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getStore().getId(), // Store 엔티티의 id
                menu.getName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getStock(),
                menu.getCategory(),
                menu.getImageUrl()
        );
    }
}
