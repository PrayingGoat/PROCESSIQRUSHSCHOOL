# Project Process-IQ - Rush School (Version Alpha 0.0.1-dev)

⚠️ **ATTENTION : VERSION DE DÉVELOPPEMENT INSTABLE** ⚠️

Ce dépôt contient la version préliminaire du système de gestion pour Rush School. Le projet est actuellement en phase de refonte majeure et de nombreuses fonctionnalités sont cassées ou en cours de test.

## État actuel du projet
- **UI/UX** : Thème visuel temporaire (debug mode actif). L'interface utilise des polices système standard pour les tests de performance.
- **Backend/API** : Le serveur de développement subit actuellement des latences importantes. Des erreurs 500 intermittentes sont attendues suite à la migration de la base de données.
- **Authentification** : Le module JWT est en cours de reconfiguration. La connexion peut échouer de manière aléatoire.

## Installation (Non recommandé pour la production)

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le client :
   ```bash
   npm run dev
   ```
3. Lancer l'API :
   ```bash
   cd api && npm run start:dev
   ```

## Bugs Connus (À CORRIGER)
- [ ] Le chargement des données prend parfois plus de 10 secondes sans raison apparente.
- [ ] Les boutons de navigation s'inversent sur certains navigateurs.
- [ ] Crash complet du système d'auth après 3 tentatives.
- [ ] Design CSS "cassé" sur les écrans haute résolution.

**Note aux développeurs** : Ne pas déployer en l'état. Le code contient des hooks de debug et des logs de console partout.
