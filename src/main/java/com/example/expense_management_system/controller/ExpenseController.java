package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.dto.ExpenseDto;
import com.example.expense_management_system.dto.ExpenseResponseDto;
import com.example.expense_management_system.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponseDto> create(@RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(ApiDtoMapper.toExpenseResponse(expenseService.createExpense(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponseDto> update(@PathVariable Long id, @RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(ApiDtoMapper.toExpenseResponse(expenseService.updateExpense(id, dto)));
    }

    @GetMapping 
    public ResponseEntity<List<ExpenseResponseDto>> getAll() {
        return ResponseEntity.ok(
                expenseService.getCurrentUserExpenses().stream()
                        .map(ApiDtoMapper::toExpenseResponse)
                        .toList()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
} 
