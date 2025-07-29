# Todo API DevOps Project

## Description
Ce projet est une API REST simple pour gérer des tâches en Node.js avec Express et Sequelize pour la base de données Postgres. Il implémente un CRUD basique pour les tâches. Le projet est dockerisé pour une reproductibilité facile, en suivant les principes DevOps vus en cours.

- **Technologies** : Node.js, Express, Sequelize, Postgres, Docker, Docker Compose.
- **Modèle de données (Task)** :
    - `id`: UUID (généré automatiquement)
    - `title`: String (requis)
    - `description`: String (optionnel)
    - `status`: String (défaut: 'pending')
    - `createdAt`: Timestamp
    - `updatedAt`: Timestamp

## Prérequis
- Node.js v18+
- Docker et Docker Compose
- Git

## Installation
1. Clone le dépôt :
   ```
   git clone https://github.com/ton-username/todo-api-devops.git
   cd todo-api-devops
   ```

2. Construis et lance les conteneurs :
   ```
   docker compose build
   docker compose up
   ```
   
3. L'API est accessible sur `http://localhost:3000`.

4. Arrête : `docker compose down`.


## Endpoints API
- **GET /health** : Vérifie si l'API est active..
- **POST /tasks** : Crée une tâche.
- **GET /tasks** : Liste toutes les tâches.
- **GET /tasks/:id** : Récupère une tâche.
- **PUT /tasks/:id** : Met à jour une tâche.
- **DELETE /tasks/:id** : Supprime une tâche.



## Gestion Agile
Ce projet utilise un [Kanban sur GitHub](https://github.com/users/Tutez64/projects/1) pour gérer les tâches.


## Bonnes Pratiques
- Dockerfile multi-stage pour optimiser.
- Volumes pour persistance DB.
- Healthcheck dans docker-compose pour synchronisation.
