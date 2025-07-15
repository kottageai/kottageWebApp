import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '..';

const router = Router();

// Zod schema for profile validation
const profileSchema = z.object({
  id: z.uuid(),
  full_name: z.string().min(1, 'Full name is required'),
  home_address: z.string().optional().nullable(),
  is_provider: z.boolean(),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional().nullable(),
});

// Create or update a profile
router.post('/', async (req, res) => {
  try {
    const { user, profileData } = req.body;

    if (!user || !user.id) {
      return res.status(400).json({ error: 'User is not authenticated.' });
    }

    const parsedProfileData = profileSchema.safeParse({
      id: user.id,
      ...profileData,
    });

    if (!parsedProfileData.success) {
      return res.status(400).json({ error: parsedProfileData.error.issues });
    }
    
    const { id, full_name, home_address, is_provider, email: providedEmail, avatar_url } = parsedProfileData.data;
    const email = providedEmail || user.email;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id,
          full_name,
          home_address,
          is_provider,
          email,
          avatar_url,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
      return res.status(500).json({ error: 'Failed to create or update profile.' });
    }

    res.status(200).json({ message: 'Profile created/updated successfully', data });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

export default router; 