import { Router } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const router = Router();

// Lazy-initialise Supabase so we only read env vars **after** dotenv has run in the main entry file.
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }

  return supabaseAdmin;
}

router.get('/', async (_req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('bookings').select('*');

    if (error) {
      throw error;
    }

    res.json({ bookings: data });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router; 