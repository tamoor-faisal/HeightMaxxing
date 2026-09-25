import { UserProfile } from '../utils/heightEstimate';

/**
 * BACKEND INTEGRATION NOTES
 * ---------------------------------------------------------------------
 * This file is a stub. There's no real backend wired up yet — signUp()
 * just resolves locally so the UI has something to call. Before shipping,
 * point this at a real service. Supabase is a solid default here: managed
 * Postgres + auth + row-level security, so you get "users can only ever
 * read their own row" enforced by the database itself rather than by app
 * code you have to trust.
 *
 * Suggested schema (Supabase/Postgres):
 *
 *   profiles
 *     id              uuid  primary key references auth.users(id)
 *     current_height_cm  numeric not null
 *     age_years          integer not null
 *     gender             text not null
 *     ethnicity          text null      -- optional, sensitive: see note below
 *     created_at         timestamptz default now()
 *
 *   height_logs
 *     id          uuid primary key default gen_random_uuid()
 *     user_id     uuid references auth.users(id)
 *     cm          numeric not null
 *     logged_at   timestamptz not null
 *
 * PRIVACY / COMPLIANCE — handle before real users touch this:
 *   - age, gender, ethnicity and height are all sensitive personal data
 *     categories under GDPR (ethnicity is "special category" data
 *     specifically). Ethnicity must stay genuinely optional, must be
 *     covered explicitly in your privacy policy, and should be encrypted
 *     at rest at minimum (Supabase/most managed Postgres do this by
 *     default, but confirm it).
 *   - If your signed-up users could plausibly be under 13 (US, COPPA) or
 *     under 16 (EU/UK, GDPR-K), you need an age gate at signup and a
 *     parental-consent flow before collecting any of this data from them.
 *     That's a legal requirement, not a nice-to-have, and both app stores
 *     will reject submissions that skip it if the app is likely to appeal
 *     to kids. This stub does NOT implement that — see the TODO in
 *     SignUpScreen.tsx.
 *   - Support account/data deletion (GDPR right to erasure) from day one
 *     — it's much harder to retrofit later.
 */

export type AuthUser = { id: string; email: string };

export async function signUp(
  email: string,
  password: string,
  profile: UserProfile
): Promise<{ user: AuthUser; profile: UserProfile }> {
  console.warn('[auth] signUp() is a stub — no backend is connected yet.');
  // Simulated network delay so the UI's loading state has something to show.
  await new Promise((r) => setTimeout(r, 400));
  return {
    user: { id: 'local-stub-user', email },
    profile,
  };
}

export async function signIn(email: string, _password: string): Promise<AuthUser> {
  console.warn('[auth] signIn() is a stub — no backend is connected yet.');
  await new Promise((r) => setTimeout(r, 400));
  return { id: 'local-stub-user', email };
}

export async function signOut(): Promise<void> {
  console.warn('[auth] signOut() is a stub.');
}
