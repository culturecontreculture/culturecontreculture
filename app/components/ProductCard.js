'use client';

import Link from 'next/link';

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {product.image_url && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{product.price.toFixed(2)} €</span>
          <div className="space-x-2">
            <Link 
              href={`/products/${product.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Détails
            </Link>
            <button 
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
