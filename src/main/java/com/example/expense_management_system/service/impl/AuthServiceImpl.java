package com.example.expense_management_system.service.impl;

import com.example.expense_management_system.dto.AuthResponse;
import com.example.expense_management_system.dto.LoginRequest;
import com.example.expense_management_system.dto.RegisterRequest;
import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.repository.UserRepository;
import com.example.expense_management_system.security.JwtUtil;
import com.example.expense_management_system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of("USER"))
                .enabled(true)
                .accountNonLocked(true)
                .build();
        userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            ); 
        } 
        catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Load user from DB to ensure roles and current state
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());
        return new AuthResponse(token);
    }
}