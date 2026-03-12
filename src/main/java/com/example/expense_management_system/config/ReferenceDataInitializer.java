package com.example.expense_management_system.config;

import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.entity.PaymentMethod;
import com.example.expense_management_system.repository.CategoryRepository;
import com.example.expense_management_system.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReferenceDataInitializer implements CommandLineRunner {

    private final PaymentMethodRepository paymentMethodRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        List<String> defaults = List.of("Cash", "UPI", "Card", "Bank Transfer");
        List<String> categories = List.of(
                "Food & Dining",
                "Transport",
                "Shopping",
                "Entertainment",
                "Healthcare",
                "Bills",
                "Groceries",
                "Travel",
                "Education",
                "Fitness",
                "Salary",
                "Pets",
                "Gifts",
                "Subscriptions",
                "Utilities"
        );

        for (String methodName : defaults) {
            paymentMethodRepository.findByName(methodName)
                    .orElseGet(() -> paymentMethodRepository.save(
                            PaymentMethod.builder().name(methodName).build()
                    ));
        }

        for (String categoryName : categories) {
            categoryRepository.findByNameIgnoreCaseAndUserIsNull(categoryName)
                    .orElseGet(() -> categoryRepository.save(
                            Category.builder().name(categoryName).user(null).build()
                    ));
        }
    }
}
