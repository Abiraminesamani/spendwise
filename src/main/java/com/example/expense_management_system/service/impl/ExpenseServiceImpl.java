package com.example.expense_management_system.service.impl;

import com.example.expense_management_system.dto.ExpenseDto;
import com.example.expense_management_system.entity.Account;
import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.entity.Expense;
import com.example.expense_management_system.entity.PaymentMethod;
import com.example.expense_management_system.entity.User;
import com.example.expense_management_system.repository.AccountRepository;
import com.example.expense_management_system.repository.CategoryRepository;
import com.example.expense_management_system.repository.ExpenseRepository;
import com.example.expense_management_system.repository.PaymentMethodRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import com.example.expense_management_system.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final AccountRepository accountRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    @Transactional
    public Expense createExpense(ExpenseDto dto) {
        User currentUser = authenticatedUserService.getCurrentUser();
        ResolvedExpenseData resolvedData = resolveExpenseData(dto, currentUser);

        Expense expense = new Expense();
        applyExpense(expense, resolvedData, currentUser);
        adjustAccountBalance(resolvedData.account(), -resolvedData.amount());

        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getCurrentUserExpenses() {
        return expenseRepository.findByUser(authenticatedUserService.getCurrentUser());
    }

    @Override
    @Transactional
    public Expense updateExpense(Long id, ExpenseDto dto) {
        User currentUser = authenticatedUserService.getCurrentUser();
        Expense existing = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        adjustAccountBalance(existing.getAccount(), existing.getAmount() == null ? 0.0 : existing.getAmount());

        ResolvedExpenseData resolvedData = resolveExpenseData(dto, currentUser);
        applyExpense(existing, resolvedData, currentUser);
        adjustAccountBalance(resolvedData.account(), -resolvedData.amount());

        return expenseRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteExpense(Long id) {
        User currentUser = authenticatedUserService.getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        adjustAccountBalance(expense.getAccount(), expense.getAmount() == null ? 0.0 : expense.getAmount());
        expenseRepository.delete(expense);
    }

    private ResolvedExpenseData resolveExpenseData(ExpenseDto dto, User currentUser) {
        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId must not be null");
        }
        if (dto.getPaymentMethodId() == null) {
            throw new IllegalArgumentException("paymentMethodId must not be null");
        }
        if (dto.getAccountId() == null) {
            throw new IllegalArgumentException("accountId must not be null");
        }
        if (dto.getAmount() == null || dto.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        if (category.getUser() != null && !category.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only use shared categories or your own custom categories");
        }

        PaymentMethod pm = paymentMethodRepository.findById(dto.getPaymentMethodId())
                .orElseThrow(() -> new IllegalArgumentException("PaymentMethod not found: " + dto.getPaymentMethodId()));

        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + dto.getAccountId()));
        if (account.getUser() == null || !account.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only use your own account");
        }

        LocalDate date;
        try {
            date = LocalDate.parse(dto.getDate());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO date: yyyy-MM-dd");
        }

        if ((account.getBalance() == null ? 0.0 : account.getBalance()) < dto.getAmount()) {
            throw new IllegalArgumentException("Insufficient balance in the selected account");
        }

        return new ResolvedExpenseData(
                (dto.getDescription() == null ? "" : dto.getDescription().trim()),
                dto.getAmount(),
                date,
                category,
                pm,
                account
        );
    }

    private void applyExpense(Expense expense, ResolvedExpenseData resolvedData, User currentUser) {
        expense.setDescription(resolvedData.description());
        expense.setAmount(resolvedData.amount());
        expense.setDate(resolvedData.date());
        expense.setCategory(resolvedData.category());
        expense.setPaymentMethod(resolvedData.paymentMethod());
        expense.setAccount(resolvedData.account());
        expense.setUser(currentUser);
    }

    private void adjustAccountBalance(Account account, Double delta) {
        if (account == null || delta == null) {
            return;
        }
        double currentBalance = account.getBalance() == null ? 0.0 : account.getBalance();
        account.setBalance(currentBalance + delta);
        accountRepository.save(account);
    }

    private record ResolvedExpenseData(
            String description,
            Double amount,
            LocalDate date,
            Category category,
            PaymentMethod paymentMethod,
            Account account
    ) {
    }
}
