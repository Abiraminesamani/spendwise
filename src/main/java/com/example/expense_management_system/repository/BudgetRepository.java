package com.example.expense_management_system.repository;

import com.example.expense_management_system.entity.Budget;
import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByUserAndMonth(User user, String month);
    Optional<Budget> findByIdAndUser(Long id, User user);
    Optional<Budget> findByUserAndMonthAndCategoryIsNull(User user, String month);
    Optional<Budget> findByUserAndMonthAndCategory(User user, String month, Category category);
    boolean existsByCategoryAndUser(Category category, User user);
}
