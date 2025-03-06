'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation des champs
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validation du mot de passe (exemple de critères)
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
      });

      // Rediriger vers la page de confirmation ou de profil
      router.push('/achats/auth/register-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="border border-primary p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center robot-text">
          Inscription
        </h1>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block mb-2 text-text-secondary">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                className="robot-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block mb-2 text-text-secondary">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                className="robot-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Votre nom"
              />
            </div>
          </div>

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
              minLength={8}
            />
            <p className="text-xs text-text-secondary mt-2">
              Minimum 8 caractères
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-text-secondary">
              Confirmer le mot de passe
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
            {isLoading ? 'Inscription en cours...' : 'Créer un compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/achats/auth/login" 
            className="robot-link text-sm"
          >
            Déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;