package com.mblob.yumdelivery.domain.stores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoreEntryRequest(
        @NotBlank String name,

        @Size(max = 255) String description,

        @NotBlank @Size(max = 20) String contact,
        
        @NotBlank String address
) {}
