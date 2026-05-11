package com.example.recruitment.config;

import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.JobPosting;
import com.example.recruitment.entity.User;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.JobPostingRepository;
import com.example.recruitment.repository.UserRepository;
import com.example.recruitment.util.PasswordUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// Initialisation des données via Java plutôt que par script SQL
@Component 
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @PostConstruct
    @Transactional
    public void initData() {
        // Ce code ne s'exécutera plus car la classe n'est plus un composant Spring
        if (userRepository.count() > 0) {
            return;
        }

        User candidateUser = new User();
        candidateUser.setEmail("candidate@example.com");
        candidateUser.setPassword(PasswordUtil.hashPassword("Candidate123"));
        candidateUser.setName("Jean Candidat");
        candidateUser.setRole("Candidate");
        candidateUser.setCreatedAt(LocalDateTime.now());
        userRepository.save(candidateUser);

        Candidate candidate = new Candidate();
        candidate.setName("Jean Candidat");
        candidate.setEmail("candidate@example.com");
        candidate.setPhone("+33612345678");
        candidate.setAddress("75001 Paris");
        candidate.setSkills("Java, React, SQL, Docker, Git");
        candidate.setExperienceYears(3);
        candidate.setCreatedAt(LocalDateTime.now());
        candidateRepository.save(candidate);

        User adminUser = new User();
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword(PasswordUtil.hashPassword("Admin123"));
        adminUser.setName("Admin User");
        adminUser.setRole("HR");
        adminUser.setCreatedAt(LocalDateTime.now());
        userRepository.save(adminUser);

        JobPosting job1 = new JobPosting();
        job1.setTitle("Développeur Full Stack");
        job1.setDescription("Nous recherchons un développeur Full Stack expérimenté avec React et Spring Boot.");
        job1.setRequirements("Java, React, SQL, Git");
        job1.setStatus("Open");
        job1.setCreatedBy(adminUser);
        job1.setCreatedAt(LocalDateTime.now());
        jobPostingRepository.save(job1);

        JobPosting job2 = new JobPosting();
        job2.setTitle("Data Scientist");
        job2.setDescription("Rejoignez notre équipe data pour des projets d'apprentissage automatique.");
        job2.setRequirements("Python, SQL, Machine Learning, Pandas");
        job2.setStatus("Open");
        job2.setCreatedBy(adminUser);
        job2.setCreatedAt(LocalDateTime.now());
        jobPostingRepository.save(job2);

        JobPosting job3 = new JobPosting();
        job3.setTitle("Chef de Projet");
        job3.setDescription("Management de projets informatiques en environnement Agile.");
        job3.setRequirements("Agile, Scrum, Jira, Leadership");
        job3.setStatus("Open");
        job3.setCreatedBy(adminUser);
        job3.setCreatedAt(LocalDateTime.now());
        jobPostingRepository.save(job3);
    }
}