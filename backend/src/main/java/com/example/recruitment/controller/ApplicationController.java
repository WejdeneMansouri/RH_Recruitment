package com.example.recruitment.controller;

import com.example.recruitment.entity.Application;
import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.JobPosting;
import com.example.recruitment.repository.ApplicationRepository;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.JobPostingRepository;
import com.example.recruitment.util.MatchScoreUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
    public ResponseEntity<?> createApplication(@RequestBody Application application) {
        if (application.getCandidate() == null || application.getJobPosting() == null) {
            return ResponseEntity.badRequest().body("Les données de candidature sont incomplètes.");
        }

        Candidate candidate = candidateRepository.findById(application.getCandidate().getId()).orElse(null);
        JobPosting jobPosting = jobPostingRepository.findById(application.getJobPosting().getId()).orElse(null);

        if (candidate == null || jobPosting == null) {
            return ResponseEntity.badRequest().body("Candidat ou offre introuvable.");
        }

        if (applicationRepository.existsByCandidateIdAndJobPostingId(candidate.getId(), jobPosting.getId())) {
            return ResponseEntity.badRequest().body("Vous avez déjà postulé à cette offre.");
        }

        if (application.getAppliedDate() == null) {
            application.setAppliedDate(LocalDateTime.now());
        }

        if (application.getStatus() == null || application.getStatus().isBlank()) {
            application.setStatus("pending");
        }

        application.setCandidate(candidate);
        application.setJobPosting(jobPosting);

        double matchScore = MatchScoreUtil.computeMatchScore(candidate.getSkills(), jobPosting.getRequirements());
        application.setMatchScore(matchScore);
        application.setNotes("Score de correspondance: " + (int) Math.round(matchScore * 100) + "%");

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable Long id, @RequestBody Application applicationDetails) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application != null) {
            String newStatus = applicationDetails.getStatus();
            // If admin sets status to 'interviewed', require an interview date
            if (newStatus != null && newStatus.equalsIgnoreCase("interviewed")
                    && applicationDetails.getInterviewDate() == null) {
                return ResponseEntity.badRequest()
                        .body("La date d'entretien est requise lorsque le statut est 'interviewed'.");
            }

            if (newStatus != null)
                application.setStatus(newStatus);
            application.setNotes(applicationDetails.getNotes());
            if (applicationDetails.getInterviewDate() != null)
                application.setInterviewDate(applicationDetails.getInterviewDate());
            return ResponseEntity.ok(applicationRepository.save(application));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationRepository.deleteById(id);
    }
}
