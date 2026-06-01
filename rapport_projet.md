# Rapport du projet RH_Recruitment

## 1. Introduction
Le projet est une application de gestion du recrutement, destinée à centraliser les offres, les candidats et les candidatures.

- Backend : Spring Boot (Java, JPA, MySQL)
- Frontend : Next.js (React, TypeScript, Tailwind CSS)
- Base de données : MySQL

## 2. Objectifs du projet
1. Permettre la création, l'affichage, la mise à jour et la suppression des offres d'emploi.
2. Gérer les profils candidats et les candidatures.
3. Proposer un mécanisme d'analyse de CV pour améliorer le tri des candidats.
4. Offrir un tableau de bord RH pour suivre les indicateurs clés.

## 3. Fonctionnalités principales
- Gestion des offres d'emploi
- Gestion des candidats
- Gestion des candidatures
- Téléchargement et stockage des CV candidats
- Filtrage intelligent des candidatures
- Téléchargement des CV depuis l'interface

## 4. Analyse de CV (IA)
L'analyse de CV est intégrée dans le projet comme un module intelligent de filtrage.

### 4.1 Flux de traitement
1. Le candidat télécharge son CV via l'API backend.
2. Le CV est enregistré dans le dossier `uploads/resumes`.
3. Le chemin du CV est stocké dans l'entité `Candidate`.
4. Lorsqu'une candidature est créée ou qu'un candidat recherche des offres, le backend extrait les termes clés du profil.
5. Le système compare ensuite ces termes aux exigences de l'offre pour calculer un score de correspondance.

### 4.2 Méthode utilisée
Le projet utilise une approche IA légère basée sur l'extraction de mots-clés :
- extraction des compétences déclarées par le candidat (`skills`)
- extraction des termes du CV (à partir du texte si le fichier est un `.txt`, sinon à partir du nom du fichier)
- extraction des exigences de l'offre (`requirements`)
- calcul d'un score de match entre les ensembles de termes

### 4.3 Résultat de l'analyse
Le score de correspondance est un nombre entre 0 et 1.
- 0 signifie qu'aucun terme requis n'a été trouvé.
- 1 signifie que tous les termes requis sont présents.

Ce score est utilisé pour trier et proposer les meilleures offres aux candidats et pour aider les recruteurs à filtrer les candidatures.

## 5. Architecture technique

### 5.1 Backend
- `CandidateController` : gestion des candidats, upload de CV, téléchargement de CV, détection de correspondances.
- `ApplicationController` : gestion des candidatures et calcul du score de matching.
- `JobPostingRepository` : accès aux offres ouvertes.
- `CandidateRepository` : accès aux données des candidats.
- `ApplicationRepository` : accès aux candidatures.

### 5.2 Frontend
- Next.js avec des pages pour la gestion des offres, candidats et candidatures.
- Interfaces RH et candidats séparées.

## 6. API clés
### Candidats
- `GET /api/candidates` : liste des candidats
- `POST /api/candidates` : création d'un candidat
- `PUT /api/candidates/{id}` : mise à jour d'un candidat
- `POST /api/candidates/{id}/resume` : upload du CV
- `GET /api/candidates/{id}/resume/download` : téléchargement du CV
- `GET /api/candidates/{id}/matches` : liste des offres correspondant au candidat

### Candidatures
- `GET /api/applications` : liste des candidatures
- `POST /api/applications` : création d'une candidature et calcul du score de correspondance
- `PUT /api/applications/{id}` : mise à jour du statut
- `DELETE /api/applications/{id}` : suppression d'une candidature

## 7. Améliorations possibles
- Intégrer un vrai moteur NLP (modèle de type BERT, spaCy ou service IA comme OpenAI) pour l’analyse sémantique des CV.
- Extraire automatiquement les expériences, formations, postes et dates depuis les CV.
- Gérer les formats PDF et Word avec conversion en texte.
- Ajouter un apprentissage automatique pour affiner le score de matching.

## 8. Conclusion
Ce projet présente un système de recrutement complet avec une analyse de CV présentée comme une fonctionnalité IA. Le module d'analyse utilise aujourd'hui un filtrage intelligent basé sur la comparaison de mots-clés entre le profil candidat et les exigences des offres.

---

*Rapport généré pour le projet RH_Recruitment.*
