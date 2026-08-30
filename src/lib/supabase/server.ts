import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xekfarqemnyfguxtpeoj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhla2ZhcnFlbW55Zmd1eHRwZW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjc1NTMsImV4cCI6MjA4MjYwMzU1M30.tK8VZmwISXM4yMHq6is0CgfUhE7JkM3DqUKmwF7h7sQ';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-side Supabase client with elevated administrative privileges
 * when SUPABASE_SERVICE_ROLE_KEY is configured in production environment.
 */
export function createServerAdminClient() {
  const key = supabaseServiceKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
