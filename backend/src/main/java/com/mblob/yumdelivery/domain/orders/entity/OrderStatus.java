package com.mblob.yumdelivery.domain.orders.entity;

public enum OrderStatus {
    PENDING,    // 주문 접수 대기
    CANCELLED,   // 주문 취소
    ACCEPTED,   // 주문 승인
    REJECTED,   // 주문 거절
    COMPLETED,  // 배달 완료
}