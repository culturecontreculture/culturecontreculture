import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Hook personnalisé pour gérer l'authentification
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Récupérer la session actuelle
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    // Nettoyer l'abonnement lors du démontage
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Fonction d'inscription
  const signUp = async (email: string, password: string, userData?: object) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Si des données utilisateur supplémentaires sont fournies, les enregistrer
    if (data.user && userData) {
      const { error: profileError } = await supabase
        .from('customers')
        .upsert({
          id: data.user.id,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;
    }

    return data;
  };

  // Fonction de déconnexion
  const signOut = async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
  };

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/achats/auth/update-password`
    });

    if (error) throw error;
    return data;
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (profileData: object) => {
    if (!user) throw new Error('Utilisateur non connecté');

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('customers')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };
};

export default useAuth;