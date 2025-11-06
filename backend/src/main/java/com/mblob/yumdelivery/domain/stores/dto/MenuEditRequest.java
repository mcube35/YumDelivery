package com.mblob.yumdelivery.domain.stores.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MenuEditRequest(
        @NotBlank
        @Size(max = 100)
        String name,

        @Size(max = 255)
        String description,

        @NotNull
        @Positive
        BigDecimal price,

        @NotNull
        @PositiveOrZero
        Integer stock,

        @NotNull
        @Size(max = 10)
        String category
) {}
