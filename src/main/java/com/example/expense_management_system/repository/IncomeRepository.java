package com.example.expense_management_system.repository;

import com.example.expense_management_system.entity.Income;
import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser(User user);
    Optional<Income> findByIdAndUser(Long id, User user);
    boolean existsByAccount(Account account);
}
