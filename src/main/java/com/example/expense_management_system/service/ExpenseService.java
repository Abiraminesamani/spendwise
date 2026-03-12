package com.example.expense_management_system.service;

import com.example.expense_management_system.dto.ExpenseDto;
import com.example.expense_management_system.entity.Expense;

import java.util.List;

public interface ExpenseService {
    Expense createExpense(ExpenseDto dto);
    List<Expense> getCurrentUserExpenses();
    Expense updateExpense(Long id, ExpenseDto dto);
    void deleteExpense(Long id);
}
