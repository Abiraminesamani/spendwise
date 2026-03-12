package com.example.expense_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private String description;
    private Double amount;
    // ISO date string, e.g. "2026-03-09"
    private String date;

    // IDs only (safe & explicit)
    private Long categoryId;
    private Long paymentMethodId;
    private Long accountId;
}