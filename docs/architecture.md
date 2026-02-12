# Architecture

## Stack
- Next.js (App Router) + TypeScript
- Supabase (Postgres + Auth)
- Styling: Tailwind

## Rules
- Feature-first under `src/features/*`
- Server components by default, client only when needed
- Data access via `src/lib/supabase/*`
- No direct use of service role key in client code
