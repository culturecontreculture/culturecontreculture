'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-red-100 text-red-800 p-4 rounded-full inline-flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Paiement annulé</h1>
      
      <p className="text-gray-600 mb-8">
        Votre paiement a été annulé. Aucun montant n'a été prélevé.
      </p>
      
      {orderId && (
        <p className="text-gray-600 mb-8">
          Référence de commande: <span className="font-medium">{orderId}</span>
        </p>
      )}
      
      <div className="space-y-4">
        <Link 
          href="/cart" 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 block w-full sm:w-auto sm:inline-block"
        >
          Retour au panier
        </Link>
        
        <Link 
          href="/checkout" 
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 block w-full sm:w-auto sm:inline-block sm:ml-4"
        >
          Réessayer le paiement
        </Link>
      </div>
      
      <p className="mt-8 text-gray-500">
        Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
      </p>
    </div>
  );
}
