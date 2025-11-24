# 🚀 Freelance Manager

Application SaaS complète pour gérer votre activité de marketing freelance sur les réseaux sociaux (LinkedIn, TikTok, Instagram, Facebook).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

### 📅 Planning Quotidien
- Gestion des tâches quotidiennes par heure
- Filtres par jour de la semaine et plateforme
- Sous-tâches avec checkbox
- Priorités (LOW, MEDIUM, HIGH)
- Durée estimée par tâche

### ✅ Gestionnaire de Todos
- **CRUD complet** : Créer, Lire, Modifier, Supprimer
- **Sous-tâches** : Ajoutez des sous-tâches à chaque todo avec bouton +
- Priorités et dates limites
- Association à une plateforme spécifique
- Filtres : Toutes / En cours / Complétées
- Interface moderne et intuitive

### 👥 Gestion des Contacts (CRM)
- Pipeline complet : NEW → CONTACTED → ENGAGED → QUALIFIED → NEGOTIATION → CLIENT → LOST
- Informations détaillées : nom, entreprise, poste, email, téléphone
- Historique des interactions
- Recherche et filtres par statut
- Actions rapides (email, appel, profil)

### 🎯 Suivi des Objectifs
- 7 objectifs pré-configurés sur 3 mois :
  - LinkedIn : +500 connexions
  - TikTok : 3000 followers
  - Instagram : 5000 followers
  - 30 leads qualifiés
  - 6 clients signés
  - 50+ posts LinkedIn
  - 180+ vidéos TikTok/Instagram
- Barres de progression
- Jalons (milestones)
- Mise à jour manuelle des valeurs

### 📊 Analytics Dashboard
- Graphiques de performance par plateforme
- Métriques d'engagement (likes, commentaires, partages, vues)
- Données exportables
- Visualisations avec Recharts

### 📝 Gestion de Contenu
- Planification de publications
- Calendrier éditorial
- Statuts : DRAFT, SCHEDULED, PUBLISHED, CANCELLED
- Support multi-plateformes
- Hashtags et médias

### 📚 Bibliothèque de Templates
- 22+ templates de posts prêts à l'emploi
- Pour LinkedIn, TikTok, Instagram, Facebook
- Variables personnalisables ({{nom}}, {{service}}, etc.)
- Hashtags inclus
- Conseils d'utilisation

### 💼 Plateformes Freelance
- **15 plateformes référencées** :
  - 🇫🇷 France : Malt, Comet, Freelance.com, Crème de la Crème, Codeur.com
  - 💻 Tech : Gun.io, Toptal, Turing
  - 🌍 International : Upwork, Fiverr, Freelancer.com, Guru
  - 🎨 Design : 99designs
- **Guide d'optimisation en 10 étapes** pour chaque plateforme
- **5 tips avancés** par plateforme
- Suivi du statut des comptes (créé/non créé) avec **persistance localStorage**
- Pros/cons détaillés
- Commissions et catégories
- Vos liens sociaux (Portfolio, LinkedIn, Facebook, Instagram, TikTok)

### 🌓 Mode Sombre/Clair
- Toggle élégant avec icône Lune/Soleil (bouton flottant en bas à droite)
- Persistance dans localStorage
- Transitions fluides
- Variables CSS pour tous les composants

## 🛠️ Technologies

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript 5
- **Styling** : TailwindCSS 3
- **Icons** : Lucide React
- **Charts** : Recharts
- **Database Ready** : Prisma + PostgreSQL
- **Storage** : localStorage (migration DB facile)
- **Animations** : Framer Motion
- **Dates** : date-fns

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

```bash
# Cloner le repository
git clone https://github.com/MattJeff/freelanceManager.git
cd freelanceManager

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🗂️ Structure du Projet

```
freelanceManager/
├── app/
│   ├── globals.css          # Styles globaux + variables dark mode
│   ├── layout.tsx            # Layout racine avec ThemeProvider
│   └── page.tsx              # Page principale avec navigation
├── components/
│   ├── ThemeProvider.tsx     # Contexte Dark/Light mode
│   ├── DailyPlanner.tsx      # Planning quotidien
│   ├── TodoManager.tsx       # Gestion todos + sous-tâches ⭐
│   ├── ContactsManager.tsx   # CRM complet
│   ├── GoalsTracker.tsx      # Suivi objectifs
│   ├── AnalyticsDashboard.tsx # Analytics & graphiques
│   ├── ContentManager.tsx    # Planification contenu
│   ├── TemplatesLibrary.tsx  # Bibliothèque templates
│   └── FreelancePlatforms.tsx # Plateformes freelance ⭐
├── lib/
│   ├── storage.ts            # CRUD localStorage complet ⭐
│   ├── initial-data.ts       # 18 tâches + 7 objectifs
│   ├── post-templates.ts     # 22 templates posts
│   └── data/
│       └── freelance-platforms.ts # 15 plateformes + guides
├── types/
│   └── index.ts              # Types TypeScript (Todo, Subtask, etc.) ⭐
├── prisma/
│   └── schema.prisma         # Schema DB (ready for migration)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Fonctionnalités Clés Ajoutées

### ⭐ Sous-tâches dans les Todos
- Ajoutez autant de sous-tâches que vous voulez à chaque todo
- Interface intuitive avec bouton **+** pour création rapide
- CRUD complet : créer, modifier, supprimer, toggle
- Affichage avec indentation et bordure gauche
- **Persistance complète** dans localStorage

**Fonctions disponibles** (`lib/storage.ts`):
```typescript
addSubtaskToTodo(todoId, subtaskTitle)    // Ajouter
updateSubtask(todoId, subtaskId, updates)  // Modifier
deleteSubtask(todoId, subtaskId)           // Supprimer
toggleSubtask(todoId, subtaskId)           // Toggle completion
```

### ⭐ Persistance Plateformes Freelance
- Marquez les plateformes comme "compte créé"
- **État sauvegardé** dans localStorage
- Statistiques en temps réel (X/15 plateformes)
- Bordure verte pour les comptes configurés

**Fonctions disponibles** (`lib/storage.ts`):
```typescript
getFreelancePlatformAccounts()             // Récupérer états
updatePlatformAccount(platformId, status)  // Mettre à jour
```

## 🎨 UI/UX Moderne

### Design Amélioré (Non-CRM)
- ✨ Gradients subtils et couleurs douces
- 🎴 Cards avec ombres élégantes
- 🔄 Animations et transitions fluides
- 📏 Espacements généreux
- 🔤 Typographie moderne
- ⚡ Micro-interactions

### Dark Mode
- 🌙 Toggle élégant (Lune/Soleil)
- 💾 Persistance localStorage
- 🎨 Variables CSS pour tous les composants
- ⚡ Transitions instantanées

## 📝 Utilisation

### 1. Planning Quotidien
1. Sélectionnez le jour de la semaine
2. Filtrez par plateforme (optionnel)
3. Cochez les tâches complétées
4. Les sous-tâches s'affichent automatiquement

### 2. Gestionnaire de Todos
1. Cliquez **"+ Nouvelle Todo"**
2. Remplissez : titre, description, priorité, date
3. Ajoutez des sous-tâches avec le bouton **+**
4. Cochez pour marquer comme complété
5. Modifiez ou supprimez avec les icônes

### 3. Plateformes Freelance
1. Parcourez les 15 plateformes
2. Lisez les guides d'optimisation (10 étapes + 5 tips)
3. Cliquez **"Visiter le site"** pour créer votre compte
4. Marquez **"Compte créé"** pour suivre votre progression
5. Objectif : 3-5 comptes dans le premier mois

### 4. Mode Sombre
- Cliquez sur le bouton **flottant** en bas à droite (🌙/☀️)
- Le thème change instantanément
- Votre préférence est sauvegardée

## 🗄️ Base de Données (Optionnel)

### localStorage (Actuel)
- ✅ Zero configuration
- ✅ Démarrage instantané
- ✅ Parfait pour usage personnel
- ⚠️ Données par navigateur
- ⚠️ Pas de synchronisation multi-appareils

### Migration PostgreSQL (Future)

Le schema Prisma est déjà prêt dans `prisma/schema.prisma`.

**Étapes pour migrer** :

1. **Créer une DB PostgreSQL** (gratuit) :
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

2. **Configurer `.env`** :
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. **Lancer les migrations** :
```bash
npx prisma db push
npx prisma generate
```

4. **Remplacer localStorage par Prisma** dans `lib/storage.ts`

**Temps estimé** : 2-3 heures

## 🚢 Déploiement

### Vercel (Recommandé - Gratuit)

1. Push sur GitHub :
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. Connectez-vous sur [vercel.com](https://vercel.com)

3. Importez votre repository GitHub

4. Déployez (1 clic !)

**URL finale** : `https://votre-app.vercel.app`

### Autres Options
- Netlify
- Railway
- AWS Amplify
- Hébergement Node.js classique

## 🔧 Scripts

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linter
npm run lint

# Générer Prisma Client (si DB utilisée)
npx prisma generate

# Migrations DB (si DB utilisée)
npx prisma db push
```

## 📊 Données Initiales

### 18 Tâches Quotidiennes Pré-configurées
- Routine matinale LinkedIn (8h00)
- Création contenu TikTok (9h00)
- Prospection LinkedIn (10h30)
- Instagram Stories (12h00)
- Engagement Facebook (14h00)
- Vidéo TikTok après-midi (15h00)
- Réponses messages (16h30)
- Routine de clôture (18h00)
- ... et plus !

### 7 Objectifs sur 3 Mois
- LinkedIn : +500 connexions
- TikTok : 3000 followers
- Instagram : 5000 followers
- 30 leads qualifiés
- 6 clients signés
- 50+ posts LinkedIn
- 180+ vidéos TikTok/Instagram

### 22 Templates de Posts
- Présentation profil
- Transformation client
- Conseils gratuits
- Behind the scenes
- Témoignages
- Call-to-action
- ... et plus !

## 🎯 Roadmap

- [ ] Authentification (Clerk ou NextAuth)
- [ ] Migration PostgreSQL + Prisma
- [ ] Export PDF des rapports
- [ ] Intégrations API (LinkedIn, Instagram, etc.)
- [ ] Notifications push
- [ ] Multi-utilisateurs / équipe
- [ ] Application mobile (React Native)
- [ ] Webhooks pour automatisation

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

MIT License - voir [LICENSE](LICENSE)

## 👤 Auteur

**Mathis Higuinen**

- Portfolio: [portfolio-sable-delta-70.vercel.app](https://portfolio-sable-delta-70.vercel.app)
- LinkedIn: [@mathis-higuinen](https://www.linkedin.com/in/mathis-higuinen-37578a392/)
- Instagram: [@mathis_travel_1](https://www.instagram.com/mathis_travel_1)
- TikTok: [@mathis_travel](https://www.tiktok.com/@mathis_travel)
- Facebook: [Profile](https://www.facebook.com/sarmin.sultana.345)

## 🙏 Remerciements

- [Next.js](https://nextjs.org) - Framework React
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons
- [Recharts](https://recharts.org) - Graphiques
- [Prisma](https://prisma.io) - ORM

---

**Créé avec ❤️ pour les freelances qui veulent dominer les réseaux sociaux !** 🚀

**Lancement**: `npm run dev` → http://localhost:3000
