package com.mblob.yumdelivery.domain.orders.repository;

import com.mblob.yumdelivery.domain.orders.entity.Order;
import com.mblob.yumdelivery.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByCustomer(User customer);
    List<Order> findAllByStoreId(Long storeId);
}