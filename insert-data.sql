-- Script pour insérer manuellement les données de test
-- À exécuter dans la console H2 : http://localhost:8082/h2-console

-- Connexion H2 :
-- JDBC URL: jdbc:h2:mem:testdb
-- User: sa
-- Password: (vide)

-- Compte Candidat
INSERT INTO users (email, password, name, role, created_at)
VALUES ('candidate@example.com', '$2a$10$fJNfa3PfFCCc4eBcW5hQjuGcQJpm9TOovGcCadctu2IxnlMVQh7jy', 'Jean Candidat', 'Candidate', CURRENT_TIMESTAMP);

INSERT INTO candidates (name, email, phone, address, skills, experience_years, created_at)
VALUES ('Jean Candidat', 'candidate@example.com', '+33612345678', '75001 Paris', 'Java, React, SQL, Docker, Git', 3, CURRENT_TIMESTAMP);

-- Compte Admin
INSERT INTO users (email, password, name, role, created_at)
VALUES ('admin@example.com', '$2a$10$1/2n0GZudby6A0muqufUi.gs0/CN.VpkOXjf9lDUKWTb7ECoD20iK', 'Admin User', 'HR', CURRENT_TIMESTAMP);

-- Offres d'emploi d'exemple
INSERT INTO job_postings (title, description, requirements, status, created_by, created_at)
VALUES
  ('Développeur Full Stack', 'Nous recherchons un développeur Full Stack expérimenté avec React et Spring Boot.', 'Java, React, SQL, Git', 'Open', 2, CURRENT_TIMESTAMP),
  ('Data Scientist', 'Rejoignez notre équipe data pour des projets d\'apprentissage automatique.', 'Python, SQL, Machine Learning, Pandas', 'Open', 2, CURRENT_TIMESTAMP),
  ('Chef de Projet', 'Management de projets informatiques en environnement Agile.', 'Agile, Scrum, Jira, Leadership', 'Open', 2, CURRENT_TIMESTAMP);

-- Vérifier les données
SELECT 'Users:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Candidates:', COUNT(*) FROM candidates
UNION ALL
SELECT 'Job Postings:', COUNT(*) FROM job_postings;