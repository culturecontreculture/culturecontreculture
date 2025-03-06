import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Product } from '@/supabase/supabase-types';

// Interface pour un article du panier
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

// Interface pour le state du panier
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

// Créer le hook de panier avec persistance
const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Ajouter un article au panier
      addItem: async (productId, quantity = 1) => {
        const supabase = getSupabaseClient();
        
        // Récupérer les détails du produit
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error || !product) {
          throw new Error('Produit non trouvé');
        }
        
        // Vérifier le stock disponible
        if (product.stock < quantity) {
          throw new Error('Stock insuffisant');
        }
        
        set((state) => {
          // Vérifier si le produit existe déjà dans le panier
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === productId
          );
          
          let newItems;
          if (existingItemIndex > -1) {
            // Mettre à jour la quantité si le produit existe déjà
            newItems = [...state.items];
            const newQuantity = newItems[existingItemIndex].quantity + quantity;
            
            // Vérifier à nouveau le stock pour la nouvelle quantité
            if (newQuantity > product.stock) {
              throw new Error('Stock insuffisant');
            }
            
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newQuantity
            };
          } else {
            // Ajouter un nouvel article
            newItems = [
              ...state.items,
              {
                id: `${productId}-${Date.now()}`,
                productId,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.image_url
              }
            ];
          }
          
          // Calculer le total des articles et le prix total
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          
          return {
            items: newItems,
            totalItems,
            totalPrice
          };
        });
      },

      // Supprimer un article du panier
      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          
          // Recalculer le total des articles et le prix total
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          
          return {
            items: newItems,
            totalItems,
            totalPrice
          };
        });
      },

      // Mettre à jour la quantité d'un article
      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) => 
            item.id === itemId ? { ...item, quantity } : item
          );
          
          // Calculer le total des articles et le prix total
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          
          return {
            items: newItems,
            totalItems,
            totalPrice
          };
        });
      },

      // Vider complètement le panier
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0
        });
      }
    }),
    {
      name: 'minishop-cart-storage', // Nom unique pour le stockage local
      getStorage: () => localStorage // Utiliser le localStorage pour la persistance
    }
  )
);

export default useCart;