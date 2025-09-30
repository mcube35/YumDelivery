package com.mblob.yumdelivery.global.service;

import com.mblob.yumdelivery.domain.stores.entity.Menu;
import com.mblob.yumdelivery.domain.stores.entity.Store;
import com.mblob.yumdelivery.domain.stores.repository.MenuRepository;
import com.mblob.yumdelivery.domain.stores.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 전역 엔티티 검증 서비스
 * 여러 도메인에서 공통으로 사용되는 엔티티 검증 로직을 제공합니다.
 */
@Service
@RequiredArgsConstructor
public class ValidateEntityService {
    
    private final MenuRepository menuRepository;
    private final StoreRepository storeRepository;

    // ==================== Menu Validation Methods ====================
    
    public Menu getValidMenu(Long menuId, Long storeId) {
        Menu menu = getMenuById(menuId);
        validateMenuBelongsToStore(menu, storeId);
        return menu;
    }

    public Menu getMenuById(Long menuId) {
        return menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));
    }

    public void validateMenuBelongsToStore(Menu menu, Long storeId) {
        if (!menu.getStore().getId().equals(storeId)) {
            throw new IllegalArgumentException("메뉴가 해당 가게에 속하지 않습니다.");
        }
    }

    // ==================== Store Validation Methods ====================

    public Store getStoreById(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));
    }

    public void validateStoreOwnership(Store store, Long userId) {
        if (!store.getOwner().getId().equals(userId)) {
            throw new IllegalArgumentException("가게 소유자가 아닙니다.");
        }
    }
}