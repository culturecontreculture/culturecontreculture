import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/client';

// Fonction pour vérifier si l'utilisateur est connecté
async function getUser() {
  const supabase = getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export default async function AchatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/achats" className="text-2xl font-bold text-primary robot-text">
              MINI<span className="text-white">SHOP</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/achats/historique" className="robot-button text-sm">
                    Historique
                  </Link>
                  <Link href="/achats/checkout" className="robot-button text-sm">
                    Panier
                  </Link>
                  <form action="/api/auth/signout" method="post">
                    <button type="submit" className="robot-button text-sm">
                      Déconnexion
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/achats/auth/login" className="robot-button text-sm">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="border-t border-primary py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-text-secondary text-sm">
            <p>&copy; {new Date().getFullYear()} MINISHOP - <span className="robot-text">Tous droits réservés</span></p>
            <p className="mt-2">
              <Link href="/achats/mentions-legales" className="robot-link text-xs">
                Mentions légales
              </Link>
              {' | '}
              <Link href="/achats/conditions-generales" className="robot-link text-xs">
                CGV
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
