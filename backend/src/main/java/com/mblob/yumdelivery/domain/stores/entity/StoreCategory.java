package com.mblob.yumdelivery.domain.stores.entity;

public enum StoreCategory {
    CHICKEN("치킨"),
    PIZZA("피자"),
    KOREAN("한식"),
    CHINESE("중식"),
    JAPANESE("일식"),
    FAST_FOOD("패스트푸드"),
    SNACK("분식");

    private final String koreanName;

    StoreCategory(String koreanName) {
        this.koreanName = koreanName;
    }

    public String getKoreanName() {
        return koreanName;
    }
}