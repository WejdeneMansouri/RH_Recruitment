# 🔐 Identifiants de Connexion

## Page d'Accueil
L'application redirige automatiquement vers : **http://localhost:3000/auth**

---

## 👤 Candidat

- **URL de connexion** : http://localhost:3000/candidate/login
-VALUES ('Moez Dev', 'moez@email.com', '+21612345678', 'Tunis', 'Java, Spring Boot, React', 2, CURRENT_TIMESTAMP);


**Fonctionnalités** :
- Consulter les offres d'emploi ouvertes
- Postuler aux offres
- Suivre ses candidatures
- Voir le score de correspondance (filtrage IA)

---

## ⚙️ Admin (HR)

- **URL de connexion** : http://localhost:3000/admin/login
 ('Equipe RH', 'rh@entreprise.com', 'password123', 'HR', CURRENT_TIMESTAMP);


**Fonctionnalités** :
- Accès au Dashboard
- Gérer les offres d'emploi (créer, modifier, supprimer)
- Consulter la liste des candidats
- Gestion des candidatures avec score filtrage IA
- Rapports et analytics

---

## 📊 Offres d'Emploi Pré-chargées

VALUES ('Développeur Java', 'Poste en CDI à Tunis', 'Java 17, Spring', 'Open', 1, CURRENT_TIMESTAMP);

---

## 🚀 Démarrage de l'Application

### Backend
```bash
cd backend
mvn spring-boot:run
# L'application démarre sur http://localhost:8082
```

### Frontend
```bash
cd frontend
npm run dev
# L'application démarre sur http://localhost:3000
```

### Base de Données
- Type : H2 (base de données embarquée)
- Console H2 : http://localhost:8082/h2-console
- Les comptes et offres sont créés automatiquement au démarrage

---

## 📝 Notes

- Les données sont créées automatiquement au démarrage du backend
- La base de données H2 est recréée à chaque redémarrage (`ddl-auto=create-drop`)
- Pour tester le filtrage IA, le candidat Jean Candidat a les compétences : Java, React, SQL, Docker, Git
  - L'offre "Développeur Full Stack" (Java, React, SQL, Git) aura un score très élevé
  - Les autres offres auront un score plus faible
