package com.example.expense_management_system.service;

import com.example.expense_management_system.dto.AuthResponse;
import com.example.expense_management_system.dto.LoginRequest;
import com.example.expense_management_system.dto.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}