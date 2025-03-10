'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const RegisterSuccessPage = () => {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Rediriger automatiquement si un utilisateur est connecté
    if (!user) {
      router.push('/achats/auth/login');
      return;
    }

    // Compte à rebours pour la redirection automatique
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          router.push('/achats');
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Nettoyer le timer si le composant est démonté
    return () => clearInterval(timer);
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md text-center">
      <div className="border border-primary p-8">
        <h1 className="text-3xl font-bold text-primary mb-6 robot-text">
          Inscription Réussie
        </h1>

        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-primary mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>

          <p className="text-text-secondary mb-4">
            Votre compte a été créé avec succès !
          </p>

          <p className="text-text-secondary mb-6">
            Bienvenue, {user.email}
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/achats" 
            className="robot-button w-full block py-3"
          >
            Commencer mes achats
          </Link>

          <Link 
            href="/achats/profil" 
            className="robot-button w-full block py-3"
          >
            Compléter mon profil
          </Link>
        </div>

        <p className="mt-6 text-xs text-text-secondary">
          Redirection automatique dans {countdown} secondes
        </p>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;