package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.AccountResponseDto;
import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.entity.Account;
import com.example.expense_management_system.repository.AccountRepository;
import com.example.expense_management_system.repository.ExpenseRepository;
import com.example.expense_management_system.repository.IncomeRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountRepository accountRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping
    public AccountResponseDto create(@RequestBody Account account) {
        var currentUser = authenticatedUserService.getCurrentUser();
        String accountName = account.getName() == null ? "" : account.getName().trim();

        if (accountName.isEmpty()) {
            throw new IllegalArgumentException("Account name is required");
        }
        if (accountRepository.existsByNameIgnoreCaseAndUser(accountName, currentUser)) {
            throw new IllegalArgumentException("An account with this name already exists");
        }

        account.setName(accountName);
        account.setUser(currentUser);
        account.setBalance(account.getBalance() == null ? 0.0 : account.getBalance());
        return ApiDtoMapper.toAccountResponse(accountRepository.save(account));
    }

    @PutMapping("/{id}")
    public AccountResponseDto update(@PathVariable Long id, @RequestBody Account account) {
        var currentUser = authenticatedUserService.getCurrentUser();
        Account existing = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        String accountName = account.getName() == null ? "" : account.getName().trim();

        if (accountName.isEmpty()) {
            throw new IllegalArgumentException("Account name is required");
        }
        if (!existing.getName().equalsIgnoreCase(accountName)
                && accountRepository.existsByNameIgnoreCaseAndUser(accountName, currentUser)) {
            throw new IllegalArgumentException("An account with this name already exists");
        }

        existing.setName(accountName);
        return ApiDtoMapper.toAccountResponse(accountRepository.save(existing));
    }

    @GetMapping
    public List<AccountResponseDto> getAll() {
        return accountRepository.findByUser(authenticatedUserService.getCurrentUser()).stream()
                .map(ApiDtoMapper::toAccountResponse)
                .toList();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        var currentUser = authenticatedUserService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (expenseRepository.existsByAccount(account)) {
            throw new IllegalArgumentException("Delete related expenses before deleting this account");
        }
        if (incomeRepository.existsByAccount(account)) {
            throw new IllegalArgumentException("Delete related incomes before deleting this account");
        }

        accountRepository.delete(account);
    }
}
