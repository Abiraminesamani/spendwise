package com.example.expense_management_system.repository;

import com.example.expense_management_system.entity.MonthlySummary;
import com.example.expense_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MonthlySummaryRepository extends JpaRepository<MonthlySummary, Long> {
    List<MonthlySummary> findByUser(User user);
    Optional<MonthlySummary> findByUserAndMonth(User user, String month);
}
