package com.example.project.controller;

import com.example.project.dto.UserResponse;
import com.example.project.dto.UserUpdateRequest;
import com.example.project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal String email) {
        return userService.getMe(email);
    }

    @PutMapping("/me")
    public UserResponse updateMe(@AuthenticationPrincipal String email, @Valid @RequestBody UserUpdateRequest request) {
        return userService.updatePassword(email, request);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMe(@AuthenticationPrincipal String email) {
        userService.deleteMe(email);
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return userService.getById(id);
    }
}
