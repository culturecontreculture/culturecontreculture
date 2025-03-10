'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import useAuth from '@/hooks/useAuth';
import { Customer } from '@/supabase/supabase-types';

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Customer>({
    id: '',
    first_name: null,
    last_name: null,
    address: null,
    postal_code: null,
    city: null,
    country: null,
    phone: null,
    created_at: '',
    updated_at: ''
  });
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Récupérer le profil de l'utilisateur
  useEffect(() => {
    if (!user) {
      router.push('/achats/auth/login?redirect=/achats/profil');
      return;
    }

    const fetchProfile = async () => {
      try {
        const supabase = getSupabaseClient();
        
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data || {});
        setFormData(data || {});
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur de récupération du profil:', err);
        setError('Impossible de charger le profil');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  // Gérer les changements de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire de mise à jour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const supabase = getSupabaseClient();
      
      // Mettre à jour le profil
      const { error } = await supabase
        .from('customers')
        .upsert({
          id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mettre à jour le state
      setProfile(prev => ({
        ...prev,
        ...formData
      }));

      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur de mise à jour du profil:', err);
      setError('Impossible de mettre à jour le profil');
    }
  };

  // Annuler l'édition
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // Gestion de la déconnexion
  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push('/achats/auth/login');
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
    }
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="border border-primary p-8 inline-block mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Chargement du profil
          </h1>
          
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 animate-spin">
              <div className="absolute inset-0 border-t-2 border-primary rounded-full"></div>
            </div>
          </div>
          
          <p className="text-text-secondary">Veuillez patienter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8 robot-text">
          Mon Profil
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

        <div className="border border-primary p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block mb-2 text-text-secondary">
                  Prénom
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="robot-input"
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block mb-2 text-text-secondary">
                  Nom
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="robot-input"
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
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
                className="robot-input bg-text-secondary bg-opacity-10 cursor-not-allowed"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-text-secondary">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="robot-input"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div>
              <label htmlFor="address" className="block mb-2 text-text-secondary">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="robot-input"
                value={formData.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Votre adresse"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="block mb-2 text-text-secondary">
                  Code Postal
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  className="robot-input"
                  value={formData.postal_code || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Code postal"
                />
              </div>

              <div>
                <label htmlFor="city" className="block mb-2 text-text-secondary">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="robot-input"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Votre ville"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block mb-2 text-text-secondary">
                Pays
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="robot-input"
                value={formData.country || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Votre pays"
              />
            </div>

            <div className="pt-4 space-y-4">
              {!isEditing ? (
                <button
                  type="button"
                  className="robot-button w-full"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="robot-button"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    className="robot-button"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="mt-6 space-y-4">
          <Link 
            href="/achats/historique" 
            className="robot-button w-full block text-center"
          >
            Historique de commandes
          </Link>

          <button
            onClick={handleSignOut}
            className="robot-button w-full"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;