package com.mblob.yumdelivery.domain.stores.repository;

import com.mblob.yumdelivery.domain.stores.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Long> {
}