package com.example.publiccomplaint.controller;

import com.example.publiccomplaint.dto.AboveAverageCategoryResponse;
import com.example.publiccomplaint.dto.IdNameResponse;
import com.example.publiccomplaint.service.ComplaintService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final ComplaintService service;

    public CategoryController(ComplaintService service) {
        this.service = service;
    }

    @GetMapping
    public List<IdNameResponse> getCategories() {
        return service.getCategories();
    }

    @GetMapping("/above-average")
    public List<AboveAverageCategoryResponse> getAboveAverageCategories() {
        return service.getAboveAverageCategories();
    }
}
