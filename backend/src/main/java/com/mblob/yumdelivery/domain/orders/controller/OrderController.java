package com.mblob.yumdelivery.domain.orders.controller;

import com.mblob.yumdelivery.domain.orders.dto.OrderAddRequest;
import com.mblob.yumdelivery.domain.orders.dto.OrderResponse;
import com.mblob.yumdelivery.domain.orders.dto.OrderStatusRequest;
import com.mblob.yumdelivery.domain.orders.entity.OrderStatus;
import com.mblob.yumdelivery.domain.orders.service.OrderService;
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
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllMyOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        List<OrderResponse> orderResponseList = orderService.getAllMyOrder(userDetails);
        return ResponseEntity.ok(orderResponseList);
    }

    @GetMapping("/stores/{storeId}")
    public ResponseEntity<List<OrderResponse>> getOrderOfStore(
            @PathVariable Long storeId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws AccessDeniedException {

        List<OrderResponse> orderResponseList = orderService.getStoreOrders(storeId, userDetails);
        return ResponseEntity.ok(orderResponseList);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderAddRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        OrderResponse orderResponse = orderService.createOrder(request, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> editOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws AccessDeniedException  {

        OrderResponse orderResponse = orderService.editOrderStatus(orderId, request.status(), userDetails);
        return ResponseEntity.ok(orderResponse);
    }
}
