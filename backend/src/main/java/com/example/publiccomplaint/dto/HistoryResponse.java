package com.example.publiccomplaint.dto;

import java.time.LocalDateTime;

public record HistoryResponse(
        Integer historyId,
        Integer complaintId,
        String oldStatus,
        String newStatus,
        LocalDateTime changedAt
) {
}
