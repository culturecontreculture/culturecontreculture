'use client';

import { useState } from 'react';
import ProductCard from '../../components/ProductCard';

export default function ProductList({ products }) {
  // Gestion du panier
  const addToCart = (product) => {
    // Récupérer le panier actuel
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Mettre à jour la quantité
      existingItem.quantity += 1;
    } else {
      // Ajouter un nouvel article
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }
    
    // Sauvegarder le panier mis à jour
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Déclencher un événement pour notifier que le panier a été mis à jour
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Feedback visuel
    alert(`${product.name} ajouté au panier!`);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          addToCart={addToCart}
        />
      ))}
      
      {products.length === 0 && (
        <p className="col-span-full text-center text-gray-500 my-12">
          Aucun produit n'est disponible pour le moment.
        </p>
      )}
    </div>
  );
}
