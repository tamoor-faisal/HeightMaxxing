import { supabase } from './supabaseClient';

export async function insertHeightLog(userId: string, cm: number): Promise<void> {
  const { error } = await supabase.from('height_logs').insert({ user_id: userId, cm });
  if (error) throw error;
}

export type DbLogEntry = { cm: number; loggedAt: string };

export async function getHeightLogs(userId: string): Promise<DbLogEntry[]> {
  const { data, error } = await supabase
    .from('height_logs')
    .select('cm, logged_at')
    .eq('user_id', userId)
    .order('logged_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({ cm: row.cm, loggedAt: row.logged_at }));
}