'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/supabase/supabase-types';

// Formater le prix de centimes en euros avec le symbole €
const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInCents / 100);
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`robot-card ${!product.is_active ? 'inactive' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square mb-3 overflow-hidden border border-primary">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background">
            <span className="text-primary text-4xl">?</span>
          </div>
        )}
        
        {!product.is_active && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold px-2 py-1 border border-white">INACTIF</span>
          </div>
        )}
      </div>
      
      <h3 className="text-text-primary font-bold mb-1 truncate">{product.name}</h3>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-primary font-bold">{formatPrice(product.price)}</span>
        
        {product.is_active ? (
          <Link href={`/achats/produit/${product.id}`} className="robot-button text-xs">
            Détails
          </Link>
        ) : (
          <button disabled className="robot-button text-xs opacity-50 cursor-not-allowed">
            Indisponible
          </button>
        )}
      </div>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary robot-text">Aucun produit disponible</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;