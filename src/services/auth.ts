import { supabase } from './supabaseClient';
import { UserProfile } from '../utils/heightEstimate';

export type AuthUser = { id: string; email: string };

export async function signUp(
  email: string,
  password: string,
  profile: UserProfile
): Promise<{ user: AuthUser; profile: UserProfile }> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign-up succeeded but no user was returned.');

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    current_height_cm: profile.currentHeightCm,
    age_years: profile.ageYears,
    gender: profile.gender,
    ethnicity: profile.ethnicity ?? null,
  });
  // If the profile insert fails, the auth user still exists — not ideal,
  // but acceptable for now. A production version would want this in a
  // single transaction (e.g. a Postgres function called via .rpc()).
  if (profileError) throw profileError;

  return {
    user: { id: data.user.id, email: data.user.email ?? email },
    profile,
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign-in succeeded but no user was returned.');
  return { id: data.user.id, email: data.user.email ?? email };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}