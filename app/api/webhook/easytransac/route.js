import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Vérifiez que les données contiennent les informations nécessaires
    if (!data || !data.Tid || !data.Status) {
      return NextResponse.json({ message: 'Données invalides' }, { status: 400 });
    }
    
    // Récupérer l'ID de la commande à partir du champ OrderId
    const orderId = data.OrderId;
    
    if (!orderId) {
      console.error('ID de commande manquant dans la notification:', data);
      return NextResponse.json({ message: 'ID de commande manquant' }, { status: 400 });
    }
    
    // Déterminer le statut de la commande en fonction du statut du paiement
    let orderStatus;
    
    switch (data.Status) {
      case 'captured':
        orderStatus = 'paid';
        break;
      case 'refused':
        orderStatus = 'cancelled';
        break;
      case 'pending':
        orderStatus = 'pending';
        break;
      default:
        orderStatus = 'pending';
    }
    
    // Mettre à jour le statut de la commande dans Supabase
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: orderStatus,
        payment_id: data.Tid,
        payment_data: data // Stocker toutes les données de paiement
      })
      .eq('id', orderId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      return NextResponse.json({ message: 'Erreur lors de la mise à jour de la commande' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la notification Easytransac:', error);
    return NextResponse.json({ message: 'Erreur de serveur' }, { status: 500 });
  }
}
