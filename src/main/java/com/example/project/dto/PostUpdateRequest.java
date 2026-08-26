package com.example.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostUpdateRequest(@NotBlank @Size(max = 255) String title, @NotBlank String content) {
}
