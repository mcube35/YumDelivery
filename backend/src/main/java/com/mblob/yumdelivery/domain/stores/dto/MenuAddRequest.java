package com.mblob.yumdelivery.domain.stores.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;

public record MenuAddRequest(
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
        Integer stock
) {}
