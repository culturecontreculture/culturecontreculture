'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        
        if (response.ok) {
          setOrderDetails(data.order);
          
          // Vider le panier après un paiement réussi
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la commande:', error);
      }
      
      setLoading(false);
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  if (loading) {
    return <div className="text-center py-12">Chargement des détails de votre commande...</div>;
  }
  
  if (!orderId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Erreur</h1>
        <p className="text-gray-600 mb-6">Aucun identifiant de commande n'a été fourni.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-green-100 text-green-800 p-4 rounded-full inline-flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Paiement réussi !</h1>
      
      <p className="text-gray-600 mb-8">
        Votre commande a été traitée avec succès. Un e-mail de confirmation a été envoyé à l'adresse que vous avez fournie.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold mb-4">Détails de la commande</h2>
        
        {orderDetails ? (
          <div className="text-left">
            <p className="mb-2">
              <span className="font-medium">Numéro de commande:</span> {orderId}
            </p>
            <p className="mb-2">
              <span className="font-medium">Date:</span> {new Date(orderDetails.created_at).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <span className="font-medium">Total:</span> {orderDetails.total_amount.toFixed(2)} €
            </p>
            <p className="mb-2">
              <span className="font-medium">Statut:</span>{' '}
              <span className="text-green-600 font-medium">Payée</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Les détails de la commande ne sont pas disponibles.</p>
        )}
      </div>
      
      <div className="space-x-4">
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Retour à l'accueil
        </Link>
        <Link href="/products" className="text-blue-600 px-6 py-2 hover:underline">
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
}
