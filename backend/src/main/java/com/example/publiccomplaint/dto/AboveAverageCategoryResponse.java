package com.example.publiccomplaint.dto;

public record AboveAverageCategoryResponse(
        Integer categoryId,
        String categoryName,
        Long complaintCount
) {
}
