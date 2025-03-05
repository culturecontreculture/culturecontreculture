import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../lib/supabase';
import { createPayment } from '../../../lib/easytransac';

export async function POST(request) {
  try {
    const { items, total, customer } = await request.json();
    
    // Vérifier les données reçues
    if (!items || !items.length || !total || !customer) {
      return NextResponse.json({ message: 'Données invalides' }, { status: 400 });
    }
    
    // Générer un ID unique pour la commande
    const orderId = uuidv4();
    
    // Créer la commande dans Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          status: 'pending',
          total_amount: total,
          customer_email: customer.email,
          customer_name: `${customer.firstName} ${customer.lastName}`,
          shipping_address: `${customer.address}, ${customer.postalCode} ${customer.city}, ${customer.country}`
        }
      ])
      .select()
      .single();
    
    if (orderError) {
      console.error('Erreur lors de la création de la commande:', orderError);
      return NextResponse.json({ message: 'Erreur lors de la création de la commande' }, { status: 500 });
    }
    
    // Ajouter les produits à la commande
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Erreur lors de l\'ajout des produits à la commande:', itemsError);
      return NextResponse.json({ message: 'Erreur lors de l\'ajout des produits à la commande' }, { status: 500 });
    }
    
    // Créer un paiement avec Easytransac
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const paymentData = {
      orderId: orderId,
      amount: total,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      returnUrl: `${baseUrl}/checkout/success?order=${orderId}`,
      cancelUrl: `${baseUrl}/checkout/cancel?order=${orderId}`
    };
    
    const paymentResponse = await createPayment(paymentData);
    
    if (!paymentResponse || !paymentResponse.success || !paymentResponse.payment_url) {
      console.error('Erreur lors de la création du paiement:', paymentResponse);
      return NextResponse.json({ message: 'Erreur lors de la création du paiement' }, { status: 500 });
    }
    
    // Mettre à jour la commande avec l'ID de transaction
    if (paymentResponse.Tid) {
      await supabase
        .from('orders')
        .update({ payment_id: paymentResponse.Tid })
        .eq('id', orderId);
    }
    
    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      paymentUrl: paymentResponse.payment_url 
    });
    
  } catch (error) {
    console.error('Erreur de serveur:', error);
    return NextResponse.json({ message: 'Erreur de serveur' }, { status: 500 });
  }
}
