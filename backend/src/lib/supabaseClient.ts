import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Admin client (for elevated privileges)
export function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL for admin client.');
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin client.');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Normal client (for user-level operations)
export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL for admin client.');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY for standard client.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
 