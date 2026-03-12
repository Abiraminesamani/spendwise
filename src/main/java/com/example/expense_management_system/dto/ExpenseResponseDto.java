package com.example.expense_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponseDto {
    private Long id;
    private String description;
    private Double amount;
    private LocalDate date;
    private CategorySummaryDto category;
    private PaymentMethodSummaryDto paymentMethod;
    private AccountResponseDto account;
    private UserSummaryDto user;
}
