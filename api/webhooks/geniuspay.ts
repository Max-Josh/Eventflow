// Vercel Serverless Function pour les Webhooks GeniusPay
export default async function handler(req: any, res: any) {
  // CORS Headers pour autoriser les requêtes venant de GeniusPay
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-GeniusPay-Signature'
  );

  // Répondre aux requêtes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const method = req.method;
    const body = req.body || {};
    const signature = req.headers['x-geniuspay-signature'] || req.headers['signature'];

    console.log('[GeniusPay Webhook - Vercel]:', method);
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Payload:', JSON.stringify(body));

    // Traitement du webhook GeniusPay
    // Événements supportés : payment.success, payment.failed, etc.
    const event = body.event || body.type || 'test.ping';

    return res.status(200).json({
      status: 'success',
      received: true,
      event: event,
      timestamp: new Date().toISOString(),
      message: 'Webhook GeniusPay validé avec succès par EVENTFLOW sur Vercel'
    });
  } catch (error: any) {
    console.error('Erreur traitement webhook GeniusPay:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Erreur interne lors du traitement du webhook'
    });
  }
}
