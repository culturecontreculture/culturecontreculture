'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Order, OrderStatus, PaymentStatus } from '@/supabase/supabase-types';
import Link from 'next/link';

// Formater le prix de centimes en euros avec le symbole €
const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInCents / 100);
};

// Composant qui utilise useSearchParams dans Suspense
const ConfirmationContent = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Numéro de commande manquant');
        setIsLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseClient();
        
        // Récupérer les détails de la commande
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .eq('id', orderId)
          .single();
        
        if (orderError || !orderData) {
          throw new Error('Commande non trouvée');
        }

        setOrder(orderData);
        // Adapter pour utiliser la structure correcte des données
        setOrderItems(orderData.order_items);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération de la commande:', err);
        setError(err instanceof Error ? err.message : 'Erreur de récupération');
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Déterminer le statut de la commande
  const getOrderStatusText = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'En attente de paiement';
      case OrderStatus.PAID:
        return 'Payée';
      case OrderStatus.SHIPPED:
        return 'Expédiée';
      case OrderStatus.DELIVERED:
        return 'Livrée';
      case OrderStatus.CANCELLED:
        return 'Annulée';
      default:
        return 'Statut inconnu';
    }
  };

  // Gérer les différents états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="border border-primary p-8 inline-block mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">Chargement de votre commande</h1>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 animate-spin">
            <div className="absolute inset-0 border-t-2 border-primary rounded-full"></div>
          </div>
        </div>
        
        <p className="text-text-secondary">Veuillez patienter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500 p-6 inline-block mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Erreur</h1>
        <p className="mb-6 text-text-secondary">{error}</p>
        <Link href="/achats" className="robot-button">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto border border-primary p-8">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Confirmation de commande
      </h1>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-text-secondary">Numéro de commande:</span>
          <span className="font-bold">#{orderId?.substring(0, 8)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-text-secondary">Statut:</span>
          <span className={`font-bold ${
            order?.status === OrderStatus.PAID 
              ? 'text-primary' 
              : 'text-yellow-500'
          }`}>
            {getOrderStatusText(order?.status || '')}
          </span>
        </div>
        
        <div className="flex justify-between mb-4">
          <span className="text-text-secondary">Total:</span>
          <span className="font-bold text-primary">
            {formatPrice(order?.total_amount || 0)}
          </span>
        </div>
      </div>
      
      <div className="border-t border-primary pt-6">
        <h2 className="text-xl font-bold text-primary mb-4">Articles commandés</h2>
        
        {orderItems.map((item: any) => (
          <div 
            key={item.id} 
            className="flex justify-between items-center border-b border-primary py-2 last:border-b-0"
          >
            <div>
              <span className="font-bold">{item.products.name}</span>
              <span className="text-text-secondary ml-2">
                × {item.quantity}
              </span>
            </div>
            <span className="font-bold">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/achats/historique" className="robot-button mr-4">
          Voir mes commandes
        </Link>
        <Link href="/achats" className="robot-button">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
};

// Squelette de chargement pour le Suspense
const ConfirmationSkeleton = () => (
  <div className="max-w-2xl mx-auto border border-primary p-8 animate-pulse">
    <div className="h-8 w-3/4 bg-gray-700 rounded mx-auto mb-6"></div>
    
    <div className="space-y-4 mb-6">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-700 rounded"></div>
        <div className="h-4 w-24 bg-gray-700 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-16 bg-gray-700 rounded"></div>
        <div className="h-4 w-16 bg-gray-700 rounded"></div>
      </div>
    </div>
    
    <div className="border-t border-primary pt-6">
      <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-40 bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
    
    <div className="mt-6 flex justify-center space-x-4">
      <div className="h-10 w-32 bg-gray-700 rounded"></div>
      <div className="h-10 w-32 bg-gray-700 rounded"></div>
    </div>
  </div>
);

const PaymentConfirmationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Suspense fallback={<ConfirmationSkeleton />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
};

export default PaymentConfirmationPage;