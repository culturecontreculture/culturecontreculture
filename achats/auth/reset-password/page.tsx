'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await resetPassword(email);
      
      // Message de succès
      setSuccess('Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

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

        {success && (
          <div className="bg-primary bg-opacity-10 border border-primary text-primary p-4 mb-6 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-text-secondary">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="robot-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre.email@exemple.com"
            />
            <p className="text-xs text-text-secondary mt-2">
              Vous recevrez un lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <button
            type="submit"
            className={`robot-button w-full py-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <Link 
            href="/achats/auth/login" 
            className="robot-link text-sm block"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;