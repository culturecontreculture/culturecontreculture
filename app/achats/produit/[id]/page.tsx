import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { revalidatePath } from 'next/cache';

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

// Formater le prix de centimes en euros avec le symbole €
const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInCents / 100);
};

async function getProduct(id: string) {
  const supabase = getSupabaseServerClient();
  
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !product) {
      console.error('Erreur lors de la récupération du produit:', error);
      return null;
    }
    
    // Forcer la revalidation de ce chemin après chaque requête
    revalidatePath(`/achats/produit/${id}`);
    
    return product;
  } catch (err) {
    console.error('Exception lors de la récupération du produit:', err);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square border border-primary">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background">
              <span className="text-primary text-6xl">?</span>
            </div>
          )}
          
          {!product.is_active && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold px-4 py-2 border border-white text-xl">PRODUIT INACTIF</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-primary mb-4">{product.name}</h1>
          
          <div className="text-xl mb-6">{formatPrice(product.price)}</div>
          
          <div className="mb-8">
            <h2 className="text-text-secondary border-b border-text-secondary pb-2 mb-4">Description</h2>
            <p className="whitespace-pre-line text-text-primary">{product.description || "Aucune description disponible."}</p>
          </div>
          
          {product.is_active ? (
            <div className="mt-auto">
              <div className="mb-4">
                <div className="flex items-center">
                  <span className="mr-2">Stock:</span>
                  <span className={`${product.stock > 0 ? 'text-primary' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'Épuisé'}
                  </span>
                </div>
              </div>
              
              <AddToCartButton 
                productId={product.id} 
                disabled={product.stock <= 0}
              />
            </div>
          ) : (
            <div className="mt-auto">
              <button disabled className="robot-button w-full py-3 opacity-50 cursor-not-allowed">
                Produit indisponible
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}