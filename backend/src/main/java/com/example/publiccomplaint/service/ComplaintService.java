package com.example.publiccomplaint.service;

import com.example.publiccomplaint.dto.AboveAverageCategoryResponse;
import com.example.publiccomplaint.dto.ComplaintResponse;
import com.example.publiccomplaint.dto.CreateComplaintRequest;
import com.example.publiccomplaint.dto.HistoryResponse;
import com.example.publiccomplaint.dto.IdNameResponse;
import com.example.publiccomplaint.dto.OpenComplaintCountResponse;
import com.example.publiccomplaint.exception.ResourceNotFoundException;
import com.example.publiccomplaint.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class ComplaintService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("OPEN", "IN_PROGRESS", "RESOLVED");

    private final ComplaintRepository repository;

    public ComplaintService(ComplaintRepository repository) {
        this.repository = repository;
    }

    public List<ComplaintResponse> getAllComplaints() {
        return repository.findAllWithDetails();
    }

    public ComplaintResponse getComplaint(Integer complaintId) {
        return repository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + complaintId));
    }

    public List<AboveAverageCategoryResponse> getAboveAverageCategories() {
        return repository.findCategoriesAboveAverage();
    }

    @Transactional
    public ComplaintResponse registerComplaint(CreateComplaintRequest request) {
        repository.registerComplaint(
                request.citizenId(),
                request.categoryId(),
                request.officerId(),
                request.description()
        );

        Long newComplaintId = repository.getLastInsertedId();
        if (newComplaintId == null) {
            throw new IllegalStateException("Could not determine the new complaint id");
        }

        return getComplaint(newComplaintId.intValue());
    }

    public OpenComplaintCountResponse getOpenComplaintCount(Integer officerId) {
        String officerName = repository.findOfficerName(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found: " + officerId));
        int count = repository.countOpenComplaintsForOfficer(officerId);
        return new OpenComplaintCountResponse(officerId, officerName, count);
    }

    @Transactional
    public ComplaintResponse updateStatus(Integer complaintId, String newStatus) {
        String normalizedStatus = newStatus.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("status must be OPEN, IN_PROGRESS, or RESOLVED");
        }

        int updated = repository.updateStatus(complaintId, normalizedStatus);
        if (updated == 0) {
            throw new ResourceNotFoundException("Complaint not found: " + complaintId);
        }

        return getComplaint(complaintId);
    }

    public List<HistoryResponse> getHistory(Integer complaintId) {
        getComplaint(complaintId);
        return repository.findHistory(complaintId);
    }

    public List<IdNameResponse> getCitizens() {
        return repository.findCitizens();
    }

    public List<IdNameResponse> getCategories() {
        return repository.findCategories();
    }

    public List<IdNameResponse> getOfficers() {
        return repository.findOfficers();
    }
}
