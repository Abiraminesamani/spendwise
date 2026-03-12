package com.example.expense_management_system.dto;

import com.example.expense_management_system.entity.Account;
import com.example.expense_management_system.entity.Budget;
import com.example.expense_management_system.entity.Category;
import com.example.expense_management_system.entity.Expense;
import com.example.expense_management_system.entity.Income;
import com.example.expense_management_system.entity.MonthlySummary;
import com.example.expense_management_system.entity.PaymentMethod;
import com.example.expense_management_system.entity.User;

public final class ApiDtoMapper {

    private ApiDtoMapper() {
    }

    public static UserSummaryDto toUserSummary(User user) {
        if (user == null) {
            return null;
        }
        return new UserSummaryDto(user.getId(), user.getUsername());
    }

    public static UserResponseDto toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRoles(),
                user.isEnabled(),
                user.isAccountNonLocked()
        );
    }

    public static CategorySummaryDto toCategorySummary(Category category) {
        if (category == null) {
            return null;
        }
        return new CategorySummaryDto(category.getId(), category.getName());
    }

    public static CategoryResponseDto toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponseDto(
                category.getId(),
                category.getName(),
                category.getIcon(),
                category.getUser() == null
        );
    }

    public static PaymentMethodSummaryDto toPaymentMethodSummary(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            return null;
        }
        return new PaymentMethodSummaryDto(paymentMethod.getId(), paymentMethod.getName());
    }

    public static AccountResponseDto toAccountResponse(Account account) {
        if (account == null) {
            return null;
        }
        return new AccountResponseDto(
                account.getId(),
                account.getName(),
                account.getBalance(),
                toUserSummary(account.getUser())
        );
    }

    public static BudgetResponseDto toBudgetResponse(Budget budget) {
        if (budget == null) {
            return null;
        }
        return new BudgetResponseDto(
                budget.getId(),
                budget.getLimitAmount(),
                budget.getMonth(),
                toCategorySummary(budget.getCategory()),
                toUserSummary(budget.getUser())
        );
    }

    public static IncomeResponseDto toIncomeResponse(Income income) {
        if (income == null) {
            return null;
        }
        return new IncomeResponseDto(
                income.getId(),
                income.getAmount(),
                income.getSource(),
                income.getDate(),
                toAccountResponse(income.getAccount()),
                toUserSummary(income.getUser())
        );
    }

    public static ExpenseResponseDto toExpenseResponse(Expense expense) {
        if (expense == null) {
            return null;
        }
        return new ExpenseResponseDto(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getDate(),
                toCategorySummary(expense.getCategory()),
                toPaymentMethodSummary(expense.getPaymentMethod()),
                toAccountResponse(expense.getAccount()),
                toUserSummary(expense.getUser())
        );
    }

    public static MonthlySummaryResponseDto toMonthlySummaryResponse(MonthlySummary summary) {
        if (summary == null) {
            return null;
        }
        return new MonthlySummaryResponseDto(
                summary.getId(),
                summary.getMonth(),
                summary.getTotalExpense(),
                summary.getTotalIncome(),
                toUserSummary(summary.getUser())
        );
    }
}
