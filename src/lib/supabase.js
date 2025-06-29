import { createClient } from '@supabase/supabase-js'

// Demo configuration - replace with your actual Supabase credentials
const SUPABASE_URL = 'https://demo-project.supabase.co'
const SUPABASE_ANON_KEY = 'demo-key'

// For demo purposes, we'll use a mock client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase