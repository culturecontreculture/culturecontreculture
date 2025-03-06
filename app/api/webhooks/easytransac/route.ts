import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseServerClient } from '@/lib/supabase/client';

// Fonction pour vérifier la signature EasyTransac
const verifySignature = (body: any, signature: string) => {
  if (!process.env.EASYTRANSAC_WEBHOOK_SECRET) {
    console.error('EASYTRANSAC_WEBHOOK_SECRET n\'est pas défini');
    return false;
  }
  
  // Supprimer la signature pour la vérification
  const { Signature, ...dataToVerify } = body;
  
  // Trier les clés par ordre alphabétique
  const sortedKeys = Object.keys(dataToVerify).sort();
  
  // Créer une chaîne de paramètres triée
  let paramString = '';
  for (const key of sortedKeys) {
    if (dataToVerify[key] !== null && dataToVerify[key] !== undefined) {
      paramString += key + '=' + dataToVerify[key] + '&';
    }
  }
  
  // Ajouter le secret webhook
  paramString += process.env.EASYTRANSAC_WEBHOOK_SECRET;
  
  // Créer un hash SHA256
  const calculatedSignature = crypto.createHash('sha256').update(paramString).digest('hex');
  
  // Comparer les signatures
  return calculatedSignature === signature;
};

// Gérer les notifications de paiement EasyTransac
export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await request.json();
    
    console.log('Notification EasyTransac reçue:', JSON.stringify(body));
    
    // Vérifier la signature si elle est présente
    if (body.Signature) {
      const isValid = verifySignature(body, body.Signature);
      if (!isValid) {
        console.error('Signature EasyTransac invalide');
        return NextResponse.json({ status: 'error', message: 'Signature invalide' }, { status: 401 });
      }
    }
    
    // Extraire les informations importantes
    const { Status, OrderId, TransactionId } = body;
    
    if (!OrderId) {
      console.error('OrderId manquant dans la notification');
      return NextResponse.json({ status: 'error', message: 'OrderId manquant' }, { status: 400 });
    }
    
    // Mettre à jour la commande dans Supabase
    const supabase = getSupabaseServerClient();
    
    let paymentStatus;
    let orderStatus;
    
    // Mapper le statut EasyTransac vers nos statuts
    switch (Status) {
      case 'captured':
        paymentStatus = 'succeeded';
        orderStatus = 'paid';
        break;
      case 'pending':
        paymentStatus = 'processing';
        orderStatus = 'pending';
        break;
      case 'failed':
      case 'refused':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;
      case 'cancelled':
        paymentStatus = 'cancelled';
        orderStatus = 'cancelled';
        break;
      default:
        paymentStatus = Status;
        orderStatus = 'pending';
    }
    
    // Mettre à jour la commande
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        payment_intent_id: TransactionId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', OrderId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      return NextResponse.json({ status: 'error', message: 'Erreur base de données' }, { status: 500 });
    }
    
    // Si le paiement est réussi, mettre à jour le stock des produits
    if (paymentStatus === 'succeeded') {
      // Récupérer les articles de la commande
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', OrderId);
      
      if (orderItems && orderItems.length > 0) {
        // Mettre à jour le stock de chaque produit
        for (const item of orderItems) {
          // Récupérer le stock actuel
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();
          
          if (product) {
            // Calculer le nouveau stock
            const newStock = Math.max(0, product.stock - item.quantity);
            
            // Mettre à jour le stock
            await supabase
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.product_id);
          }
        }
      }
    }
    
    // Répondre avec succès
    return NextResponse.json({ status: 'success' });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la notification EasyTransac:', error);
    return NextResponse.json({ status: 'error', message: 'Erreur serveur' }, { status: 500 });
  }
}