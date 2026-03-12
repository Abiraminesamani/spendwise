package com.example.expense_management_system.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
}