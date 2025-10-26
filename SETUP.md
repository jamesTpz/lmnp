# LMNP-Serenity - Guide d'installation et de configuration

## Vue d'ensemble

LMNP-Serenity est une application complète de gestion locative pour propriétaires LMNP de mobil-homes, avec intégration de base de données PostgreSQL, authentification, génération de PDF, et paiements en ligne.

## Prérequis

- Node.js 18+ et npm/yarn
- PostgreSQL 14+
- Compte Stripe (pour les paiements)
- Accès Internet pour les intégrations API

## Installation

### 1. Cloner et installer les dépendances

```bash
npm install
```

### 2. Configuration de la base de données PostgreSQL

Créez une base de données PostgreSQL :

```bash
createdb lmnp_serenity
```

Ou via psql :

```sql
CREATE DATABASE lmnp_serenity;
```

### 3. Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifiez `.env` avec vos valeurs :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lmnp_serenity?schema=public"

# Authentication (générer une clé aléatoire de 32+ caractères)
SESSION_SECRET="your-secret-key-minimum-32-characters-long"

# Stripe (obtenir depuis https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialiser Prisma et la base de données

Générez le client Prisma :

```bash
npx prisma generate
```

Créez les tables dans la base de données :

```bash
npx prisma db push
```

Ou créez une migration :

```bash
npx prisma migrate dev --name init
```

### 5. (Optionnel) Seed data

Pour ajouter des données de test :

```bash
npx prisma db seed
```

### 6. Lancer l'application

Mode développement :

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Première utilisation

### Créer un compte

1. Accédez à http://localhost:3000
2. Vous serez redirigé vers `/login`
3. Cliquez sur "S'inscrire"
4. Remplissez le formulaire d'inscription
5. Vous serez automatiquement connecté et redirigé vers le tableau de bord

### Ajouter votre premier mobile home

1. Dans le tableau de bord, utilisez le bouton "Nouveau Mobile Home"
2. Remplissez les informations (nom, localisation, capacité, etc.)
3. Le mobile home apparaîtra dans votre liste

### Créer une réservation

1. Allez dans l'onglet "Réservations"
2. Cliquez sur "Nouvelle Réservation"
3. Remplissez les informations du locataire et de la réservation
4. La réservation apparaîtra dans le calendrier et la liste

## Fonctionnalités principales

### 1. Tableau de bord
- Vue d'ensemble des métriques (revenus, taux d'occupation, prix moyen)
- Prochaines arrivées
- Actions rapides

### 2. Gestion des réservations
- Liste complète des réservations
- Filtrage par statut et plateforme
- Création et modification de réservations
- Génération de contrats PDF

### 3. Calendrier
- Vue mensuelle des réservations
- Code couleur par plateforme (Airbnb, Booking.com, Direct, etc.)
- Navigation entre les mois

### 4. Gestion des cautions
- Suivi des dépôts de garantie
- Gestion des déductions
- Historique des remboursements

### 5. Tâches opérationnelles
- Planification du ménage
- Maintenance
- Contrôles d'inventaire
- Vérification des dépôts

### 6. Inventaire
- Liste des équipements par catégorie
- Suivi de l'état des articles
- Génération d'états des lieux PDF

### 7. Suivi des charges
- Enregistrement des dépenses par catégorie
- Marquage déductibilité fiscale
- Préparation déclaration BIC

### 8. Channel Manager
- Synchronisation multi-plateformes (simulation)
- Blocage de dates
- Mise à jour des tarifs
- Récupération des réservations

### 9. Génération de PDF

Deux types de documents sont disponibles :

**Contrats de location** :
```
GET /api/pdf/contract/[reservationId]
```

**États des lieux** :
```
GET /api/pdf/inventory/[reservationId]?type=CHECK_IN
GET /api/pdf/inventory/[reservationId]?type=CHECK_OUT
```

### 10. Paiements Stripe

Pour recevoir des paiements (dépôts, soldes) :

1. Configurez vos clés Stripe dans `.env`
2. Utilisez le composant `PaymentForm` :

```tsx
import { PaymentForm } from '@/components/payments/payment-form'

<PaymentForm
  reservationId="reservation_id"
  amount={500.00}
  description="Dépôt de garantie"
  type="deposit"
  onSuccess={() => console.log('Paiement réussi')}
  onError={(error) => console.error(error)}
/>
```

3. Configurez le webhook Stripe pour recevoir les confirmations :
   - URL du webhook : `https://your-domain.com/api/payments/webhook`
   - Événements à écouter : `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

## API Endpoints

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/session` - Récupérer la session

### Réservations

- `GET /api/reservations` - Liste des réservations
- `POST /api/reservations` - Créer une réservation
- `GET /api/reservations/[id]` - Détails d'une réservation
- `PATCH /api/reservations/[id]` - Modifier une réservation
- `DELETE /api/reservations/[id]` - Supprimer une réservation

### Mobile Homes

- `GET /api/mobile-homes` - Liste des mobile homes
- `POST /api/mobile-homes` - Créer un mobile home

### Tâches

- `GET /api/tasks` - Liste des tâches
- `POST /api/tasks` - Créer une tâche
- `PATCH /api/tasks/[id]` - Modifier une tâche
- `DELETE /api/tasks/[id]` - Supprimer une tâche

### Dépenses

- `GET /api/expenses` - Liste des dépenses
- `POST /api/expenses` - Créer une dépense

### Paiements

- `POST /api/payments/create-intent` - Créer un intent de paiement
- `POST /api/payments/webhook` - Webhook Stripe

## Prisma Studio

Pour visualiser et gérer les données :

```bash
npx prisma studio
```

Interface web disponible sur http://localhost:5555

## Architecture technique

### Stack technologique

- **Frontend** : Next.js 16, React 19, TypeScript
- **Styling** : Tailwind CSS v4, shadcn/ui
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : iron-session + bcryptjs
- **Paiements** : Stripe
- **PDF** : @react-pdf/renderer
- **Icônes** : Lucide React
- **Dates** : date-fns

### Structure des dossiers

```
lmnp/
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentification
│   │   │   ├── reservations/ # CRUD réservations
│   │   │   ├── tasks/        # CRUD tâches
│   │   │   ├── expenses/     # CRUD dépenses
│   │   │   ├── payments/     # Intégration Stripe
│   │   │   └── pdf/          # Génération PDF
│   │   ├── login/            # Page de connexion
│   │   ├── register/         # Page d'inscription
│   │   ├── page.tsx          # Page principale (protégée)
│   │   ├── layout.tsx        # Layout avec AuthProvider
│   │   └── globals.css       # Styles globaux + thème
│   ├── components/
│   │   ├── ui/               # Composants shadcn/ui
│   │   ├── auth/             # Composants auth
│   │   ├── dashboard/        # Tableau de bord
│   │   ├── reservations/     # Gestion réservations
│   │   ├── calendar/         # Vue calendrier
│   │   ├── tasks/            # Gestion tâches
│   │   ├── payments/         # Formulaire paiement
│   │   └── forms/            # Formulaires divers
│   ├── contexts/
│   │   └── auth-context.tsx  # Context d'authentification
│   ├── lib/
│   │   ├── prisma.ts         # Client Prisma
│   │   ├── auth.ts           # Configuration session
│   │   ├── auth-utils.ts     # Utilitaires auth
│   │   ├── stripe.ts         # Client Stripe
│   │   ├── calculations.ts   # Calculs financiers
│   │   ├── channel-manager.ts # Service channel manager
│   │   ├── mock-data.ts      # Données mock (legacy)
│   │   └── pdf/              # Templates PDF
│   │       ├── rental-contract.tsx
│   │       └── inventory-form.tsx
│   └── types/
│       └── index.ts          # Types TypeScript
├── .env                      # Variables d'environnement
├── .env.example              # Template variables
├── package.json              # Dépendances
└── SETUP.md                  # Ce fichier
```

## Intégrations futures (à implémenter)

### Airbnb API
- OAuth pour connexion
- Synchronisation automatique des réservations
- Mise à jour du calendrier
- Documentation : https://www.airbnb.com/partner

### Booking.com API
- Partner API
- Synchronisation des disponibilités
- Récupération des réservations
- Documentation : https://developers.booking.com/

## Dépannage

### Erreur de connexion à la base de données

Vérifiez que :
- PostgreSQL est démarré : `sudo service postgresql status`
- La DATABASE_URL est correcte
- L'utilisateur a les permissions nécessaires

### Prisma Client non généré

```bash
npx prisma generate
```

### Erreur Stripe

- Vérifiez que les clés API sont correctes
- En test, utilisez les clés commençant par `pk_test_` et `sk_test_`
- Pour les webhooks locaux, utilisez Stripe CLI

### Problèmes d'authentification

- Vérifiez que SESSION_SECRET fait au moins 32 caractères
- Videz les cookies du navigateur
- Vérifiez les logs serveur

## Production

### Build

```bash
npm run build
```

### Lancement

```bash
npm run start
```

### Variables d'environnement production

- Utilisez des clés Stripe de production (`pk_live_...`, `sk_live_...`)
- Générez un SESSION_SECRET sécurisé
- Configurez une DATABASE_URL de production
- Mettez `NODE_ENV=production`

## Support

Pour toute question ou problème :
- Vérifiez la documentation Prisma : https://www.prisma.io/docs
- Documentation Stripe : https://stripe.com/docs
- Documentation Next.js : https://nextjs.org/docs

## Licence

Propriétaire - LMNP-Serenity 2025
