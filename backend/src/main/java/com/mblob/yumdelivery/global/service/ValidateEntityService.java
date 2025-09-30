package com.mblob.yumdelivery.global.service;

import com.mblob.yumdelivery.domain.orders.entity.Order;
import com.mblob.yumdelivery.domain.orders.repository.OrderRepository;
import com.mblob.yumdelivery.domain.stores.entity.Menu;
import com.mblob.yumdelivery.domain.stores.entity.Store;
import com.mblob.yumdelivery.domain.stores.repository.MenuRepository;
import com.mblob.yumdelivery.domain.stores.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;

@Service
@RequiredArgsConstructor
public class ValidateEntityService {
    
    private final MenuRepository menuRepository;
    private final StoreRepository storeRepository;
    private final OrderRepository orderRepository;

    // ==================== Menu Validation Methods ====================

    public Menu getMenuById(Long menuId, Long storeId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        if (!menu.getStore().getId().equals(storeId)) {
            throw new IllegalArgumentException("메뉴가 해당 가게에 속하지 않습니다.");
        }

        return menu;
    }

    // ==================== Store Validation Methods ====================

    public Store getStoreById(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));
    }

    public void validateStoreOwnership(Store store, Long userId) throws AccessDeniedException {
        if (!store.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }
    }

    // ==================== Order Validation Methods ====================

    public Order getCustomerOrderById(
        Long orderId,
        Long userId
    ) throws AccessDeniedException {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order를 찾을 수 없습니다"));

        if (!order.getCustomer().getId().equals(userId) && !order.getStore().getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("접근 불가능한 주문입니다.");
        }

        return order;
    }

    public Order getOwnerOrderById(
        Long orderId,
        Long userId
    ) throws AccessDeniedException {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order를 찾을 수 없습니다"));

        if (!order.getStore().getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("접근 불가능한 주문입니다.");
        }

        return order;
    }
}