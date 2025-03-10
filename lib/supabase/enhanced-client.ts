import { createClient } from '@supabase/supabase-js';
import { Database } from '@/supabase/supabase-types';

// Création d'un client Supabase avec désactivation du cache par défaut
export const createSupabaseClientWithoutCache = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined in environment variables');
  }

  // Options pour désactiver le cache des requêtes fetch
  const fetchOptions = {
    fetch: (url: string, options: RequestInit) => {
      // Ajouter des en-têtes pour éviter le cache du navigateur
      options.headers = {
        ...options.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
      
      // Ajouter un paramètre aléatoire à l'URL pour éviter le cache
      const urlWithNoCacheParam = new URL(url);
      urlWithNoCacheParam.searchParams.append('_nocache', Date.now().toString());
      
      return fetch(urlWithNoCacheParam.toString(), options);
    }
  };

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    ...fetchOptions,
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

// Client Supabase côté client
let supabaseNoCacheClient: ReturnType<typeof createSupabaseClientWithoutCache>;

export const getSupabaseClientWithoutCache = () => {
  if (supabaseNoCacheClient) return supabaseNoCacheClient;
  supabaseNoCacheClient = createSupabaseClientWithoutCache();
  return supabaseNoCacheClient;
};

// Pour le côté serveur
export const getSupabaseServerClientWithoutCache = () => {
  return createSupabaseClientWithoutCache();
};