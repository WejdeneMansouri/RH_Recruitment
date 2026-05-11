package com.example.recruitment.controller;

import com.example.recruitment.entity.Application;
import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.JobPosting;
import com.example.recruitment.repository.ApplicationRepository;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/candidate/{candidateId}")
    public List<Application> getApplicationsByCandidate(@PathVariable Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    @PostMapping
    public Application createApplication(@RequestBody Application application) {
        if (application.getAppliedDate() == null) {
            application.setAppliedDate(LocalDateTime.now());
        }

        if (application.getStatus() == null || application.getStatus().isBlank()) {
            application.setStatus("pending");
        }

        if (application.getCandidate() == null || application.getJobPosting() == null) {
            return null;
        }

        Candidate candidate = candidateRepository.findById(application.getCandidate().getId()).orElse(null);
        JobPosting jobPosting = jobPostingRepository.findById(application.getJobPosting().getId()).orElse(null);

        if (candidate == null || jobPosting == null) {
            return null;
        }

        application.setCandidate(candidate);
        application.setJobPosting(jobPosting);

        double matchScore = computeMatchScore(candidate.getSkills(), jobPosting.getRequirements());
        application.setMatchScore(matchScore);
        application.setNotes("Score de correspondance: " + (int) Math.round(matchScore * 100) + "%");

        return applicationRepository.save(application);
    }

    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Application updateApplication(@PathVariable Long id, @RequestBody Application applicationDetails) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application != null) {
            application.setStatus(applicationDetails.getStatus());
            application.setNotes(applicationDetails.getNotes());
            return applicationRepository.save(application);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationRepository.deleteById(id);
    }

    private double computeMatchScore(String skills, String requirements) {
        if (skills == null || skills.isBlank() || requirements == null || requirements.isBlank()) {
            return 0.0;
        }

        Set<String> candidateSkills = Arrays.stream(skills.split("[,;\\n]+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        Set<String> requiredTerms = Arrays.stream(requirements.split("[,;\\n]+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        if (requiredTerms.isEmpty()) {
            return 0.0;
        }

        long matches = candidateSkills.stream().filter(requiredTerms::contains).count();
        return Math.min(1.0, (double) matches / requiredTerms.size());
    }
}