package com.example.expense_management_system.controller;

import com.example.expense_management_system.dto.ApiDtoMapper;
import com.example.expense_management_system.dto.UserSummaryDto;
import com.example.expense_management_system.dto.UserResponseDto;
import com.example.expense_management_system.repository.UserRepository;
import com.example.expense_management_system.service.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(ApiDtoMapper::toUserResponse)
                .toList();
    }

    @GetMapping("/me")
    public UserSummaryDto getCurrentUser() {
        return ApiDtoMapper.toUserSummary(authenticatedUserService.getCurrentUser());
    }
}
