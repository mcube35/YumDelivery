package com.mblob.yumdelivery.domain.users.service;

import com.mblob.yumdelivery.domain.users.dto.LoginRequest;
import com.mblob.yumdelivery.domain.users.dto.LoginResponse;
import com.mblob.yumdelivery.domain.users.dto.RegisterRequest;
import com.mblob.yumdelivery.domain.users.entity.Role;
import com.mblob.yumdelivery.domain.users.entity.User;
import com.mblob.yumdelivery.domain.users.repository.UserRepository;
import com.mblob.yumdelivery.global.security.CustomUserDetails;
import com.mblob.yumdelivery.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void register(RegisterRequest request) {
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .username(request.username())
                .roles(Set.of(Role.USER))
                .build();

        userRepository.save(user);
    }

    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String accessToken = jwtTokenProvider.createAccessToken(user);

        String refreshToken = jwtTokenProvider.createRefreshToken(accessToken);
        jwtTokenProvider.addRefreshTokenCookie(response, refreshToken);

        return new LoginResponse(accessToken);
    }
}
