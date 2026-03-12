package com.example.expense_management_system.service;

import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("No authenticated user found");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }
}
