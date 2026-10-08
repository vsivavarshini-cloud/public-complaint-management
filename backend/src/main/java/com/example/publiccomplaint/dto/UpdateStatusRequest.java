package com.example.publiccomplaint.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStatusRequest(
        @NotBlank(message = "status is required")
        String status
) {
}
