# LMNP-Serenity

Application de gestion locative professionnelle pour propriétaires de mobil-homes en LMNP (Loueur en Meublé Non Professionnel).

## Vue d'ensemble

LMNP-Serenity est une application web complète conçue pour automatiser et professionnaliser la gestion à distance des mobil-homes en location meublée. L'application intègre des fonctionnalités de PMS (Property Management System) et de Channel Manager pour offrir une solution tout-en-un aux propriétaires.

## Fonctionnalités Principales

### 1. Tableau de Bord Centralisé
- Vue d'ensemble des métriques clés (revenus, taux d'occupation, prix moyen)
- Indicateurs financiers en temps réel
- Actions rapides pour les tâches courantes

### 2. Gestion des Réservations
- Suivi complet des réservations multi-plateformes
- Détails des locataires et communications
- Automatisation des confirmations et instructions d'arrivée
- Calcul automatique des revenus nets après commissions

### 3. Channel Manager
- Synchronisation omnicanal avec Airbnb, Booking.com, Vrbo
- Prévention des doubles réservations (surbooking)
- Mise à jour automatique des disponibilités
- Gestion centralisée des tarifs

### 4. Gestion des Cautions
- Suivi des dépôts de garantie
- Enregistrement des réceptions et remboursements
- Gestion des déductions avec justificatifs
- Alertes pour les cautions en attente

### 5. Tâches Opérationnelles
- Planification des ménages et maintenances
- Attribution aux partenaires locaux
- Suivi de l'état d'avancement
- États des lieux d'entrée/sortie

### 6. Inventaire Digital
- Gestion complète de l'inventaire par catégorie
- États des lieux numériques
- Signature électronique
- Historique des vérifications

### 7. Suivi Fiscal LMNP
- Enregistrement des charges déductibles
- Catégorisation automatique pour BIC
- Aide à la déclaration Régime Réel Simplifié
- Export des rapports fiscaux

## Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Gestion des dates**: date-fns
- **Icons**: Lucide React

## Structure du Projet

```
src/
├── app/                      # Routes Next.js App Router
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Page d'accueil avec navigation
├── components/              # Composants React
│   ├── ui/                  # Composants UI réutilisables
│   ├── dashboard/           # Dashboard et métriques
│   ├── reservations/        # Gestion des réservations
│   ├── deposits/            # Gestion des cautions
│   ├── tasks/               # Tâches opérationnelles
│   ├── inventory/           # Inventaire et états des lieux
│   ├── expenses/            # Suivi fiscal
│   └── channel-manager/     # Synchronisation multi-plateformes
├── lib/                     # Utilitaires et logique métier
│   ├── utils.ts            # Fonctions utilitaires
│   ├── mock-data.ts        # Données de démonstration
│   ├── calculations.ts     # Calculs financiers et statistiques
│   └── channel-manager.ts  # Simulation Channel Manager
└── types/                   # Définitions TypeScript
    └── index.ts            # Types de données
```

## Modèles de Données

### Entités Principales
- **MobileHome**: Informations sur le mobil-home
- **Reservation**: Réservations et séjours
- **Tenant**: Informations locataires
- **OperationalTask**: Tâches terrain (ménage, maintenance)
- **InventoryItem**: Articles d'inventaire
- **Expense**: Charges et dépenses déductibles
- **ChannelCalendar**: Disponibilités synchronisées

## Installation et Lancement

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Build de production
npm run build

# Démarrage production
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités Clés par Module

### Dashboard
- Revenu net total et nombre de réservations
- Taux d'occupation annuel
- Prix moyen par nuit
- Prochaines arrivées (30 jours)
- Situation financière détaillée
- Alertes et conseils fiscaux

### Channel Manager
- Simulation de synchronisation avec 3 plateformes principales
- Blocage/déblocage de dates
- Mise à jour des tarifs
- Import des réservations
- Détection des conflits

### Fiscalité LMNP
- 9 catégories de charges déductibles
- Distinction charges déductibles/non-déductibles
- Rapports pour déclaration BIC
- Conseils pour optimisation fiscale

## Roadmap Future

- [ ] Intégration API réelles Airbnb, Booking.com
- [ ] Système de paiement en ligne
- [ ] Génération automatique de documents (contrats, reçus)
- [ ] Application mobile native
- [ ] Multi-propriétés
- [ ] Tableau de bord analytique avancé
- [ ] Intégration comptable

## Licence

Propriétaire - Tous droits réservés

## Support

Pour toute question ou suggestion, contactez l'équipe de développement.

---

**Version**: 1.0.0
**Date de création**: Octobre 2025
**Statut**: Version fonctionnelle initiale
