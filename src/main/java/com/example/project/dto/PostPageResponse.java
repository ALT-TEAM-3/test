package com.example.project.dto;

import java.util.List;

import org.springframework.data.domain.Page;

public record PostPageResponse(List<PostSummaryResponse> content, int page, int size, long totalElements,
                               int totalPages) {
    public static PostPageResponse from(Page<PostSummaryResponse> posts) {
        return new PostPageResponse(posts.getContent(), posts.getNumber(), posts.getSize(), posts.getTotalElements(), posts.getTotalPages());
    }
}
