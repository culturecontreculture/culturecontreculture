'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Récupérer le panier depuis le localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
    setLoading(false);
  }, []);
  
  // Calculer le total du panier
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Mettre à jour la quantité d'un article
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  // Supprimer un article du panier
  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  if (loading) {
    return <div className="text-center py-8">Chargement du panier...</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Votre panier est vide.</p>
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 border rounded-lg p-4"
                >
                  {item.image_url && (
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded" 
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.price.toFixed(2)} € l'unité</p>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded-l"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                      className="w-12 h-8 text-center border-t border-b outline-none" 
                    />
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded-r"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 text-sm hover:underline mt-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="border rounded-lg p-6 bg-gray-50 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{cartTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>{cartTotal.toFixed(2)} €</span>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="bg-blue-600 text-white w-full py-3 rounded text-center block hover:bg-blue-700"
              >
                Passer à la caisse
              </Link>
              
              <Link
                href="/products"
                className="text-blue-600 w-full py-2 text-center block mt-4 hover:underline"
              >
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
