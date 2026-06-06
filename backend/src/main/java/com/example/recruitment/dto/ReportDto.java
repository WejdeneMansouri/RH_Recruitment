package com.example.recruitment.dto;

import java.util.List;
import java.util.Map;

public class ReportDto {
    private int totalApplications;
    private int totalJobPostings;
    private int totalCandidates;
    private Map<String, Integer> applicationsByStatus;
    private List<MonthCount> applicationsByMonth;
    private List<SkillCount> topSkills;

    public int getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(int totalApplications) {
        this.totalApplications = totalApplications;
    }

    public int getTotalJobPostings() {
        return totalJobPostings;
    }

    public void setTotalJobPostings(int totalJobPostings) {
        this.totalJobPostings = totalJobPostings;
    }

    public int getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(int totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public Map<String, Integer> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Integer> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }

    public List<MonthCount> getApplicationsByMonth() {
        return applicationsByMonth;
    }

    public void setApplicationsByMonth(List<MonthCount> applicationsByMonth) {
        this.applicationsByMonth = applicationsByMonth;
    }

    public List<SkillCount> getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(List<SkillCount> topSkills) {
        this.topSkills = topSkills;
    }

    public static class MonthCount {
        private String month;
        private int count;

        public MonthCount() {
        }

        public MonthCount(String month, int count) {
            this.month = month;
            this.count = count;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    public static class SkillCount {
        private String skill;
        private int count;

        public SkillCount() {
        }

        public SkillCount(String skill, int count) {
            this.skill = skill;
            this.count = count;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }
}
