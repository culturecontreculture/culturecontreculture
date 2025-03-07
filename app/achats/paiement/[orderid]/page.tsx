'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

interface PaymentPageProps {
  params: {
    orderId: string;
  };
}

const PaymentPage = ({ params }: PaymentPageProps) => {
  const { orderId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initPayment = async () => {
      try {
        setIsLoading(true);
        
        const supabase = getSupabaseClient();
        
        // Vérifier si l'utilisateur est authentifié
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/achats/auth/login?redirect=/achats/paiement/' + orderId);
          return;
        }
        
        // Récupérer les détails de la commande
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            customers (*)
          `)
          .eq('id', orderId)
          .single();
        
        if (orderError || !order) {
          throw new Error('Commande non trouvée');
        }
        
        // Vérifier que la commande appartient à l'utilisateur connecté
        if (order.customer_id !== session.user.id) {
          throw new Error('Accès non autorisé');
        }
        
        // Récupérer les articles de la commande
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (*)
          `)
          .eq('order_id', orderId);
        
        if (itemsError) {
          throw new Error('Erreur lors de la récupération des articles de la commande');
        }
        
        // Initialiser le paiement avec EasyTransac
        const response = await fetch('/api/checkout/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            amount: order.total_amount,
            customerInfo: order.customers,
            orderItems,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de l\'initialisation du paiement');
        }
        
        const { paymentUrl } = await response.json();
        
        // Rediriger vers la page de paiement EasyTransac
        window.location.href = paymentUrl;
        
      } catch (err) {
        console.error('Erreur de paiement:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setIsLoading(false);
      }
    };
    
    initPayment();
  }, [orderId, router]);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="border border-red-500 p-6 inline-block mx-auto">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Erreur de paiement</h1>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => router.push('/achats/checkout')}
            className="robot-button"
          >
            Retour au panier
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="border border-primary p-8 inline-block mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-6">Initialisation du paiement</h1>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 animate-spin">
            <div className="absolute inset-0 border-t-2 border-primary rounded-full"></div>
          </div>
        </div>
        
        <p className="mb-4 text-text-secondary">
          Veuillez patienter pendant que nous préparons votre paiement sécurisé...
        </p>
        <p className="text-xs text-text-secondary robot-text">
          Vous allez être redirigé vers notre prestataire de paiement
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;