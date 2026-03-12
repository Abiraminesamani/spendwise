package com.example.expense_management_system.service;

import com.example.expense_management_system.entity.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
}