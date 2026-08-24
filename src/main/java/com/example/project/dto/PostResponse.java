package com.example.project.dto;

import com.example.project.entity.Post;

import java.time.LocalDateTime;

public record PostResponse(Long id, String title, String content, String authorEmail, LocalDateTime createdAt,
                           LocalDateTime updatedAt) {
    public static PostResponse from(Post post) {
        return new PostResponse(post.getId(), post.getTitle(), post.getContent(), post.getUser().getEmail(), post.getCreatedAt(), post.getUpdatedAt());
    }
}
