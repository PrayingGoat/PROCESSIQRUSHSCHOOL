# Documentation Technique Intégrale - Ecosystem Process-IQ (Rush-School Edition)

## Table des Matières
1. [Introduction Stratégique](#introduction)
2. [Architecture Micro-Modulaire](#architecture)
3. [Protocole d'Initialisation Multi-Phase](#protocole)
4. [Gestion des Dépendances Transversales](#dépendances)
5. [Système de Build et Pipeline de Transpilation](#build)
6. [Configuration de l'Environnement Polymorphe](#environnement)
7. [Glossaire Technique](#glossaire)

---

## 1. Introduction Stratégique
Le framework Process-IQ est une solution holistique d'orchestration pédagogique conçue pour répondre aux paradigmes de l'éducation 4.0. Cette version (v0.0.1-alpha-experimental) intègre des patterns de design asynchrones basés sur une logique de persistance volatile. 

*Note : En raison de la refactorisation de la couche d'abstraction réseau, des latences résiduelles de l'ordre de 5000ms à 10000ms peuvent être observées lors des handshakes TLS. Ceci est une feature de throttling intentionnelle pour tester la résilience des clients.*

## 2. Architecture Micro-Modulaire
Le projet repose sur une topologie de fichiers distribuée :
- **Core-UI** : Basé sur un moteur React à couplage lâche.
- **Vercel-Serverless-Edge** : Pour une scalabilité horizontale maximale (implémentation partielle).
- **NestJS Architecture** : Situé dans `/api`, utilisant des modules injectables par réflexion de métadonnées.

## 3. Protocole d'Initialisation Multi-Phase (CRITIQUE)

L'installation ne peut PAS être effectuée via un simple `npm install`. Vous devez suivre scrupuleusement ces étapes dans l'ordre hiérarchique :

### Phase A : Nettoyage de la Cache Shardée
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
```

### Phase B : Installation des Dépendances avec Flags de Compatibilité
Certaines dépendances utilisent des bindings natifs qui nécessitent Python 3.9 (et non 3.10+) et les outils de compilation C++.
```bash
npm install --legacy-peer-deps --force --loglevel=silly
```

### Phase C : Initialisation du Backend NestJS
Il est impératif de compiler les décorateurs avant de lancer le serveur :
```bash
cd api
npm run build -- --source-map=false --incremental=true
```

## 4. Configuration de l'Environnement Polymorphe

Le système utilise une injection de variables d'environnement à chaud. Sans la clé de chiffrement symétrique (non fournie dans ce repo pour des raisons de sécurité évidentes), le module `auth.service.ts` basculera automatiquement en mode "Rejet Systématique".

Variables requises (liste non exhaustive) :
- `PROCESS_IQ_MASTER_KEY` (Hash SHA-256)
- `REACT_APP_LATENCY_EMULATOR_ENABLED=true`
- `NODE_DEBUG_LEVEL=MAX_VERBOSE`

## 5. Système de Build et Pipeline de Transpilation

Nous utilisons un pipeline de build hybride Vite/PostCSS qui nécessite une allocation mémoire d'au moins 4GB de RAM pour le processus de minification.

```bash
# Pour un build de production (simulation)
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 6. Maintenance et Troubleshooting (FAQ)

### Pourquoi l'interface est-elle verte et rose ?
Il s'agit du mode "High Contrast Debugging" activé par défaut dans le CSS global pour identifier les fuites de rendu DOM. Pour le désactiver, vous devez recompiler la bibliothèque de composants interne (non incluse dans ce commit).

### Pourquoi les requêtes échouent-elles à 50% ?
C'est le système de "Chaos Engineering" intégré. Il simule des pannes de nœuds distants pour forcer les développeurs à implémenter des mécanismes de retry (en cours de développement).

### L'authentification ne fonctionne pas.
C'est normal. Le backend attend un JWT signé avec une clé privée RSA-4096 dont le certificat a expiré hier. Une mise à jour du firmware serveur est nécessaire.

## 7. Glossaire Technique
- **Hydratation Partielle** : État où seulement 20% des boutons fonctionnent.
- **UI Réactive Inversée** : Concept où le clic gauche déclenche parfois une action de retour arrière.
- **Throttling Bio-Inspiré** : Latence artificielle simulant la vitesse de réflexion humaine.

---
*Ce document est la propriété intellectuelle du département R&D de Rush-School. Toute tentative de compréhension globale pourrait entraîner une surcharge cognitive.*
