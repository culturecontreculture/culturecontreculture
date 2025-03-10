import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseServerClient } from '@/lib/supabase/client';

// Fonction pour créer la signature EasyTransac
const generateSignature = (data: any, apiKey: string) => {
  // Trier les clés par ordre alphabétique pour garantir la cohérence
  const sortedKeys = Object.keys(data).sort();
  
  // Créer une chaîne de paramètres triée
  let paramString = '';
  for (const key of sortedKeys) {
    if (data[key] !== null && data[key] !== undefined) {
      paramString += key + '=' + data[key] + '&';
    }
  }
  
  // Ajouter la clé API
  paramString += apiKey;
  
  // Créer un hash SHA256
  return crypto.createHash('sha256').update(paramString).digest('hex');
};

// Gestion de la requête POST pour initialiser un paiement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerInfo, orderItems } = body;
    
    // Vérifier que tous les paramètres nécessaires sont présents
    if (!orderId || !amount || !customerInfo) {
      return NextResponse.json({ message: 'Paramètres incomplets' }, { status: 400 });
    }
    
    // Récupérer les clés d'API d'EasyTransac des variables d'environnement
    const apiKey = process.env.EASYTRANSAC_API_KEY;
    const apiSecret = process.env.EASYTRANSAC_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      console.error('Les clés d\'API EasyTransac ne sont pas configurées');
      return NextResponse.json({ message: 'Erreur de configuration' }, { status: 500 });
    }
    
    // Construire l'URL de retour après paiement
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://' + request.headers.get('host')
      : 'http://localhost:3000';
    
    // Données de la requête à EasyTransac
    const requestData = {
      Amount: amount / 100, // Convertir les centimes en euros
      ClientIp: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1',
      OrderId: orderId,
      ReturnUrl: `${baseUrl}/achats/confirmation?orderId=${orderId}`,
      CancelUrl: `${baseUrl}/achats/checkout?error=paiement-annule`,
      NotificationUrl: `${baseUrl}/api/webhooks/easytransac`,
      Description: `Commande #${orderId.substring(0, 8)}`,
      Email: customerInfo.email || '',
      FirstName: customerInfo.first_name || '',
      LastName: customerInfo.last_name || '',
      // Correction: utilisation de la notation entre crochets au lieu d'un identifiant commençant par un chiffre
      "3DS": 'yes', // Activer 3D Secure
      PaymentMethod: 'cb', // Carte bancaire par défaut
    };
    
    // Générer la signature
    const Signature = generateSignature(requestData, apiSecret);
    
    // Construire le corps complet de la requête
    const easytransacRequestBody = {
      ...requestData,
      Signature,
    };
    
    // Appeler l'API EasyTransac
    const response = await fetch('https://www.easytransac.com/api/payment/page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      },
      body: JSON.stringify(easytransacRequestBody),
    });
    
    const responseData = await response.json();
    
    if (!response.ok || responseData.Code !== 'OK') {
      console.error('Erreur EasyTransac:', responseData);
      return NextResponse.json({ 
        message: responseData.Error || 'Erreur lors de l\'initialisation du paiement' 
      }, { status: 500 });
    }
    
    // Mettre à jour la commande avec l'ID de transaction EasyTransac
    const supabase = getSupabaseServerClient();
    await supabase
      .from('orders')
      .update({
        payment_intent_id: responseData.TransactionId || '',
        payment_status: 'processing',
      })
      .eq('id', orderId);
    
    // Renvoyer l'URL de paiement
    return NextResponse.json({ 
      paymentUrl: responseData.Payment.Url,
      transactionId: responseData.TransactionId,
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du paiement:', error);
    return NextResponse.json({ 
      message: 'Erreur serveur' 
    }, { status: 500 });
  }
}