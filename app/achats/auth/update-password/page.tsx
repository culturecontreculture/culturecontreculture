'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Vérifier si l'utilisateur peut réinitialiser son mot de passe
    const checkPasswordReset = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        // Si pas de session ou pas de token de réinitialisation
        if (error || !data.session) {
          setIsValidToken(false);
          setError('Lien de réinitialisation invalide ou expiré');
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        setIsValidToken(false);
        setError('Impossible de vérifier le lien de réinitialisation');
      }
    };

    checkPasswordReset();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation des champs
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validation du mot de passe
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Rediriger vers la page de connexion
      router.push('/achats/auth/login?passwordReset=success');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  // Si le token est invalide, afficher un message d'erreur
  if (!isValidToken) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="border border-red-500 p-8">
          <h1 className="text-3xl font-bold text-red-500 mb-6">
            Lien Invalide
          </h1>
          
          <p className="text-text-secondary mb-6">
            {error || 'Le lien de réinitialisation de mot de passe est invalide ou a expiré.'}
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/achats/auth/reset-password" 
              className="robot-button block"
            >
              Demander un nouveau lien
            </Link>
            
            <Link 
              href="/achats/auth/login" 
              className="robot-link"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="border border-primary p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center robot-text">
          Réinitialisation<br />Mot de Passe
        </h1>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block mb-2 text-text-secondary">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="robot-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={8}
            />
            <p className="text-xs text-text-secondary mt-2">
              Minimum 8 caractères
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-text-secondary">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="robot-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className={`robot-button w-full py-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/achats/auth/login" 
            className="robot-link text-sm"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;