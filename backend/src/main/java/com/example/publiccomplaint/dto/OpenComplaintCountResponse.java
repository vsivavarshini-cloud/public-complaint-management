package com.example.publiccomplaint.dto;

public record OpenComplaintCountResponse(
        Integer officerId,
        String officerName,
        Integer openComplaints
) {
}
