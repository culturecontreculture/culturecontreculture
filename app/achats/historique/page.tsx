import { Suspense } from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import { OrderWithDetails, OrderStatus, PaymentStatus } from '@/supabase/supabase-types';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Formater le prix de centimes en euros avec le symbole €
const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInCents / 100);
};

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Fonction pour obtenir le libellé du statut
const getOrderStatusLabel = (status: string) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'En attente';
    case OrderStatus.PAID:
      return 'Payée';
    case OrderStatus.SHIPPED:
      return 'Expédiée';
    case OrderStatus.DELIVERED:
      return 'Livrée';
    case OrderStatus.CANCELLED:
      return 'Annulée';
    default:
      return status;
  }
};

// Récupérer les commandes de l'utilisateur
async function fetchUserOrders(userId: string) {
  const supabase = getSupabaseServerClient();
  
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }
    
    // Forcer la revalidation du chemin
    revalidatePath('/achats/historique');
    
    return orders as OrderWithDetails[];
  } catch (err) {
    console.error('Exception lors de la récupération des commandes:', err);
    return [];
  }
}

// Composant de liste des commandes
const OrderList = async () => {
  const supabase = getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary mb-6">Vous devez être connecté pour voir vos commandes</p>
        <Link href="/achats/auth/login" className="robot-button">
          Se connecter
        </Link>
      </div>
    );
  }
  
  const orders = await fetchUserOrders(session.user.id);
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary robot-text">Aucune commande à afficher</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="robot-card">
          <div className="flex justify-between items-center border-b border-primary pb-2 mb-4">
            <span className="text-text-secondary">
              Commande du {formatDate(order.created_at)}
            </span>
            <span className={`font-bold ${
              order.status === OrderStatus.PAID 
                ? 'text-primary' 
                : order.status === OrderStatus.CANCELLED 
                  ? 'text-red-500' 
                  : 'text-yellow-500'
            }`}>
              {getOrderStatusLabel(order.status)}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            {order.order_items.map((item) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center"
              >
                <div>
                  <span>{item.products.name}</span>
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
          
          <div className="flex justify-between items-center border-t border-primary pt-2">
            <span className="text-text-secondary">Total</span>
            <span className="text-primary font-bold">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default async function OrderHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-mono text-primary mb-6">Historique des commandes</h1>
      
      <Suspense fallback={
        <div className="text-primary font-mono">
          Chargement de vos commandes...
        </div>
      }>
        <OrderList />
      </Suspense>
    </div>
  );
}