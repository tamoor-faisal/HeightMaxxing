import { supabase } from './supabaseClient';

export async function insertHeightLog(userId: string, cm: number): Promise<void> {
  const { error } = await supabase.from('height_logs').insert({ user_id: userId, cm });
  if (error) throw error;
}