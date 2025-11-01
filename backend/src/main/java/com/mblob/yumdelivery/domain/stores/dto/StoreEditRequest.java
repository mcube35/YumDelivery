package com.mblob.yumdelivery.domain.stores.dto;

import com.mblob.yumdelivery.domain.stores.entity.StoreCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoreEditRequest(
        @NotBlank String name,

        @Size(max = 255) String description,

        @NotBlank @Size(max = 20) String contact,

        @NotBlank StoreCategory category,

        @NotBlank String imageUrl,
        
        @NotBlank String address
) {}