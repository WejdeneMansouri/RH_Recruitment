package com.example.recruitment.controller;

import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.User;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.recruitment.util.PasswordUtil;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    @PostMapping(value = "/register-with-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerWithCv(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("name") String name,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "skills", required = false) String skills,
            @RequestParam(value = "experienceYears", required = false) Integer experienceYears,
            @RequestPart("resume") MultipartFile resume
    ) {
        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity.badRequest().body("Un utilisateur avec cet email existe déjà.");
        }

        if (resume == null || resume.isEmpty()) {
            return ResponseEntity.badRequest().body("Le CV est obligatoire.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(PasswordUtil.hashPassword(password));
        user.setName(name);
        user.setRole(role != null ? role : "Candidate");
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        if ("Candidate".equalsIgnoreCase(user.getRole())) {
            Candidate candidate = new Candidate();
            candidate.setName(name);
            candidate.setEmail(email);
            candidate.setPhone(phone);
            candidate.setAddress(address);
            candidate.setSkills(skills);
            candidate.setExperienceYears(experienceYears);
            candidate.setCreatedAt(LocalDateTime.now());
            candidate.setResumePath(saveResumeFile(resume, email));
            candidateRepository.save(candidate);
        }

        return ResponseEntity.ok().build();
    }

    private String saveResumeFile(MultipartFile resume, String userEmail) {
        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "resumes";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            String originalFilename = resume.getOriginalFilename() != null ? resume.getOriginalFilename() : "resume";
            String safeName = userEmail.replaceAll("[^a-zA-Z0-9.-]", "_");
            String filename = safeName + "_" + System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(resume.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Impossible de sauvegarder le CV", e);
        }
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