package com.mblob.yumdelivery.domain.orders.service;

import com.mblob.yumdelivery.domain.orders.dto.OrderAddRequest;
import com.mblob.yumdelivery.domain.orders.dto.OrderResponse;
import com.mblob.yumdelivery.domain.orders.entity.Order;
import com.mblob.yumdelivery.domain.orders.entity.OrderItem;
import com.mblob.yumdelivery.domain.orders.entity.OrderStatus;
import com.mblob.yumdelivery.domain.orders.event.OrderStatusChangedEvent;
import com.mblob.yumdelivery.domain.stores.entity.*;
import com.mblob.yumdelivery.domain.orders.repository.OrderRepository;
import com.mblob.yumdelivery.domain.users.entity.User;
import com.mblob.yumdelivery.global.security.CustomUserDetails;
import com.mblob.yumdelivery.global.service.ValidateEntityService;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ValidateEntityService validateEntityService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllMyOrder(
            CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();

        return orderRepository.findAllByCustomer(user)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional
    public OrderResponse createOrder(
            OrderAddRequest request,
            CustomUserDetails userDetails
    ) {
        Long storeId = request.storeId();
        Store store = validateEntityService.getStoreById(storeId);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderAddRequest.OrderItemRequest itemRequest : request.items()) {
            Menu menu = validateEntityService.getMenuById(itemRequest.menuId(), storeId);

            if (menu.getStock() < itemRequest.qty()) {
                throw new IllegalArgumentException("재고가 부족합니다: " + menu.getName());
            }

            BigDecimal itemTotal = menu.getPrice().multiply(BigDecimal.valueOf(itemRequest.qty()));
            totalPrice = totalPrice.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .menu(menu)
                    .qty(itemRequest.qty())
                    .build();
            
            orderItems.add(orderItem);
        }

        Order order = Order.builder()
                .customer(userDetails.getUser())
                .store(store)
                .status(OrderStatus.PENDING)
                .deliveryAddress(request.deliveryAddress())
                .specialRequest(request.specialRequest())
                .totalPrice(totalPrice)
                .orderItems(orderItems)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        
        Order savedOrder = orderRepository.save(order);
        return OrderResponse.from(savedOrder);
    }

    @Transactional
    public OrderResponse editOrderStatus(
            Long orderId,
            OrderStatus status,
            CustomUserDetails userDetails
    ) throws AccessDeniedException {

        Long userId = userDetails.getUser().getId();
        
        Order order = switch (status) {
                case CANCELLED -> validateEntityService.getCustomerOrderById(orderId, userId);
                case ACCEPTED, COMPLETED, REJECTED -> validateEntityService.getOwnerOrderById(orderId, userId);
                default -> throw new IllegalArgumentException("Invalid order status: " + status);
        };

        OrderStatus oldStatus = order.getStatus();
        if (!oldStatus.equals(OrderStatus.PENDING)) {
            throw new IllegalArgumentException("수정할 수 없는 주문입니다.");
        }
        order.updateStatus(status);

        // Publish event
        eventPublisher.publishEvent(new OrderStatusChangedEvent(
            this,
            order.getId(),
            oldStatus,
            status,
            order.getCustomer().getId(),
            order.getStore().getId()
        ));

        return OrderResponse.from(order);
    }
}
