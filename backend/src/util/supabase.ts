import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseAdminClient(): SupabaseClient {

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL for admin client.');
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin client.');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export const supabaseAdmin = createSupabaseAdminClient();
