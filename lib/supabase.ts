import { createClient } from '@supabase/supabase-js'

// Server-side client using the secret key (full access, for API routes / Server Components)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SECRET_KEY || 'placeholder_secret'
)

// Public client using anon key (for client components if ever needed)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon'
)
