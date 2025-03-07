import { createClient } from '@supabase/supabase-js';
import { Database } from '@/supabase/supabase-types';

// Création d'un client Supabase avec les variables d'environnement
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined in environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Client Supabase côté client
let supabaseClient: ReturnType<typeof createSupabaseClient>;

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;
  supabaseClient = createSupabaseClient();
  return supabaseClient;
};

// Récupération du client Supabase côté serveur (si besoin)
export const getSupabaseServerClient = () => {
  return createSupabaseClient();
};