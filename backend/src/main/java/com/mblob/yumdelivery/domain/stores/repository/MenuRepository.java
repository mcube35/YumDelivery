package com.mblob.yumdelivery.domain.stores.repository;

import com.mblob.yumdelivery.domain.stores.entity.Menu;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByStoreId(Long storeId);
}