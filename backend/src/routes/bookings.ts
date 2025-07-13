import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('bookings').select('*');

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