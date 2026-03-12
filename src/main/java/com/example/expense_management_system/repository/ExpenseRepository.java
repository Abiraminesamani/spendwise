package com.example.expense_management_system.repository;

import com.example.expense_management_system.entity.Expense;
import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.entity.Account;
import com.example.expense_management_system.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    Optional<Expense> findByIdAndUser(Long id, User user);
    boolean existsByAccount(Account account);
    boolean existsByCategoryAndUser(Category category, User user);
}
