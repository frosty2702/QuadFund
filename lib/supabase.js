import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. The app will use fallback data.');
  } else {
    // Only create the client if we have valid credentials
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.info('Supabase client initialized successfully.');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Keep supabase as null, which will trigger fallbacks
}

export default supabase; 