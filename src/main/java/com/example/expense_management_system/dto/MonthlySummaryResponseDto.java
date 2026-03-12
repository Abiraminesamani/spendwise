package com.example.expense_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryResponseDto {
    private Long id;
    private String month;
    private Double totalExpense;
    private Double totalIncome;
    private UserSummaryDto user;
}
