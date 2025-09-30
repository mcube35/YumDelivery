package com.mblob.yumdelivery.global.security;

import com.mblob.yumdelivery.domain.users.entity.User;
import com.mblob.yumdelivery.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    // username 기반 조회 (Spring Security 기본용)
    @Override
    @Transactional(readOnly = true)
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    // ID 기반 조회 (JWT 인증용)
    @Transactional(readOnly = true)
    public CustomUserDetails loadUserById(Long userId) throws UsernameNotFoundException {
        return userRepository.findById(userId)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
    }

    private CustomUserDetails createUserDetails(User user) {
        return new CustomUserDetails(user);
    }
}
