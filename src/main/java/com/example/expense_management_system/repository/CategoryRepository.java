package com.example.expense_management_system.repository;

import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    Optional<Category> findByNameIgnoreCaseAndUser(String name, User user);
    Optional<Category> findByNameIgnoreCaseAndUserIsNull(String name);
    List<Category> findByUserOrUserIsNull(User user);
    Optional<Category> findByIdAndUser(Long id, User user);
}
