package com.example.recruitment.controller;

import com.example.recruitment.dto.ReportDto;
import com.example.recruitment.dto.ReportDto.MonthCount;
import com.example.recruitment.dto.ReportDto.SkillCount;
import com.example.recruitment.entity.Application;
import com.example.recruitment.entity.Candidate;
import com.example.recruitment.entity.JobPosting;
import com.example.recruitment.repository.ApplicationRepository;
import com.example.recruitment.repository.CandidateRepository;
import com.example.recruitment.repository.JobPostingRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ReportController {

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final JobPostingRepository jobPostingRepository;

    public ReportController(ApplicationRepository applicationRepository,
            CandidateRepository candidateRepository,
            JobPostingRepository jobPostingRepository) {
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    @GetMapping("/reports")
    public ReportDto getReports() {
        List<Application> applications = applicationRepository.findAll();
        List<Candidate> candidates = candidateRepository.findAll();
        List<JobPosting> jobPostings = jobPostingRepository.findAll();

        ReportDto report = new ReportDto();
        report.setTotalApplications(applications.size());
        report.setTotalCandidates(candidates.size());
        report.setTotalJobPostings(jobPostings.size());

        Map<String, Integer> statusCounts = new HashMap<>();
        for (Application application : applications) {
            String status = application.getStatus() == null ? "unknown" : application.getStatus();
            statusCounts.put(status, statusCounts.getOrDefault(status, 0) + 1);
        }
        report.setApplicationsByStatus(statusCounts);

        Map<String, Integer> monthCounts = new HashMap<>();
        for (Application application : applications) {
            if (application.getAppliedDate() != null) {
                String month = application.getAppliedDate()
                        .getMonth()
                        .getDisplayName(TextStyle.SHORT, Locale.FRENCH);
                monthCounts.put(month, monthCounts.getOrDefault(month, 0) + 1);
            }
        }
        List<MonthCount> applicationsByMonth = monthCounts.entrySet()
                .stream()
                .map(entry -> new MonthCount(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(MonthCount::getMonth))
                .collect(Collectors.toList());
        report.setApplicationsByMonth(applicationsByMonth);

        Map<String, Integer> skillCounts = new HashMap<>();
        for (Candidate candidate : candidates) {
            if (candidate.getSkills() == null || candidate.getSkills().isBlank()) {
                continue;
            }
            String[] skills = candidate.getSkills().split(",");
            for (String skill : skills) {
                String normalized = skill.trim();
                if (!normalized.isEmpty()) {
                    skillCounts.put(normalized, skillCounts.getOrDefault(normalized, 0) + 1);
                }
            }
        }
        List<SkillCount> topSkills = skillCounts.entrySet()
                .stream()
                .map(entry -> new SkillCount(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(SkillCount::getCount).reversed())
                .limit(5)
                .collect(Collectors.toList());
        report.setTopSkills(topSkills);

        return report;
    }
}
