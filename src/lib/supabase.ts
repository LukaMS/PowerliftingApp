import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure you set these in your environment (app.json or .env)
const SUPABASE_URL: string = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anon Key. Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
