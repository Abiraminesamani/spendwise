package com.example.expense_management_system.controller;

import com.example.expense_management_system.entity.PaymentMethod;
import com.example.expense_management_system.repository.PaymentMethodRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;

    @PostMapping
    public PaymentMethod create(@RequestBody PaymentMethod pm) {
        return paymentMethodRepository.save(pm);
    }

    @GetMapping
    public List<PaymentMethod> getAll() {
        return paymentMethodRepository.findAll();
    }
}