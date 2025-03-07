import { Suspense } from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import ProductGrid from '@/components/ui/ProductGrid';
import { FilterCheckbox } from '@/components/client/FilterComponents';

// Récupération de tous les produits depuis Supabase sans pagination
async function getAllProducts(showInactive = false) {
  const supabase = getSupabaseServerClient();
  
  // Requête pour récupérer tous les produits
  let query = supabase
    .from('products')
    .select('*');
  
  // Si showInactive est false, filtre pour n'afficher que les produits actifs
  if (!showInactive) {
    query = query.eq('is_active', true);
  }
  
  // Trier par date de création (les plus récents en premier)
  const { data: products, error } = await query
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return { products: [], count: 0 };
  }
  
  return { 
    products: products || [], 
    count: products ? products.length : 0
  };
}

// Props de la page
interface PageProps {
  searchParams: {
    showInactive?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const showInactive = searchParams.showInactive === 'true';
  
  const { products, count } = await getAllProducts(true); // Récupérer tous les produits
  
  // Filtrer les produits en fonction de showInactive
  const displayedProducts = showInactive 
    ? products 
    : products.filter(product => product.is_active);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-mono text-primary mb-6">Catalogue</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-text-secondary font-mono">
          {displayedProducts.length} article{displayedProducts.length !== 1 ? 's' : ''}
        </div>
        
        <div className="flex items-center space-x-4">
          <FilterCheckbox 
            label="Afficher inactifs" 
            defaultChecked={showInactive} 
          />
        </div>
      </div>
      
      <Suspense fallback={<div className="text-primary font-mono">Chargement des produits...</div>}>
        <ProductGrid products={products} hideInactive={!showInactive} />
      </Suspense>
    </div>
  );
}