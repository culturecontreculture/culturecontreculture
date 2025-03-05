import axios from 'axios';

const API_KEY = process.env.EASYTRANSAC_API_KEY;
const SANDBOX_MODE = process.env.EASYTRANSAC_API_SANDBOX === 'true';

// URL de l'API Easytransac
const API_URL = 'https://www.easytransac.com/api';

// Fonction pour créer un paiement
export async function createPayment(orderData) {
  try {
    const response = await axios.post(
      `${API_URL}/payment/page`,
      {
        OrderId: orderData.orderId,
        Amount: orderData.amount,
        Currency: 'EUR',
        CustomerEmail: orderData.email,
        CustomerFirstname: orderData.firstName,
        CustomerLastname: orderData.lastName,
        ReturnUrl: orderData.returnUrl,
        CancelUrl: orderData.cancelUrl,
        Sandbox: SANDBOX_MODE,
        // Vous pouvez ajouter d'autres paramètres selon vos besoins
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error.response?.data || error.message);
    throw new Error('Erreur lors de la création du paiement');
  }
}

// Fonction pour vérifier le statut d'un paiement
export async function checkPaymentStatus(transactionId) {
  try {
    const response = await axios.post(
      `${API_URL}/payment/status`,
      {
        Tid: transactionId,
        Sandbox: SANDBOX_MODE,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut du paiement:', error.response?.data || error.message);
    throw new Error('Erreur lors de la vérification du statut du paiement');
  }
}
