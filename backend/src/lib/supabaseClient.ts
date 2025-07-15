import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Admin client (for elevated privileges)
function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables for admin client.');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Normal client (for user-level operations)
function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables for standard client.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabaseAdmin = createSupabaseAdminClient();
export const supabase = createSupabaseClient(); 