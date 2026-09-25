import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace these two with your own project's values from
// Supabase dashboard > Project Settings > API.
// The publishable ("anon") key is safe to ship in client code — it's
// designed to be public. Row-level security (set up via the SQL you ran)
// is what actually protects the data. NEVER put the "secret" key here.
const SUPABASE_URL = 'https://onvvoxuvndfgclnqhtjv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_rGhPJOO3BObsglcTWNsGgA_XJit6_IU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});