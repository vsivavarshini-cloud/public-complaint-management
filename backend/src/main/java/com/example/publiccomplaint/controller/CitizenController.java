package com.example.publiccomplaint.controller;

import com.example.publiccomplaint.dto.IdNameResponse;
import com.example.publiccomplaint.service.ComplaintService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    private final ComplaintService service;

    public CitizenController(ComplaintService service) {
        this.service = service;
    }

    @GetMapping
    public List<IdNameResponse> getCitizens() {
        return service.getCitizens();
    }
}
