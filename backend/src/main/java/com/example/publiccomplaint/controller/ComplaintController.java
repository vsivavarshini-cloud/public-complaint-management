package com.example.publiccomplaint.controller;

import com.example.publiccomplaint.dto.ComplaintResponse;
import com.example.publiccomplaint.dto.CreateComplaintRequest;
import com.example.publiccomplaint.dto.HistoryResponse;
import com.example.publiccomplaint.dto.UpdateStatusRequest;
import com.example.publiccomplaint.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService service;

    public ComplaintController(ComplaintService service) {
        this.service = service;
    }

    @GetMapping
    public List<ComplaintResponse> getAllComplaints() {
        return service.getAllComplaints();
    }

    @GetMapping("/{complaintId}")
    public ComplaintResponse getComplaint(@PathVariable Integer complaintId) {
        return service.getComplaint(complaintId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComplaintResponse registerComplaint(@Valid @RequestBody CreateComplaintRequest request) {
        return service.registerComplaint(request);
    }

    @PutMapping("/{complaintId}/status")
    public ComplaintResponse updateStatus(
            @PathVariable Integer complaintId,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return service.updateStatus(complaintId, request.status());
    }

    @GetMapping("/{complaintId}/history")
    public List<HistoryResponse> getHistory(@PathVariable Integer complaintId) {
        return service.getHistory(complaintId);
    }
}
