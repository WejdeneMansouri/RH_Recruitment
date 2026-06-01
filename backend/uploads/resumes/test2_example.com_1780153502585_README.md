# Recruitment Management Application

A full-stack application for managing job applications and recruitment processes.

## Tech Stack
- Frontend: Next.js (React, TypeScript, Tailwind CSS)
- Backend: Spring Boot (Java, JPA, MySQL)
- Database: MySQL (via XAMPP)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Java 17
- Maven
- Docker

### Database
1. Install XAMPP from: https://www.apachefriends.org/
2. Start XAMPP and start the MySQL service
3. The database `recruitment_db` will be created automatically when the backend starts

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will run on http://localhost:8080

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:3000

## Features
- **Dashboard RH** : Vue d'ensemble avec KPIs et actions rapides
- **Gestion des Offres** : Création, modification et suppression d'offres d'emploi
- **Base de Candidats** : Gestion centralisée des profils candidats
- **Suivi des Candidatures** : Gestion du processus de recrutement par candidat
- **Rapports & Analytics** : Tableaux de bord avec statistiques détaillées
- **Filtrage IA** : Tri automatique des candidatures (à implémenter)
- **Communication** : Messagerie intégrée avec les candidats (à implémenter)

## Pages Frontend
- `/` - Page d'accueil avec présentation
- `/dashboard` - Tableau de bord principal
- `/dashboard/job-postings` - Gestion des offres d'emploi
- `/dashboard/job-postings/new` - Création d'une nouvelle offre
- `/dashboard/candidates` - Liste des candidats
- `/dashboard/applications` - Gestion des candidatures
- `/dashboard/reports` - Rapports et analyses

## API Endpoints
### Job Postings
- GET /api/job-postings - Liste des offres d'emploi
- POST /api/job-postings - Créer une offre
- GET /api/job-postings/{id} - Détails d'une offre
- PUT /api/job-postings/{id} - Modifier une offre
- DELETE /api/job-postings/{id} - Supprimer une offre

### Candidates
- GET /api/candidates - Liste des candidats
- POST /api/candidates - Créer un candidat
- GET /api/candidates/{id} - Détails d'un candidat
- PUT /api/candidates/{id} - Modifier un candidat
- DELETE /api/candidates/{id} - Supprimer un candidat

### Applications
- GET /api/applications - Liste des candidatures
- POST /api/applications - Créer une candidature
- GET /api/applications/{id} - Détails d'une candidature
- PUT /api/applications/{id} - Modifier une candidature
- DELETE /api/applications/{id} - Supprimer une candidature

## Database Schema
- users: User information
- job_postings: Job listings
- candidates: Candidate profiles
- applications: Job applications
- recruitment_steps: Steps in recruitment process
- communications: Messages to candidates"# RH_Recruitment" 
