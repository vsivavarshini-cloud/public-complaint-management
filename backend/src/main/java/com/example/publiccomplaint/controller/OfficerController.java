package com.example.publiccomplaint.controller;

import com.example.publiccomplaint.dto.IdNameResponse;
import com.example.publiccomplaint.dto.OpenComplaintCountResponse;
import com.example.publiccomplaint.service.ComplaintService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
public class OfficerController {

    private final ComplaintService service;

    public OfficerController(ComplaintService service) {
        this.service = service;
    }

    @GetMapping
    public List<IdNameResponse> getOfficers() {
        return service.getOfficers();
    }

    @GetMapping("/{officerId}/open-count")
    public OpenComplaintCountResponse getOpenComplaintCount(@PathVariable Integer officerId) {
        return service.getOpenComplaintCount(officerId);
    }
}
