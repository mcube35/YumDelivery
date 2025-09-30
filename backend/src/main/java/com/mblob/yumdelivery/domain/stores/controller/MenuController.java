package com.mblob.yumdelivery.domain.stores.controller;

import com.mblob.yumdelivery.domain.stores.dto.MenuAddRequest;
import com.mblob.yumdelivery.domain.stores.dto.MenuEditRequest;
import com.mblob.yumdelivery.domain.stores.dto.MenuResponse;
import com.mblob.yumdelivery.domain.stores.service.MenuService;
import com.mblob.yumdelivery.global.security.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores/{storeId}/menus")
public class MenuController {
    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getAllMenus(
        @PathVariable Long storeId
    ) {

        List<MenuResponse> menuResponseList = menuService.getAllMenus(storeId);
        return ResponseEntity.ok(menuResponseList);
    }

    @PostMapping
    public ResponseEntity<MenuResponse> addMenu(
        @PathVariable Long storeId,
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody MenuAddRequest request
    ) throws AccessDeniedException {

        MenuResponse menuResponse = menuService.addMenu(storeId, userDetails, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(menuResponse);
    }

    @PutMapping("/{menuId}")
    public ResponseEntity<MenuResponse> editMenu(
        @PathVariable Long storeId,
        @PathVariable Long menuId,
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody MenuEditRequest request
    ) throws AccessDeniedException {

        MenuResponse menuResponse = menuService.editMenu(storeId, menuId, userDetails, request);
        return ResponseEntity.ok(menuResponse);
    }

    @DeleteMapping("/{menuId}")
    public ResponseEntity<Void> deleteMenu(
        @PathVariable Long storeId,
        @PathVariable Long menuId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws AccessDeniedException {

        menuService.deleteMenu(storeId, menuId, userDetails);
        return ResponseEntity.noContent().build();
    }
}
