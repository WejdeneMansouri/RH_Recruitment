package com.example.recruitment.controller;

import com.example.recruitment.entity.Candidate;
import com.example.recruitment.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "http://localhost:3000")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

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