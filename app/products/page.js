import { supabase } from '../../lib/supabase';
import ProductList from './ProductList';

// Fonction pour récupérer tous les produits
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
  
  return data;
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Nos Produits</h1>
      
      <ProductList products={products} />
    </div>
  );
}
