package com.mblob.yumdelivery.domain.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 10, message = "Username must be between 2 and 10 characters")
    String username,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    String password
) {}