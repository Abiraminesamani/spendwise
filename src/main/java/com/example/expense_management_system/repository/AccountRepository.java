package com.example.expense_management_system.repository;

import com.example.expense_management_system.entity.Account;
import com.example.expense_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    Optional<Account> findByIdAndUser(Long id, User user);
    boolean existsByNameIgnoreCaseAndUser(String name, User user);
}
