package com.mblob.yumdelivery.domain.stores.repository;

import com.mblob.yumdelivery.domain.stores.entity.Store;
import com.mblob.yumdelivery.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByOwner(User owner);
}