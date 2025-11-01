package com.mblob.yumdelivery.domain.stores.entity;

import com.mblob.yumdelivery.domain.users.entity.User;
import com.mblob.yumdelivery.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stores")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Store extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, length = 20)
    private String contact;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StoreCategory category;

    @Column
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    public void update(
            String name,
            String description,
            String contact,
            String address,
            StoreCategory category,
            String imageUrl
    ) {
        this.name = name;
        this.description = description;
        this.contact = contact;
        this.address = address;
        this.category = category;
        this.imageUrl = imageUrl;
    }
}
