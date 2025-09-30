package com.mblob.yumdelivery.domain.stores.controller;

import com.mblob.yumdelivery.domain.stores.dto.StoreEditRequest;
import com.mblob.yumdelivery.domain.stores.dto.StoreEntryRequest;
import com.mblob.yumdelivery.domain.stores.dto.StoreResponse;
import com.mblob.yumdelivery.domain.stores.service.StoreService;
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
@RequestMapping("/api/stores")
public class StoreController {
    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<List<StoreResponse>> getAllStores() {
        List<StoreResponse> storeResponseList = storeService.getAllStores();
        return ResponseEntity.ok(storeResponseList);
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<StoreResponse> getStore(
            @PathVariable Long storeId
    ) {
        StoreResponse storeResponse = storeService.getStore(storeId);
        return ResponseEntity.ok(storeResponse);
    }

    @PostMapping
    public ResponseEntity<StoreResponse> applyStoreEntry(
            @Valid @RequestBody StoreEntryRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        StoreResponse storeResponse = storeService.applyStoreEntry(request, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(storeResponse);
    }

    @PutMapping("/{storeId}")
    public ResponseEntity<StoreResponse> editStoreInfo(
            @PathVariable Long storeId,
            @Valid @RequestBody StoreEditRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws AccessDeniedException {
        StoreResponse storeResponse = storeService.editStoreInfo(storeId, request, userDetails);
        return ResponseEntity.ok(storeResponse);
    }

    @DeleteMapping("/{storeId}")
    public ResponseEntity<Void> deleteStore(
            @PathVariable Long storeId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws AccessDeniedException {
        storeService.deleteStore(storeId, userDetails);
        return ResponseEntity.noContent().build();
    }
}
