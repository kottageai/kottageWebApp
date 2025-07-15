import { Router } from 'express';
import { supabase } from '../lib/supabaseClient';

const router = Router();

router.get('/', async (_req, res) => {
  try {
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