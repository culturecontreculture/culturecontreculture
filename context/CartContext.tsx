'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import useCart, { CartItem } from '@/hooks/useCart';

// Définir le type du contexte du panier
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

// Créer le contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Créer un fournisseur de contexte
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Utiliser le hook useCart pour gérer l'état du panier
  const {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart();

  return (
    <CartContext.Provider 
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte du panier
export const useCartContext = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCartContext doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  
  return context;
};

export default CartContext;