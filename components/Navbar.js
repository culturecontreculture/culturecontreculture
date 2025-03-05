'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  
  // Récupérer le nombre d'articles dans le panier depuis le localStorage
  useEffect(() => {
    const getCartCount = () => {
      if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    };
    
    getCartCount();
    
    // Écouter les changements dans le panier
    window.addEventListener('cartUpdated', getCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', getCartCount);
    };
  }, []);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              Ma Boutique
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`hover:text-blue-600 ${pathname === '/' ? 'text-blue-600 font-medium' : ''}`}
            >
              Accueil
            </Link>
            
            <Link 
              href="/products" 
              className={`hover:text-blue-600 ${pathname === '/products' || pathname.startsWith('/products/') ? 'text-blue-600 font-medium' : ''}`}
            >
              Produits
            </Link>
            
            <Link 
              href="/cart" 
              className="relative hover:text-blue-600"
            >
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
