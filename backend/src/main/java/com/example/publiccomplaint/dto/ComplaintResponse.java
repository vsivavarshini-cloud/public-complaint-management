package com.example.publiccomplaint.dto;

import java.time.LocalDateTime;

public record ComplaintResponse(
        Integer complaintId,
        Integer citizenId,
        String citizenName,
        Integer categoryId,
        String categoryName,
        Integer officerId,
        String officerName,
        String description,
        String status,
        LocalDateTime createdAt
) {
}
