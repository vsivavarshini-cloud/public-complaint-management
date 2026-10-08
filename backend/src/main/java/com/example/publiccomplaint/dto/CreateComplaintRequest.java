package com.example.publiccomplaint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateComplaintRequest(
        @NotNull(message = "citizenId is required")
        Integer citizenId,

        @NotNull(message = "categoryId is required")
        Integer categoryId,

        Integer officerId,

        @NotBlank(message = "description is required")
        @Size(max = 500, message = "description must be at most 500 characters")
        String description
) {
}
