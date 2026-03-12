package com.example.expense_management_system.service.impl;

import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.repository.UserRepository;
import com.example.expense_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}