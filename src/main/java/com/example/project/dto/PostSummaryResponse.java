package com.example.project.dto;

import com.example.project.entity.Post;

import java.time.LocalDateTime;

public record PostSummaryResponse(Long id, String title, String authorEmail, LocalDateTime createdAt) {
    public static PostSummaryResponse from(Post post) {
        return new PostSummaryResponse(post.getId(), post.getTitle(), post.getUser().getEmail(), post.getCreatedAt());
    }
}
