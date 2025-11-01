package com.mblob.yumdelivery.domain.users.controller;

import com.mblob.yumdelivery.domain.users.dto.LoginRequest;
import com.mblob.yumdelivery.domain.users.dto.LoginResponse;
import com.mblob.yumdelivery.domain.users.dto.RegisterRequest;
import com.mblob.yumdelivery.domain.users.service.AuthService;
import com.mblob.yumdelivery.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = authService.login(request, response);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            @CookieValue("refreshToken") String refreshToken,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response
    ) {
        String accessToken = jwtTokenProvider.resolveToken(authHeader);
        if (accessToken == null) {
            return ResponseEntity.badRequest().build();
        }
        LoginResponse loginResponse = authService.refreshToken(refreshToken, accessToken, response);
        return ResponseEntity.ok(loginResponse);
    }
}
