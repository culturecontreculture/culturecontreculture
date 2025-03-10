'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/useCart';

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
}

const AddToCartButton = ({ productId, disabled = false }: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();
  
  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await addItem(productId, quantity);
      // Animation de succès
      setTimeout(() => {
        setIsAdding(false);
        // Rediriger vers le panier ou rester sur la page selon la préférence
        router.push('/achats/checkout');
      }, 500);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setIsAdding(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          className="robot-button px-3 py-1"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={disabled || isAdding}
        >
          -
        </button>
        
        <span className="mx-4 w-8 text-center">{quantity}</span>
        
        <button
          className="robot-button px-3 py-1"
          onClick={() => setQuantity(quantity + 1)}
          disabled={disabled || isAdding}
        >
          +
        </button>
      </div>
      
      <button
        className={`robot-button w-full py-3 ${isAdding ? 'bg-primary text-background' : ''}`}
        onClick={handleAdd}
        disabled={disabled || isAdding}
      >
        {isAdding ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ajout en cours...
          </span>
        ) : (
          'Ajouter au panier'
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;