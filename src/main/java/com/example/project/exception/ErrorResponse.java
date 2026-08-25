package com.example.project.exception;

import java.time.LocalDateTime;

public record ErrorResponse(int status, String code, String message, LocalDateTime timestamp) {
    public static ErrorResponse from(ErrorCode errorCode) {
        return new ErrorResponse(errorCode.getStatus().value(), errorCode.name(), errorCode.getMessage(), LocalDateTime.now());
    }
}
