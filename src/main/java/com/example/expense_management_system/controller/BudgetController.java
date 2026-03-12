package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.dto.BudgetResponseDto;
import com.example.expense_management_system.entity.Budget;
import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.repository.BudgetRepository;
import com.example.expense_management_system.repository.CategoryRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping
    public BudgetResponseDto create(@RequestBody Budget budget) {
        return saveBudget(null, budget);
    }

    @PutMapping("/{id}")
    public BudgetResponseDto update(@PathVariable Long id, @RequestBody Budget budget) {
        return saveBudget(id, budget);
    }

    private BudgetResponseDto saveBudget(Long id, Budget budget) {
        var currentUser = authenticatedUserService.getCurrentUser();
        String month = budget.getMonth() == null ? "" : budget.getMonth().trim();
        Double limitAmount = budget.getLimitAmount();
        if (month.isEmpty()) {
            throw new IllegalArgumentException("Month is required");
        }
        if (limitAmount == null || limitAmount <= 0) {
            throw new IllegalArgumentException("Budget amount must be greater than zero");
        }
        Category category = null;
        if (budget.getCategory() != null && budget.getCategory().getId() != null) {
            category = categoryRepository.findById(budget.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            if (category.getUser() != null && !category.getUser().getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException("You can only use shared categories or your own custom categories");
            }
        }
        final Category resolvedCategory = category;
        final Double resolvedLimitAmount = limitAmount;

        Budget savedBudget;
        if (id != null) {
            savedBudget = budgetRepository.findByIdAndUser(id, currentUser)
                    .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
            Budget existingConflict = resolvedCategory == null
                    ? budgetRepository.findByUserAndMonthAndCategoryIsNull(currentUser, month).orElse(null)
                    : budgetRepository.findByUserAndMonthAndCategory(currentUser, month, resolvedCategory).orElse(null);
            if (existingConflict != null && !existingConflict.getId().equals(id)) {
                throw new IllegalArgumentException("A budget already exists for this month and category");
            }
            savedBudget.setMonth(month);
            savedBudget.setLimitAmount(resolvedLimitAmount);
            savedBudget.setCategory(resolvedCategory);
        } else {
            savedBudget = (resolvedCategory == null
                    ? budgetRepository.findByUserAndMonthAndCategoryIsNull(currentUser, month)
                    : budgetRepository.findByUserAndMonthAndCategory(currentUser, month, resolvedCategory))
                    .map(existing -> {
                        existing.setLimitAmount(resolvedLimitAmount);
                        existing.setCategory(resolvedCategory);
                        return existing;
                    })
                    .orElseGet(() -> {
                        Budget created = new Budget();
                        created.setMonth(month);
                        created.setLimitAmount(resolvedLimitAmount);
                        created.setCategory(resolvedCategory);
                        created.setUser(currentUser);
                        return created;
                    });
        }

        return ApiDtoMapper.toBudgetResponse(budgetRepository.save(savedBudget));
    }

    @GetMapping
    public List<BudgetResponseDto> getAll() {
        return budgetRepository.findByUser(authenticatedUserService.getCurrentUser()).stream()
                .map(ApiDtoMapper::toBudgetResponse)
                .toList();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        var currentUser = authenticatedUserService.getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        budgetRepository.delete(budget);
    }
}
