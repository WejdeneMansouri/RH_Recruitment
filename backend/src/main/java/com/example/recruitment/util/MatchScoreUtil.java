package com.example.recruitment.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

public class MatchScoreUtil {

    public static Set<String> parseTerms(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptySet();
        }

        return Arrays.stream(text.split("[,;\\n]+"))
                .flatMap(part -> Arrays.stream(part.split("\\s+")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
    }

    public static double computeMatchScore(String skills, String requirements) {
        return computeMatchScore(parseTerms(skills), requirements);
    }

    public static double computeMatchScore(Set<String> candidateTerms, String requirements) {
        if (requirements == null || requirements.isBlank() || candidateTerms.isEmpty()) {
            return 0.0;
        }

        Set<String> requiredTerms = parseTerms(requirements);
        if (requiredTerms.isEmpty()) {
            return 0.0;
        }

        long matches = candidateTerms.stream()
                .filter(requiredTerms::contains)
                .count();
        return Math.min(1.0, (double) matches / requiredTerms.size());
    }
}
