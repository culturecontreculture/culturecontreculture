'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

// Composant qui utilise useSearchParams à l'intérieur d'une limite de suspense
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/achats';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      
      // Utiliser window.location.href au lieu de router.push pour une redirection plus fiable
      window.location.href = redirectPath;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-text-secondary">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          className="robot-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className={`robot-button w-full py-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </button>
    </form>
  );
};

// Fallback pour le chargement
const LoginFormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-6 w-20 bg-gray-700 rounded mb-2"></div>
      <div className="h-10 w-full bg-gray-700 rounded"></div>
    </div>
    <div>
      <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
      <div className="h-10 w-full bg-gray-700 rounded"></div>
    </div>
    <div className="h-10 w-full bg-gray-700 rounded"></div>
  </div>
);

// Composant principal de la page
const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="border border-primary p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center robot-text">
          Connexion
        </h1>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 mb-6 text-center">
            {error}
          </div>
        )}

        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center space-y-4">
          <Link 
            href="/achats/auth/register" 
            className="robot-link text-sm block"
          >
            Pas de compte ? Inscrivez-vous
          </Link>
          <Link 
            href="/achats/auth/reset-password" 
            className="robot-link text-sm block"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;