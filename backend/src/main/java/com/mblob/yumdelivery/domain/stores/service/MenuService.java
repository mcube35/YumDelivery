package com.mblob.yumdelivery.domain.stores.service;

import com.mblob.yumdelivery.domain.stores.dto.MenuAddRequest;
import com.mblob.yumdelivery.domain.stores.dto.MenuEditRequest;
import com.mblob.yumdelivery.domain.stores.dto.MenuResponse;
import com.mblob.yumdelivery.domain.stores.entity.Menu;
import com.mblob.yumdelivery.domain.stores.entity.Store;
import com.mblob.yumdelivery.domain.stores.repository.MenuRepository;
import com.mblob.yumdelivery.global.security.CustomUserDetails;
import com.mblob.yumdelivery.global.service.ValidateEntityService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;
    private final ValidateEntityService validateEntityService;

    @Transactional(readOnly = true)
    public List<MenuResponse> getAllMenus(
        Long storeId
    ) {

        return menuRepository.findByStoreId(storeId)
                .stream()
                .map(MenuResponse::from)
                .toList();
    }

    @Transactional()
    public MenuResponse addMenu(
        Long storeId,
        CustomUserDetails userDetails,
        MenuAddRequest request
    ) throws AccessDeniedException {

        Store store = validateEntityService.getStoreById(storeId);
        Long userId = userDetails.getUser().getId();
        validateEntityService.validateStoreOwnership(store, userId);

        Menu menu = Menu.builder()
                .store(store)
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stock(request.stock())
                .category(request.category())
                .build();

        Menu savedMenu = menuRepository.save(menu);
        return MenuResponse.from(savedMenu);
    }

    @Transactional()
    public MenuResponse editMenu(
        Long storeId,
        Long menuId,
        CustomUserDetails userDetails,
        MenuEditRequest request
    ) throws AccessDeniedException {

        Menu menu = validateEntityService.getMenuById(menuId, storeId);
        Store store = menu.getStore();
        Long userId = userDetails.getUser().getId();

        validateEntityService.validateStoreOwnership(store, userId);

        menu.update(
            request.name(),
            request.description(),
            request.price(),
            request.stock(),
            request.category()
        );

        return MenuResponse.from(menu);
    }

    @Transactional()
    public void deleteMenu(
        Long storeId,
        Long menuId,
        CustomUserDetails userDetails
    ) throws AccessDeniedException {

        Menu menu = validateEntityService.getMenuById(menuId, storeId);
        Store store = menu.getStore();
        Long userId = userDetails.getUser().getId();

        validateEntityService.validateStoreOwnership(store, userId);

        menuRepository.deleteById(menuId);
    }
}
