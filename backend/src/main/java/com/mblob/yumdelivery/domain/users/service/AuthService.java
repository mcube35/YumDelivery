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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    @Transactional
    public LoginResponse refreshToken(String refreshToken, String accessToken, HttpServletResponse response) {
        if (!jwtTokenProvider.validateRefreshToken(refreshToken, accessToken)) {
            jwtTokenProvider.removeRefreshTokenCookie(response); // 리프레시 토큰은 있는데 유효한 엑세스토큰이 없을 경우 쿠키삭제
            throw new BadCredentialsException("Invalid refresh token");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        String newAccessToken = jwtTokenProvider.createAccessToken(user);

        // 기존 RefreshToken 삭제
        jwtTokenProvider.deleteRefreshToken(accessToken);

        // 새로운 RefreshToken 생성 및 저장
        String newRefreshToken = jwtTokenProvider.createRefreshToken(newAccessToken);
        jwtTokenProvider.addRefreshTokenCookie(response, newRefreshToken);

        return new LoginResponse(newAccessToken);
    }
}
