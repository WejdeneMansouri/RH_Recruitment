package com.example.recruitment.controller;

import com.example.recruitment.entity.Application;
import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.JobPosting;
import com.example.recruitment.repository.ApplicationRepository;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.JobPostingRepository;
import com.example.recruitment.util.MatchScoreUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    @PostMapping
    public Candidate createCandidate(@RequestBody Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    @GetMapping("/{id}")
    public Candidate getCandidateById(@PathVariable Long id) {
        return candidateRepository.findById(id).orElse(null);
    }

    @PostMapping(value = "/{id}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(@PathVariable Long id, @RequestPart("resume") MultipartFile resume) {
        Candidate candidate = candidateRepository.findById(id).orElse(null);
        if (candidate == null) {
            return ResponseEntity.notFound().build();
        }
        if (resume == null || resume.isEmpty()) {
            return ResponseEntity.badRequest().body("Le fichier CV est manquant ou vide.");
        }

        try {
            candidate.setResumePath(saveResumeFile(resume, candidate.getEmail()));
            Candidate saved = candidateRepository.save(candidate);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Impossible de sauvegarder le CV : " + e.getMessage());
        }
    }

    @GetMapping("/{id}/resume/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        Candidate candidate = candidateRepository.findById(id).orElse(null);
        if (candidate == null || candidate.getResumePath() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path file = Paths.get(candidate.getResumePath());
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String filename = file.getFileName().toString();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/matches")
    public List<JobPosting> getMatchingJobPostings(@PathVariable Long id) {
        Candidate candidate = candidateRepository.findById(id).orElse(null);
        if (candidate == null) {
            return Collections.emptyList();
        }

        Set<String> candidateTerms = extractCandidateTerms(candidate);
        if (candidateTerms.isEmpty()) {
            return Collections.emptyList();
        }

        LocalDateTime now = LocalDateTime.now();
        List<JobPosting> openJobs = jobPostingRepository.findByStatus("Open");
        List<JobPosting> matches = new ArrayList<>();

        List<Application> applications = applicationRepository.findByCandidateId(id);
        Set<Long> appliedJobIds = applications.stream()
                .map(Application::getJobPosting)
                .filter(Objects::nonNull)
                .map(JobPosting::getId)
                .collect(Collectors.toSet());

        for (JobPosting job : openJobs) {
            if (job.getDeadline() != null && job.getDeadline().isBefore(now)) {
                continue;
            }
            if (appliedJobIds.contains(job.getId())) {
                continue;
            }
            double score = MatchScoreUtil.computeMatchScore(candidateTerms, job.getRequirements());
            if (score > 0) {
                job.setMatchScore(score);
                matches.add(job);
            }
        }

        matches.sort((a, b) -> Double.compare(b.getMatchScore() == null ? 0.0 : b.getMatchScore(),
                a.getMatchScore() == null ? 0.0 : a.getMatchScore()));

        return matches;
    }

    private String saveResumeFile(MultipartFile resume, String candidateEmail) {
        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "resumes";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            String originalFilename = resume.getOriginalFilename() != null ? resume.getOriginalFilename() : "resume";
            String safeName = candidateEmail != null ? candidateEmail.replaceAll("[^a-zA-Z0-9.-]", "_") : "candidate";
            String filename = safeName + "_" + System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(resume.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Impossible de sauvegarder le CV", e);
        }
    }

    private Set<String> extractCandidateTerms(Candidate candidate) {
        Set<String> keywords = new HashSet<>();
        keywords.addAll(parseTerms(candidate.getSkills()));

        if (candidate.getResumePath() != null) {
            String path = candidate.getResumePath();
            if (path.toLowerCase(Locale.ROOT).endsWith(".txt")) {
                try {
                    String content = Files.readString(Paths.get(path));
                    keywords.addAll(parseTerms(content));
                } catch (IOException ignore) {
                    // fallback to skills only
                }
            } else {
                String filename = Paths.get(path).getFileName().toString().replaceAll("[^a-zA-Z0-9 ]", " ");
                keywords.addAll(parseTerms(filename));
            }
        }

        return keywords;
    }

    private double computeMatchScore(Set<String> candidateTerms, String requirements) {
        return MatchScoreUtil.computeMatchScore(candidateTerms, requirements);
    }

    private Set<String> parseTerms(String text) {
        return MatchScoreUtil.parseTerms(text);
    }

    @PutMapping("/{id}")
    public Candidate updateCandidate(@PathVariable Long id, @RequestBody Candidate candidateDetails) {
        Candidate candidate = candidateRepository.findById(id).orElse(null);
        if (candidate != null) {
            candidate.setName(candidateDetails.getName());
            candidate.setEmail(candidateDetails.getEmail());
            candidate.setPhone(candidateDetails.getPhone());
            candidate.setAddress(candidateDetails.getAddress());
            candidate.setSkills(candidateDetails.getSkills());
            candidate.setExperienceYears(candidateDetails.getExperienceYears());
            return candidateRepository.save(candidate);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteCandidate(@PathVariable Long id) {
        candidateRepository.deleteById(id);
    }
}