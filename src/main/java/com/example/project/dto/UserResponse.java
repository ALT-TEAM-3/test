package com.example.project.dto;

import com.example.project.entity.User;

import java.time.LocalDateTime;

public record UserResponse(Long id, String email, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }
}
