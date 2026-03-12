package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.dto.MonthlySummaryResponseDto;
import com.example.expense_management_system.entity.MonthlySummary;
import com.example.expense_management_system.repository.MonthlySummaryRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monthly-summary")
@RequiredArgsConstructor
public class MonthlySummaryController {

    private final MonthlySummaryRepository repository;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping
    public MonthlySummaryResponseDto create(@RequestBody MonthlySummary summary) {
        var currentUser = authenticatedUserService.getCurrentUser();
        String month = summary.getMonth() == null ? "" : summary.getMonth().trim();
        if (month.isEmpty()) {
            throw new IllegalArgumentException("Month is required");
        }

        MonthlySummary saved = repository.findByUserAndMonth(currentUser, month)
                .map(existing -> {
                    existing.setTotalExpense(summary.getTotalExpense() == null ? 0.0 : summary.getTotalExpense());
                    existing.setTotalIncome(summary.getTotalIncome() == null ? 0.0 : summary.getTotalIncome());
                    return existing;
                })
                .orElseGet(() -> MonthlySummary.builder()
                        .month(month)
                        .totalExpense(summary.getTotalExpense() == null ? 0.0 : summary.getTotalExpense())
                        .totalIncome(summary.getTotalIncome() == null ? 0.0 : summary.getTotalIncome())
                        .user(currentUser)
                        .build());

        return ApiDtoMapper.toMonthlySummaryResponse(repository.save(saved));
    }

    @GetMapping
    public List<MonthlySummaryResponseDto> getAll() {
        return repository.findByUser(authenticatedUserService.getCurrentUser()).stream()
                .map(ApiDtoMapper::toMonthlySummaryResponse)
                .toList();
    }
}
