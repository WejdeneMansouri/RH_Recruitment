package com.example.recruitment.controller;

import com.example.recruitment.entity.JobPosting;
import com.example.recruitment.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
@CrossOrigin(origins = "http://localhost:3000")
public class JobPostingController {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @GetMapping
    public List<JobPosting> getAllJobPostings() {
        return jobPostingRepository.findAll();
    }

    @GetMapping("/open")
    public List<JobPosting> getOpenJobPostings() {
        return jobPostingRepository.findByStatus("Open");
    }

    @PostMapping
    public ResponseEntity<?> createJobPosting(@RequestBody JobPosting jobPosting) {
        if (jobPosting.getDeadline() == null) {
            return ResponseEntity.badRequest().body("La date limite de candidature est obligatoire.");
        }
        if (jobPosting.getCreatedAt() == null) {
            jobPosting.setCreatedAt(LocalDateTime.now());
        }
        return ResponseEntity.ok(jobPostingRepository.save(jobPosting));
    }

    @GetMapping("/{id}")
    public JobPosting getJobPostingById(@PathVariable Long id) {
        return jobPostingRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobPosting(@PathVariable Long id, @RequestBody JobPosting jobPostingDetails) {
        JobPosting jobPosting = jobPostingRepository.findById(id).orElse(null);
        if (jobPosting != null) {
            jobPosting.setTitle(jobPostingDetails.getTitle());
            jobPosting.setDescription(jobPostingDetails.getDescription());
            jobPosting.setRequirements(jobPostingDetails.getRequirements());
            jobPosting.setStatus(jobPostingDetails.getStatus());
            jobPosting.setDeadline(jobPostingDetails.getDeadline());
            return ResponseEntity.ok(jobPostingRepository.save(jobPosting));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deleteJobPosting(@PathVariable Long id) {
        jobPostingRepository.deleteById(id);
    }
}