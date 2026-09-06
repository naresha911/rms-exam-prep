# Requirements — AISSEE Preparation App

Index of product, design, schema, and feature docs under `requirements/`.

| File | Purpose |
|------|---------|
| [`requirements.txt`](requirements.txt) | Product requirements (MVP + roadmap). Living draft; feature sections may point to dedicated specs. |
| [`Design.md`](Design.md) | Design tokens (Cadet Quest colors, typography, spacing). Implemented in `src/constants`. |
| [`Initial_Migration.txt`](Initial_Migration.txt) | Canonical Supabase schema for greenfield / reference. |
| [`sql/papers_v1.sql`](sql/papers_v1.sql) | Incremental SQL for existing projects: paper attempts, RLS, RPCs, storage policies. Run once in Supabase SQL Editor. |
| [`previous-papers.md`](previous-papers.md) | **Current** Previous Year Papers product + tech spec (aligned with codebase). |
| [`papers-sprints.md`](papers-sprints.md) | Sprint tracker for papers implementation. |
| [`papers-verification.md`](papers-verification.md) | Live Supabase + device verification checklist after deploying `papers_v1.sql`. |

## Stack (as built)

- React Native + Expo (Router file-based routes)
- TypeScript, NativeWind v5, Zustand + AsyncStorage
- Supabase (Auth, Postgres, Storage, RPCs)
- PostHog analytics

## Route groups

Expo Router folders such as `(auth)`, `(onboarding)`, `(tabs)` are **route groups**: they organize layouts and do **not** appear in the URL path.

## Keeping docs in sync

When a major feature ships:

1. Update or add a dedicated `requirements/<feature>.md` if the feature outgrows a short section in `requirements.txt`.
2. Point that section in `requirements.txt` at the dedicated doc.
3. Update `Initial_Migration.txt` and/or `sql/*.sql` when schema changes.
4. Update verification checklists for anything that must be confirmed in Supabase/device.
