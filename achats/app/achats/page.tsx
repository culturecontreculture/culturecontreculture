import { Suspense } from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import ProductGrid from '@/components/ui/ProductGrid';

// Récupération des produits depuis Supabase
async function getProducts(page = 1, limit = 12, active = true) {
  const supabase = getSupabaseServerClient();
  
  // Calculer l'offset basé sur la page et la limite
  const offset = (page - 1) * limit;
  
  // Requête pour récupérer les produits actifs avec pagination
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });
  
  // Filtrer par statut actif si demandé
  if (active) {
    query = query.eq('is_active', true);
  }
  
  // Appliquer la pagination
  const { data: products, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return { products: [], count: 0 };
  }
  
  return { 
    products: products || [], 
    count: count || 0 
  };
}

// Props de la page
interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    showInactive?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');
  const showInactive = searchParams.showInactive === 'true';
  
  const { products, count } = await getProducts(page, limit, !showInactive);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-mono text-primary mb-6">Catalogue</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-text-secondary font-mono">
          {count} article{count !== 1 ? 's' : ''}
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer font-mono text-text-secondary">
            <input 
              type="checkbox" 
              className="mr-2 h-4 w-4 accent-primary"
              defaultChecked={showInactive}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.checked) {
                  url.searchParams.set('showInactive', 'true');
                } else {
                  url.searchParams.delete('showInactive');
                }
                window.location.href = url.toString();
              }}
            />
            Afficher inactifs
          </label>
          
          <select 
            className="bg-background text-text-primary border border-primary p-2 font-mono"
            defaultValue={limit.toString()}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('limit', e.target.value);
              url.searchParams.delete('page'); // Réinitialiser la page
              window.location.href = url.toString();
            }}
          >
            <option value="6">6 par page</option>
            <option value="12">12 par page</option>
            <option value="24">24 par page</option>
            <option value="48">48 par page</option>
          </select>
        </div>
      </div>
      
      <Suspense fallback={<div className="text-primary font-mono">Chargement des produits...</div>}>
        <ProductGrid products={products} />
      </Suspense>
      
      {/* Pagination */}
      {count > limit && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(count / limit) }).map((_, index) => (
              <a
                key={index}
                href={`/achats?page=${index + 1}&limit=${limit}${showInactive ? '&showInactive=true' : ''}`}
                className={`px-4 py-2 border ${
                  page === index + 1
                    ? 'bg-primary text-background'
                    : 'border-primary text-primary'
                } font-mono`}
              >
                {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
