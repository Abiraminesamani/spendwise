package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.dto.IncomeRequestDto;
import com.example.expense_management_system.dto.IncomeResponseDto;
import com.example.expense_management_system.entity.Account;
import com.example.expense_management_system.entity.Income;
import com.example.expense_management_system.repository.AccountRepository;
import com.example.expense_management_system.repository.IncomeRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeRepository incomeRepository;
    private final AccountRepository accountRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping
    @Transactional
    public IncomeResponseDto create(@RequestBody IncomeRequestDto incomeRequest) {
        return saveIncome(null, incomeRequest);
    }

    @PutMapping("/{id}")
    @Transactional
    public IncomeResponseDto update(@PathVariable Long id, @RequestBody IncomeRequestDto incomeRequest) {
        return saveIncome(id, incomeRequest);
    }

    private IncomeResponseDto saveIncome(Long id, IncomeRequestDto incomeRequest) {
        if (incomeRequest.getAmount() == null || incomeRequest.getAmount() <= 0) {
            throw new IllegalArgumentException("Income amount must be greater than zero");
        }
        if (incomeRequest.getSource() == null || incomeRequest.getSource().trim().isEmpty()) {
            throw new IllegalArgumentException("Income source is required");
        }
        if (incomeRequest.getDate() == null || incomeRequest.getDate().trim().isEmpty()) {
            throw new IllegalArgumentException("Income date is required");
        }
        if (incomeRequest.getAccountId() == null) {
            throw new IllegalArgumentException("Account is required for income entries");
        }

        var currentUser = authenticatedUserService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(incomeRequest.getAccountId(), currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        Income income;
        if (id == null) {
            income = new Income();
        } else {
            income = incomeRepository.findByIdAndUser(id, currentUser)
                    .orElseThrow(() -> new IllegalArgumentException("Income not found"));
            if (income.getAccount() != null) {
                Account oldAccount = income.getAccount();
                oldAccount.setBalance((oldAccount.getBalance() == null ? 0.0 : oldAccount.getBalance()) - (income.getAmount() == null ? 0.0 : income.getAmount()));
                accountRepository.save(oldAccount);
            }
        }

        income.setAmount(incomeRequest.getAmount());
        income.setSource(incomeRequest.getSource().trim());
        income.setDate(LocalDate.parse(incomeRequest.getDate().trim()));
        income.setAccount(account);
        income.setUser(currentUser);

        account.setBalance((account.getBalance() == null ? 0.0 : account.getBalance()) + income.getAmount());
        accountRepository.save(account);

        return ApiDtoMapper.toIncomeResponse(incomeRepository.save(income));
    }

    @GetMapping
    public List<IncomeResponseDto> getAll() {
        return incomeRepository.findByUser(authenticatedUserService.getCurrentUser()).stream()
                .map(ApiDtoMapper::toIncomeResponse)
                .toList();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void delete(@PathVariable Long id) {
        var currentUser = authenticatedUserService.getCurrentUser();
        Income income = incomeRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Income not found"));

        if (income.getAccount() != null) {
            Account account = income.getAccount();
            account.setBalance((account.getBalance() == null ? 0.0 : account.getBalance()) - (income.getAmount() == null ? 0.0 : income.getAmount()));
            accountRepository.save(account);
        }
        incomeRepository.delete(income);
    }
}
