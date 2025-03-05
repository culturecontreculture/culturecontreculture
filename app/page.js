import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Fonction pour récupérer les produits depuis Supabase
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(6);
  
  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
  
  return data;
}

export default async function Home() {
  const products = await getProducts();
  
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-6">Bienvenue sur Ma Boutique</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez nos produits soigneusement sélectionnés pour vous.
        </p>
        <div className="mt-8">
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Voir tous nos produits
          </Link>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Nos produits populaires</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                  <Link 
                    href={`/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <p className="text-center text-gray-500 my-12">
            Aucun produit n'est encore disponible. Revenez bientôt!
          </p>
        )}
      </section>
    </div>
  );
}
