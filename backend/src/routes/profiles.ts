import { Router } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const router = Router();

// Lazy-initialise Supabase so we only read env vars after dotenv has run
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

// Validation schemas
interface CreateProfileRequest {
  full_name: string;
  phone: string;
  address?: string;
  wants_to_be_provider: boolean;
}

function validateProfileData(data: any): CreateProfileRequest {
  if (!data.full_name?.trim()) {
    throw new Error('Full name is required');
  }
  
  if (!data.phone?.trim()) {
    throw new Error('Phone number is required');
  }

  // Additional validations
  if (data.phone.length < 10) {
    throw new Error('Phone number must be at least 10 digits');
  }

  if (data.full_name.length < 2) {
    throw new Error('Full name must be at least 2 characters');
  }

  return {
    full_name: data.full_name.trim(),
    phone: data.phone.trim(),
    address: data.address?.trim() || null,
    wants_to_be_provider: Boolean(data.wants_to_be_provider),
  };
}

// Create profile endpoint
router.post('/', async (req, res) => {
  try {
    // Get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseAdmin();
    
    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Validate request data
    const profileData = validateProfileData(req.body);

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists' });
    }

    // Create profile in transaction-like manner
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: profileData.full_name,
        phone: profileData.phone,
        address: profileData.address,
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // Create provider record if requested
    let provider = null;
    if (profileData.wants_to_be_provider) {
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .insert({
          id: user.id,
          display_name: profileData.full_name,
        })
        .select()
        .single();

      if (providerError) {
        // Rollback profile creation
        await supabase.from('profiles').delete().eq('id', user.id);
        throw providerError;
      }

      provider = providerData;
    }

    // Send welcome email (example of server-side workflow)
    // await sendWelcomeEmail(user.email, profileData.full_name);

    // Log user creation for analytics
    console.log(`New user profile created: ${user.id} - ${profileData.full_name}`);

    res.status(201).json({
      message: 'Profile created successfully',
      profile,
      provider,
    });

  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create profile' 
    });
  }
});

// Get profile endpoint
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseAdmin();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get profile with provider status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        providers(id, display_name)
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      throw profileError;
    }

    res.json({
      profile,
      is_provider: !!profile.providers,
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router; 