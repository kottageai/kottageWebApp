import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.uuid(),
  full_name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.email().nullable(),
  home_address: z.string().nullable(),
  avatar_url: z.url().nullable(),
  is_provider: z.boolean().default(false),
  created_at: z.iso.datetime()
})

export const CreateProfileSchema = z.object({
  full_name: z.uuid().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format'),
  email: z.email('Invalid email format'),
  home_address: z.string().max(500).optional(),
  avatar_url: z.url('Invalid URL format').optional(),
  is_provider: z.boolean().default(false).optional()
})

export type Profile = z.infer<typeof ProfileSchema>
export type CreateProfileData = z.infer<typeof CreateProfileSchema>