package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.dto.CategoryResponseDto;
import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.repository.BudgetRepository;
import com.example.expense_management_system.repository.CategoryRepository;
import com.example.expense_management_system.repository.ExpenseRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping
    public CategoryResponseDto create(@RequestBody Category category) {
        String categoryName = category.getName() == null ? "" : category.getName().trim();
        String categoryIcon = category.getIcon() == null ? "" : category.getIcon().trim();
        if (categoryName.isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }

        User currentUser = authenticatedUserService.getCurrentUser();
        if (categoryRepository.findByNameIgnoreCaseAndUserIsNull(categoryName).isPresent()
                || categoryRepository.findByNameIgnoreCaseAndUser(categoryName, currentUser).isPresent()) {
            throw new IllegalArgumentException("This category name already exists for you");
        }

        Category saved = Category.builder()
                .name(categoryName)
                .icon(categoryIcon.isEmpty() ? null : categoryIcon)
                .user(currentUser)
                .build();
        return ApiDtoMapper.toCategoryResponse(categoryRepository.save(saved));
    }

    @GetMapping
    public List<CategoryResponseDto> getAll() {
        return categoryRepository.findByUserOrUserIsNull(authenticatedUserService.getCurrentUser()).stream()
                .map(ApiDtoMapper::toCategoryResponse)
                .toList();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        User currentUser = authenticatedUserService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Custom category not found"));

        if (expenseRepository.existsByCategoryAndUser(category, currentUser)) {
            throw new IllegalArgumentException("This category is used by expenses and cannot be deleted");
        }

        if (budgetRepository.existsByCategoryAndUser(category, currentUser)) {
            throw new IllegalArgumentException("This category is used by budgets and cannot be deleted");
        }

        categoryRepository.delete(category);
    }
}
