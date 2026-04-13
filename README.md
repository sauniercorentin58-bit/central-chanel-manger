# Central Chanel Manager

Application web de gestion de checklist de ménage pour conciergerie Airbnb.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS)

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Configuration Supabase

1. Créez un projet Supabase.
2. Exécutez le SQL dans `supabase/schema.sql`.
3. Activez l'auth par email/password.
4. Renseignez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.

## Fonctionnalités

- Authentification (login)
- Dashboard de suivi
- Gestion des biens
- Création d'interventions de ménage
- Checklist de tâches cochables
- Historique des interventions
- Gestion des statuts: `à faire`, `en cours`, `terminé`

## Structure

- `app/`
- `components/`
- `lib/`
- `supabase/`
- `types/`
