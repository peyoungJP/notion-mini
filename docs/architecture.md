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

## Project Structure (Rules)

### Feature-first
- Put feature-specific code under `src/features/*`.
- Each feature may contain:
  - `ui/` (pages/components)
  - `data/` (repository, queries)
  - `model/` (types, mapping helpers)
  - `lib/` (feature-local utilities)

### Features
- Auth-related code goes under:
  - `src/features/auth/*`
- Notes-related code goes under:
  - `src/features/notes/*`

### Supabase client usage
- Use the shared Supabase client from:
  - `src/lib/supabase/client.ts`
- Do not create new Supabase clients in feature folders.
- Do not use service role key in any client-side code.

### App Router conventions
- Route files live under `src/app/*`.
- Keep route files thin: they should call feature components/hooks.
