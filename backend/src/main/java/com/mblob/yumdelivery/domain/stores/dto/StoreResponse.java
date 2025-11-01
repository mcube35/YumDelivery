package com.mblob.yumdelivery.domain.stores.dto;

import com.mblob.yumdelivery.domain.stores.entity.Store;

public record StoreResponse(
        Long id,
        String name,
        String description,
        String contact,
        String address,
        String ownerName,
        String category, // Korean 번역된 카테고리
        String imageUrl
) {
    public static StoreResponse from(Store store) {
        return new StoreResponse(
                store.getId(),
                store.getName(),
                store.getDescription(),
                store.getContact(),
                store.getAddress(),
                store.getOwner().getUsername(), // User 엔티티의 username
                store.getCategory().getKoreanName(),
                store.getImageUrl()
        );
    }
}
