package com.example.recruitment.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitaire pour le hashage des mots de passe
 */
public class PasswordUtil {

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * Hash un mot de passe en clair
     * 
     * @param plainPassword le mot de passe en clair
     * @return le mot de passe hashé
     */
    public static String hashPassword(String plainPassword) {
        return encoder.encode(plainPassword);
    }

    /**
     * Vérifie si un mot de passe en clair correspond à un hash
     * 
     * @param plainPassword  le mot de passe en clair
     * @param hashedPassword le mot de passe hashé
     * @return true si les mots de passe correspondent
     */
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        return encoder.matches(plainPassword, hashedPassword);
    }

    /**
     * Méthode principale pour tester le hashage
     * Utilisez cette méthode pour générer des hashes de mots de passe
     */
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Usage: java com.example.recruitment.util.PasswordUtil <mot_de_passe>");
            System.out.println("Exemple: java com.example.recruitment.util.PasswordUtil Admin123");
            return;
        }

        String password = args[0];
        String hashedPassword = hashPassword(password);

        System.out.println("Mot de passe original: " + password);
        System.out.println("Mot de passe hashé: " + hashedPassword);
    }
}