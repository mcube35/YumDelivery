package com.mblob.yumdelivery.domain.stores.service;

import com.mblob.yumdelivery.domain.stores.dto.StoreEditRequest;
import com.mblob.yumdelivery.domain.stores.dto.StoreEntryRequest;
import com.mblob.yumdelivery.domain.stores.dto.StoreResponse;
import com.mblob.yumdelivery.domain.stores.entity.Store;
import com.mblob.yumdelivery.domain.stores.repository.StoreRepository;
import com.mblob.yumdelivery.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<StoreResponse> getAllStores() {

        return storeRepository.findAll()
                .stream()
                .map(StoreResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public StoreResponse getStore(
        Long id
    ) {
        
        Store store = storeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));
        return StoreResponse.from(store);
    }

    @Transactional()
    public StoreResponse applyStoreEntry(
        StoreEntryRequest request,
        CustomUserDetails userDetails
    ) {

        Store store = Store.builder()
                .name(request.name())
                .description(request.description())
                .contact(request.contact())
                .address(request.address())
                .owner(userDetails.getUser())
                .build();

        Store savedStore = storeRepository.save(store);
        return StoreResponse.from(savedStore);
    }

    @Transactional()
    public StoreResponse editStoreInfo(
        Long storeId,
        StoreEditRequest request,
        CustomUserDetails userDetails
    ) throws AccessDeniedException {

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));

        if (!store.getOwner().getId().equals(userDetails.getUser().getId())) {
            throw new AccessDeniedException("가게 정보 수정 권한이 없습니다.");
        }

        store.update(
            request.name(),
            request.description(),
            request.contact(),
            request.address()
        );
        
        return StoreResponse.from(store);
    }

    @Transactional()
    public void deleteStore(
            Long storeId,
            CustomUserDetails userDetails
    ) throws AccessDeniedException {

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));

        if (!store.getOwner().getId().equals(userDetails.getUser().getId())) {
            throw new AccessDeniedException("가게 삭제 권한이 없습니다.");
        }

        storeRepository.deleteById(storeId);
    }
}
