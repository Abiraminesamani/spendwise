package com.example.expense_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeResponseDto {
    private Long id;
    private Double amount;
    private String source;
    private LocalDate date;
    private AccountResponseDto account;
    private UserSummaryDto user;
}
