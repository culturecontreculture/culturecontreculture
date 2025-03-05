import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ message: 'ID de commande manquant' }, { status: 400 });
    }
    
    // Récupérer les détails de la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (orderError) {
      console.error('Erreur lors de la récupération de la commande:', orderError);
      return NextResponse.json({ message: 'Commande non trouvée' }, { status: 404 });
    }
    
    // Récupérer les articles de la commande
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (
          name,
          image_url
        )
      `)
      .eq('order_id', id);
    
    if (itemsError) {
      console.error('Erreur lors de la récupération des articles de la commande:', itemsError);
      return NextResponse.json({ message: 'Erreur lors de la récupération des articles de la commande' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        items: orderItems
      }
    });
    
  } catch (error) {
    console.error('Erreur de serveur:', error);
    return NextResponse.json({ message: 'Erreur de serveur' }, { status: 500 });
  }
}
