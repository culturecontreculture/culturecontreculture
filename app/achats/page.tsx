import { Suspense } from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import ProductGrid from '@/components/ui/ProductGrid';
import { revalidatePath } from 'next/cache';

// Désactiver le cache pour cette route spécifique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Récupération de tous les produits depuis Supabase sans pagination
async function getAllProducts() {
  const supabase = getSupabaseServerClient();
  
  try {
    // Requête pour récupérer tous les produits, actifs et inactifs
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return { products: [], count: 0 };
    }
    
    // Forcer la revalidation du chemin après avoir obtenu les données
    revalidatePath('/achats');
    
    return { 
      products: products || [], 
      count: products ? products.length : 0
    };
  } catch (err) {
    console.error('Exception lors de la récupération des produits:', err);
    return { products: [], count: 0 };
  }
}

export default async function ProductsPage() {
  const { products, count } = await getAllProducts();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-mono text-primary mb-6">Catalogue</h1>
      
      <div className="mb-6">
        <div className="text-text-secondary font-mono">
          {count} article{count !== 1 ? 's' : ''}
        </div>
      </div>
      
      <Suspense fallback={<div className="text-primary font-mono">Chargement des produits...</div>}>
        <ProductGrid products={products} hideInactive={false} />
      </Suspense>
    </div>
  );
}