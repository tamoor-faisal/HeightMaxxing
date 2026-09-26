import { supabase } from './supabaseClient';
import { UserProfile } from '../utils/heightEstimate';

export type AuthUser = { id: string; email: string };

function formatAuthError(error: { message?: string; code?: string; details?: string }) {
  const detail = error.details ? ` ${error.details}` : '';
  return `${error.message ?? 'Authentication request failed.'}${detail}`;
}

function profileValues(profile: UserProfile) {
  return {
    current_height_cm: profile.currentHeightCm,
    age_years: profile.ageYears,
    gender: profile.gender,
    mother_height_cm: profile.motherHeightCm ?? null,
    father_height_cm: profile.fatherHeightCm ?? null,
    ethnicity: profile.ethnicity ?? null,
  };
}

export async function signUp(
  email: string,
  password: string,
  profile: UserProfile
): Promise<{ user: AuthUser; profile: UserProfile }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: profileValues(profile) },
  });
  if (error) throw new Error(formatAuthError(error));
  if (!data.user) throw new Error('Sign-up succeeded but no user was returned.');

  return {
    user: { id: data.user.id, email: data.user.email ?? email },
    profile,
  };
}

export async function saveProfile(userId: string, profile: UserProfile): Promise<void> {
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    ...profileValues(profile),
  });
  if (error) throw new Error(formatAuthError(error));
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(formatAuthError(error));
  if (!data.user) throw new Error('Sign-in succeeded but no user was returned.');
  return { id: data.user.id, email: data.user.email ?? email };
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('current_height_cm, age_years, gender, mother_height_cm, father_height_cm, ethnicity')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    currentHeightCm: data.current_height_cm,
    ageYears: data.age_years,
    gender: data.gender,
    motherHeightCm: data.mother_height_cm ?? undefined,
    fatherHeightCm: data.father_height_cm ?? undefined,
    ethnicity: data.ethnicity ?? undefined,
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}