'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useCart from '@/hooks/useCart';
import { getSupabaseClient } from '@/lib/supabase/client';

// Désactiver le cache pour le client (même si c'est un composant client)
// Cela permet aux autres composants de savoir que cette page ne doit pas être mise en cache

// Formater le prix de centimes en euros avec le symbole €
const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInCents / 100);
};

const CheckoutPage = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
  }, []);
  
  // Fonction pour passer à la page de paiement
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si non authentifié
      router.push('/achats/auth/login?redirect=/achats/checkout');
      return;
    }
    
    if (items.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Créer une commande dans la base de données
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }
      
      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          total_amount: totalPrice,
          status: 'pending',
        })
        .select()
        .single();
      
      if (orderError || !order) {
        throw new Error('Erreur lors de la création de la commande');
      }
      
      // Ajouter les articles de la commande
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        throw new Error('Erreur lors de l\'ajout des articles à la commande');
      }
      
      // Rediriger vers la page de paiement avec l'ID de commande
      router.push(`/achats/paiement/${order.id}`);
      
      // Vider le panier après création de la commande avec succès
      clearCart();
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      alert('Une erreur est survenue lors de la validation de votre panier');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour rafraîchir le panier
  const refreshCart = () => {
    router.refresh();
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Votre Panier</h1>
        <div className="text-center py-12 border border-primary">
          <p className="text-text-secondary mb-6">Votre panier est vide</p>
          <Link href="/achats" className="robot-button">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Votre Panier</h1>
        <button onClick={refreshCart} className="robot-button text-xs">
          Rafraîchir le panier
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border border-primary">
            <div className="p-4 border-b border-primary grid grid-cols-12 text-text-secondary">
              <div className="col-span-6">Produit</div>
              <div className="col-span-2 text-center">Prix</div>
              <div className="col-span-2 text-center">Quantité</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="p-4 border-b border-primary grid grid-cols-12 items-center">
                <div className="col-span-6 flex items-center">
                  <div className="relative w-16 h-16 mr-4 border border-primary">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-background">
                        <span className="text-primary">?</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 mt-1 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                
                <div className="col-span-2 text-center">{formatPrice(item.price)}</div>
                
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      className="robot-button px-2 py-0.5 text-xs"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    
                    <span className="mx-2">{item.quantity}</span>
                    
                    <button
                      className="robot-button px-2 py-0.5 text-xs"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border border-primary p-4">
            <h2 className="text-xl font-bold text-primary mb-4">Résumé</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Articles ({totalItems})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-primary">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            
            <button
              className={`robot-button w-full py-3 ${isLoading ? 'bg-primary text-background' : ''}`}
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>
              ) : (
                'Passer au paiement'
              )}
            </button>
            
            <div className="mt-4">
              <Link href="/achats" className="text-primary text-sm hover:underline block text-center">
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;