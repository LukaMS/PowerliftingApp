import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure you set these in your environment (app.json or .env)
const SUPABASE_URL: string = process.env.SUPABASE_URL || 'https://tamrwfziyythngoshnki.supabase.co';
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbXJ3ZnppeXl0aG5nb3NobmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTczNzUsImV4cCI6MjA2MTAzMzM3NX0.eU2EEY5pH2rv9-SmCGdXg08NLiM1mGDr0WkEJPNY0qM';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anon Key. Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
