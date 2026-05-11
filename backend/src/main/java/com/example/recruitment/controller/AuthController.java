package com.example.recruitment.controller;

import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.User;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.recruitment.util.PasswordUtil;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin removed - handled globally by SecurityConfig.java
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null || !(PasswordUtil.verifyPassword(request.getPassword(), user.getPassword())
                || request.getPassword().equals(user.getPassword()))) {
            // Returning 401 is more accurate for login failure
            return ResponseEntity.status(401).build();
        }

        Long candidateId = null;
        if ("Candidate".equalsIgnoreCase(user.getRole())) {
            Candidate candidate = candidateRepository.findByEmail(user.getEmail());
            if (candidate != null) {
                candidateId = candidate.getId();
            }
        }

        LoginResponse response = new LoginResponse(user.getId(), user.getEmail(), user.getName(), user.getRole(),
                candidateId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Un utilisateur avec cet email existe déjà.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(PasswordUtil.hashPassword(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole() != null ? request.getRole() : "Candidate");
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(user.getRole());
        userRepository.save(user);

        if ("Candidate".equalsIgnoreCase(user.getRole())) {
            Candidate candidate = new Candidate();
            candidate.setName(request.getName());
            candidate.setEmail(request.getEmail());
            candidate.setPhone(request.getPhone());
            candidate.setAddress(request.getAddress());
            candidate.setSkills(request.getSkills());
            candidate.setExperienceYears(request.getExperienceYears());
            candidate.setCreatedAt(LocalDateTime.now());
            candidateRepository.save(candidate);
        }

        return ResponseEntity.ok().build();
    }

    // --- Data Transfer Objects (DTOs) ---

    public static class LoginRequest {
        private String email;
        private String password;

        // Default constructor required for JSON mapping
        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String name;
        private String role;
        private String phone;
        private String address;
        private String skills;
        private Integer experienceYears;

        // Default constructor required for JSON mapping
        public RegisterRequest() {
        }

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getSkills() {
            return skills;
        }

        public void setSkills(String skills) {
            this.skills = skills;
        }

        public Integer getExperienceYears() {
            return experienceYears;
        }

        public void setExperienceYears(Integer experienceYears) {
            this.experienceYears = experienceYears;
        }
    }

    public static class LoginResponse {
        private Long userId;
        private String email;
        private String name;
        private String role;
        private Long candidateId;

        // Default constructor required for JSON mapping
        public LoginResponse() {
        }

        public LoginResponse(Long userId, String email, String name, String role, Long candidateId) {
            this.userId = userId;
            this.email = email;
            this.name = name;
            this.role = role;
            this.candidateId = candidateId;
        }

        public Long getUserId() {
            return userId;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }

        public String getRole() {
            return role;
        }

        public Long getCandidateId() {
            return candidateId;
        }
    }
}