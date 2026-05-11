package com.example.recruitment.repository;

import com.example.recruitment.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Candidate findByEmail(String email);
}